from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import aiofiles
import subprocess
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Directories
UPLOAD_DIR = ROOT_DIR / "uploads"
OUTPUT_DIR = ROOT_DIR / "outputs"
UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'cliptag-ai-secret-key-2024')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# LLM Config
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    plan: str = "free"
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ContentItem(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    content: str
    created_at: str
    status: str = "completed"
    video_url: Optional[str] = None
    output_url: Optional[str] = None
    captions: Optional[str] = None
    duration: Optional[float] = None

class VideoClipResponse(BaseModel):
    id: str
    status: str
    message: str
    video_url: Optional[str] = None
    output_url: Optional[str] = None
    captions: Optional[str] = None
    ai_summary: Optional[str] = None
    duration: Optional[float] = None

class GenerateStoryRequest(BaseModel):
    topic: str
    style: str = "dramatic"
    length: str = "short"

class GenerateVoiceoverRequest(BaseModel):
    text: str
    voice_style: str = "professional"

class TranscriptionRequest(BaseModel):
    video_description: str

class VideoRankingRequest(BaseModel):
    video_title: str
    niche: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== VIDEO HELPERS ====================

def get_video_duration(file_path: str) -> float:
    """Get video duration in seconds using ffprobe"""
    try:
        cmd = [
            'ffprobe', '-v', 'quiet', '-print_format', 'json',
            '-show_format', '-show_streams', file_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        data = json.loads(result.stdout)
        duration = float(data.get('format', {}).get('duration', 0))
        return duration
    except Exception as e:
        logger.error(f"Error getting video duration: {e}")
        return 0

def process_video_clip(input_path: str, output_path: str, target_duration: int, aspect_ratio: str) -> bool:
    """Process video using ffmpeg - cut to duration and apply aspect ratio"""
    try:
        # Get original duration
        original_duration = get_video_duration(input_path)
        
        # Calculate start time to get the most engaging middle section
        if original_duration > target_duration:
            # Start from 10% into the video to skip intros
            start_time = min(original_duration * 0.1, original_duration - target_duration)
        else:
            start_time = 0
            target_duration = int(original_duration)
        
        # Set filter based on aspect ratio
        if aspect_ratio == "portrait":
            # 9:16 - crop to vertical
            vf_filter = "crop=ih*9/16:ih,scale=1080:1920"
        else:
            # 16:9 - crop to horizontal
            vf_filter = "crop=iw:iw*9/16,scale=1920:1080"
        
        cmd = [
            'ffmpeg', '-y',
            '-ss', str(start_time),
            '-i', input_path,
            '-t', str(target_duration),
            '-vf', vf_filter,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-c:a', 'aac',
            '-b:a', '128k',
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            logger.error(f"FFmpeg error: {result.stderr}")
            # If aspect ratio crop fails, try simpler processing
            cmd_simple = [
                'ffmpeg', '-y',
                '-ss', str(start_time),
                '-i', input_path,
                '-t', str(target_duration),
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-c:a', 'aac',
                output_path
            ]
            result = subprocess.run(cmd_simple, capture_output=True, text=True)
            return result.returncode == 0
        return True
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        return False

# ==================== AI HELPERS ====================

async def generate_ai_content(prompt: str, system_message: str) -> str:
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        logger.error(f"AI generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

async def generate_video_captions(video_info: dict, ai_notes: str = "") -> dict:
    """Generate captions and viral analysis for a video clip"""
    system_message = """You are an expert viral video content creator. Your job is to:
1. Generate engaging captions for short-form video content
2. Analyze what makes content viral
3. Suggest optimal hooks and call-to-actions

Always provide practical, platform-optimized suggestions."""

    notes_context = f"\nUser style notes: {ai_notes}" if ai_notes else ""
    
    prompt = f"""A user uploaded a video with the following details:
- Duration: {video_info.get('duration', 'unknown')} seconds
- Target output: {video_info.get('target_duration', 60)} seconds
- Format: {video_info.get('aspect_ratio', 'portrait')} ({video_info.get('aspect_ratio', '9:16')})
{notes_context}

Generate:
1. A viral caption (2-3 lines max, with emojis)
2. 5 relevant hashtags
3. A hook phrase for the first 3 seconds
4. One call-to-action

Format your response as:
CAPTION: [your caption]
HASHTAGS: [hashtags]
HOOK: [hook phrase]
CTA: [call to action]
SUMMARY: [1 sentence about the optimization applied]"""

    response = await generate_ai_content(prompt, system_message)
    
    # Parse response
    result = {
        "caption": "",
        "hashtags": "",
        "hook": "",
        "cta": "",
        "summary": "This clip was optimized for engagement using hook-first cuts and dynamic pacing."
    }
    
    lines = response.strip().split('\n')
    for line in lines:
        if line.startswith('CAPTION:'):
            result["caption"] = line.replace('CAPTION:', '').strip()
        elif line.startswith('HASHTAGS:'):
            result["hashtags"] = line.replace('HASHTAGS:', '').strip()
        elif line.startswith('HOOK:'):
            result["hook"] = line.replace('HOOK:', '').strip()
        elif line.startswith('CTA:'):
            result["cta"] = line.replace('CTA:', '').strip()
        elif line.startswith('SUMMARY:'):
            result["summary"] = line.replace('SUMMARY:', '').strip()
    
    return result

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hash_password(user_data.password),
        "plan": "free",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id, user_data.email)
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            plan="free",
            created_at=user_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"])
    
    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            plan=user.get("plan", "free"),
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        name=current_user["name"],
        plan=current_user.get("plan", "free"),
        created_at=current_user["created_at"]
    )

# ==================== VIDEO UPLOAD & PROCESSING ====================

@api_router.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a video file and return its ID and duration"""
    # Validate file type
    allowed_types = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload MP4, MOV, AVI, or WebM")
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix or '.mp4'
    filename = f"{file_id}{ext}"
    file_path = UPLOAD_DIR / filename
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Get video duration
    duration = get_video_duration(str(file_path))
    
    # Check if video is too long (max 3 minutes = 180 seconds)
    if duration > 180:
        # Delete the file
        os.remove(file_path)
        raise HTTPException(
            status_code=400, 
            detail=f"Video is too long ({int(duration)}s). Maximum allowed is 3 minutes (180s)."
        )
    
    return {
        "id": file_id,
        "filename": filename,
        "duration": duration,
        "url": f"/api/videos/{filename}"
    }

@api_router.post("/generate/video-clip", response_model=VideoClipResponse)
async def generate_video_clip(
    background_tasks: BackgroundTasks,
    video_id: str = Form(...),
    video_filename: str = Form(...),
    ai_notes: str = Form(""),
    aspect_ratio: str = Form("portrait"),
    target_duration: int = Form(60),
    current_user: dict = Depends(get_current_user)
):
    """Generate a viral clip from an uploaded video"""
    
    # Validate inputs
    if aspect_ratio not in ["portrait", "landscape"]:
        raise HTTPException(status_code=400, detail="Invalid aspect ratio")
    
    if target_duration not in [15, 30, 45, 60, 90, 180]:
        raise HTTPException(status_code=400, detail="Invalid target duration")
    
    input_path = UPLOAD_DIR / video_filename
    if not input_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    # Get original duration
    original_duration = get_video_duration(str(input_path))
    
    # Generate output filename
    output_id = str(uuid.uuid4())
    output_filename = f"{output_id}_clip.mp4"
    output_path = OUTPUT_DIR / output_filename
    
    # Process video
    success = process_video_clip(
        str(input_path), 
        str(output_path), 
        target_duration,
        aspect_ratio
    )
    
    if not success or not output_path.exists():
        raise HTTPException(status_code=500, detail="Failed to process video")
    
    # Generate AI captions
    video_info = {
        "duration": original_duration,
        "target_duration": target_duration,
        "aspect_ratio": aspect_ratio
    }
    
    try:
        ai_result = await generate_video_captions(video_info, ai_notes)
        captions = f"{ai_result['caption']}\n\n{ai_result['hashtags']}"
        ai_summary = ai_result['summary']
    except Exception as e:
        logger.error(f"AI caption generation failed: {e}")
        captions = "🔥 Check out this viral clip!\n\n#viral #content #creator"
        ai_summary = "This clip was optimized for engagement using hook-first cuts and dynamic pacing."
    
    # Get output duration
    output_duration = get_video_duration(str(output_path))
    
    # Save to database
    content_id = str(uuid.uuid4())
    content_doc = {
        "id": content_id,
        "user_id": current_user["id"],
        "type": "clips",
        "title": f"Viral Clip - {target_duration}s {aspect_ratio}",
        "content": captions,
        "video_url": f"/api/videos/{video_filename}",
        "output_url": f"/api/outputs/{output_filename}",
        "captions": captions,
        "ai_summary": ai_summary,
        "duration": output_duration,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    
    return VideoClipResponse(
        id=content_id,
        status="completed",
        message="Clip generated successfully",
        video_url=f"/api/videos/{video_filename}",
        output_url=f"/api/outputs/{output_filename}",
        captions=captions,
        ai_summary=ai_summary,
        duration=output_duration
    )

@api_router.get("/videos/{filename}")
async def serve_video(filename: str):
    """Serve uploaded videos"""
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video not found")
    return FileResponse(file_path, media_type="video/mp4")

@api_router.get("/outputs/{filename}")
async def serve_output(filename: str):
    """Serve processed output videos"""
    file_path = OUTPUT_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Output not found")
    return FileResponse(file_path, media_type="video/mp4")

# ==================== CONTENT ROUTES ====================

@api_router.get("/library", response_model=List[ContentItem])
async def get_library(current_user: dict = Depends(get_current_user)):
    items = await db.content.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return items

@api_router.delete("/library/{item_id}")
async def delete_library_item(item_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.content.delete_one({"id": item_id, "user_id": current_user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted"}

# ==================== STORY VIDEO GENERATION ====================

class StoryVideoRequest(BaseModel):
    transcript: str
    style: str = "dramatic"
    story_length: str = "medium"
    background: str = "minecraft"

class StoryVideoResponse(BaseModel):
    id: str
    status: str
    message: str
    captions: str
    output_url: Optional[str] = None
    style: str
    story_length: str
    background: str

async def generate_story_captions(transcript: str, style: str, story_length: str) -> dict:
    """Generate optimized captions from transcript based on style and length"""
    
    pacing_guide = {
        "short": "aggressive, fast-paced, maximum hook power, quick cuts between phrases",
        "medium": "balanced pacing, natural flow, good rhythm for retention",
        "long": "slower, deliberate, emotional build-up, let moments breathe"
    }
    
    style_guide = {
        "dramatic": "bold emphasis, intense punctuation, powerful delivery",
        "mysterious": "slow reveals, ellipses for tension, enigmatic tone",
        "heartwarming": "gentle flow, emotional beats, touching moments",
        "suspenseful": "cliff-hangers, sudden pauses, edge-of-seat tension",
        "educational": "clear structure, key points highlighted, informative tone"
    }
    
    system_message = """You are an expert at creating viral short-form video captions. 
    Your job is to take a story transcript and format it into perfectly timed caption segments 
    optimized for TikTok, Reels, and Shorts. Each segment should be 1-3 short lines that 
    appear on screen one at a time for maximum retention."""
    
    prompt = f"""Transform this story transcript into viral video captions:

TRANSCRIPT:
{transcript}

STYLE: {style} - {style_guide.get(style, style_guide['dramatic'])}
PACING: {story_length} - {pacing_guide.get(story_length, pacing_guide['medium'])}

Rules:
1. Split into natural caption segments (1-3 short lines each)
2. Each segment should be punchy and hook attention
3. Add "..." for dramatic pauses where appropriate
4. Capitalize key WORDS for emphasis based on the style
5. Keep it exactly as the user wrote - don't change the story
6. Format for vertical video (short lines work better)
7. Add [BEAT] markers where there should be dramatic pauses

Output the formatted captions only, ready for video overlay."""

    try:
        content = await generate_ai_content(prompt, system_message)
        return {
            "captions": content,
            "success": True
        }
    except Exception as e:
        logger.error(f"Caption generation error: {e}")
        # Fallback: just return the original transcript formatted
        return {
            "captions": transcript,
            "success": False
        }

@api_router.post("/generate/story-video", response_model=StoryVideoResponse)
async def generate_story_video(
    request: StoryVideoRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate a viral story video with animated captions"""
    
    # Validate inputs
    valid_styles = ["dramatic", "mysterious", "heartwarming", "suspenseful", "educational"]
    valid_lengths = ["short", "medium", "long"]
    valid_backgrounds = ["minecraft", "roblox", "subway", "satisfying", "cooking", "driving"]
    
    if request.style not in valid_styles:
        raise HTTPException(status_code=400, detail=f"Invalid style. Choose from: {', '.join(valid_styles)}")
    
    if request.story_length not in valid_lengths:
        raise HTTPException(status_code=400, detail=f"Invalid length. Choose from: {', '.join(valid_lengths)}")
    
    if request.background not in valid_backgrounds:
        raise HTTPException(status_code=400, detail=f"Invalid background. Choose from: {', '.join(valid_backgrounds)}")
    
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Story transcript is required")
    
    # Generate optimized captions
    caption_result = await generate_story_captions(
        request.transcript,
        request.style,
        request.story_length
    )
    
    # Save to database
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "story_video",
        "title": f"Story Video: {request.transcript[:40]}...",
        "content": caption_result["captions"],
        "captions": caption_result["captions"],
        "style": request.style,
        "story_length": request.story_length,
        "background": request.background,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    
    return StoryVideoResponse(
        id=item_id,
        status="completed",
        message="Story video captions generated successfully",
        captions=caption_result["captions"],
        output_url=None,  # Video rendering would be done by a separate service
        style=request.style,
        story_length=request.story_length,
        background=request.background
    )

# ==================== OTHER AI GENERATION ROUTES ====================

@api_router.post("/generate/story", response_model=ContentItem)
async def generate_story_legacy(request: GenerateStoryRequest, current_user: dict = Depends(get_current_user)):
    """Legacy story generation endpoint"""
    system_message = """You are a storytelling expert for video content. Create compelling 
    narratives optimized for faceless videos with strong visual descriptions."""
    
    prompt = f"""Create a {request.length} story video script about: {request.topic}
    Style: {request.style}
    
    Include:
    1. Opening scene description
    2. Narrative arc with emotional beats
    3. Visual suggestions for each scene
    4. Voiceover text
    5. Closing/conclusion
    
    Make it engaging for social media audiences."""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "story",
        "title": f"Story: {request.topic[:50]}",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

@api_router.post("/generate/voiceover", response_model=ContentItem)
async def generate_voiceover(request: GenerateVoiceoverRequest, current_user: dict = Depends(get_current_user)):
    system_message = """You are a professional voiceover script writer. Optimize text for 
    natural speech patterns, pacing, and engagement."""
    
    prompt = f"""Transform this text into an optimized voiceover script:
    
    Original text: {request.text}
    Voice style: {request.voice_style}
    
    Provide:
    1. Optimized script with natural pauses (marked with ...)
    2. Emphasis suggestions (marked with *word*)
    3. Pacing notes
    4. Emotion/tone guidance for each section"""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "voiceover",
        "title": f"Voiceover: {request.text[:50]}...",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

@api_router.post("/generate/transcription", response_model=ContentItem)
async def generate_transcription(request: TranscriptionRequest, current_user: dict = Depends(get_current_user)):
    system_message = """You are an expert at creating video transcriptions and captions. 
    Generate accurate, well-formatted transcriptions with timestamps."""
    
    prompt = f"""Create a sample transcription template for a video about: {request.video_description}
    
    Include:
    1. Formatted timestamps [00:00]
    2. Speaker labels if multiple speakers
    3. Caption-ready segments (short, readable lines)
    4. Notes for sound effects or music cues [SFX] [MUSIC]
    
    Make it suitable for YouTube subtitles and social media captions."""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "transcription",
        "title": f"Transcription: {request.video_description[:50]}",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

@api_router.post("/generate/ranking", response_model=ContentItem)
async def generate_ranking(request: VideoRankingRequest, current_user: dict = Depends(get_current_user)):
    system_message = """You are a YouTube SEO and video ranking expert. Provide actionable 
    optimization strategies based on current best practices."""
    
    prompt = f"""Analyze and provide ranking optimization for:
    Video Title: {request.video_title}
    Niche: {request.niche}
    
    Provide:
    1. SEO Score estimate (out of 100)
    2. Title optimization suggestions
    3. Recommended tags (15-20 tags)
    4. Description template
    5. Thumbnail suggestions
    6. Best posting times
    7. Competitor analysis tips
    8. Engagement strategy"""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "ranking",
        "title": f"Ranking: {request.video_title[:50]}",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

@api_router.post("/generate/split-screen", response_model=ContentItem)
async def generate_split_screen(
    video_topic: str = Form(...),
    style: str = Form("engaging"),
    duration: str = Form("60s"),
    current_user: dict = Depends(get_current_user)
):
    system_message = """You are an expert in creating split-screen video content. 
    Design engaging layouts and content strategies for dual-view videos."""
    
    prompt = f"""Create a split-screen video concept for: {video_topic}
    Duration: {duration}
    Style: {style}
    
    Include:
    1. Left panel content description
    2. Right panel content description
    3. Synchronization points
    4. Transition suggestions
    5. Audio strategy (which side has main audio)
    6. Text overlay suggestions
    7. Engagement hooks for both panels"""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "split_screen",
        "title": f"Split Screen: {video_topic[:50]}",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

# ==================== USER PROFILE ROUTES ====================

@api_router.put("/profile")
async def update_profile(
    name: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    update_data = {}
    if name:
        update_data["name"] = name
    
    if update_data:
        await db.users.update_one(
            {"id": current_user["id"]},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"id": current_user["id"]}, {"_id": 0})
    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        name=updated_user["name"],
        plan=updated_user.get("plan", "free"),
        created_at=updated_user["created_at"]
    )

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "ClipTag AI API", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ClipTag AI"}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
