from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
    type: str  # clips, story, voiceover, transcription, split_screen, ranking
    title: str
    content: str
    created_at: str
    status: str = "completed"

class ContentCreate(BaseModel):
    type: str
    title: str
    prompt: str

class GenerateClipsRequest(BaseModel):
    video_topic: str
    style: str = "engaging"
    duration: str = "60s"

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

# ==================== AI GENERATION ROUTES ====================

@api_router.post("/generate/clips", response_model=ContentItem)
async def generate_clips(request: GenerateClipsRequest, current_user: dict = Depends(get_current_user)):
    system_message = """You are a viral video content expert. Generate engaging video clip scripts 
    that are optimized for social media. Include hooks, key points, and calls to action."""
    
    prompt = f"""Create a {request.duration} viral video clip script about: {request.video_topic}
    Style: {request.style}
    
    Include:
    1. A strong hook (first 3 seconds)
    2. Key talking points
    3. Visual suggestions
    4. A compelling call to action
    
    Format the response clearly with sections."""
    
    content = await generate_ai_content(prompt, system_message)
    
    item_id = str(uuid.uuid4())
    content_doc = {
        "id": item_id,
        "user_id": current_user["id"],
        "type": "clips",
        "title": f"Clip: {request.video_topic[:50]}",
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "completed"
    }
    
    await db.content.insert_one(content_doc)
    return ContentItem(**content_doc)

@api_router.post("/generate/story", response_model=ContentItem)
async def generate_story(request: GenerateStoryRequest, current_user: dict = Depends(get_current_user)):
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
async def generate_split_screen(request: GenerateClipsRequest, current_user: dict = Depends(get_current_user)):
    system_message = """You are an expert in creating split-screen video content. 
    Design engaging layouts and content strategies for dual-view videos."""
    
    prompt = f"""Create a split-screen video concept for: {request.video_topic}
    Duration: {request.duration}
    Style: {request.style}
    
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
        "title": f"Split Screen: {request.video_topic[:50]}",
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
