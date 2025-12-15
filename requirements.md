# ClipTag AI - Requirements & Architecture

## Original Problem Statement
Build ClipTag AI - a production-ready AI video tool SaaS. Main feature: Generate Clips where users upload video (max 3 min), choose format (portrait 9:16 / landscape 16:9), choose duration (15s-180s), add optional AI notes, and get processed viral clip with captions.

## User Choices
- AI Model: GPT-4o via Emergent LLM Key
- Authentication: JWT-based (email + password)
- Payment: UI-only (no Stripe integration yet)
- Theme: Dark with neon orange (#FF5F1F)
- Contact Email: morteglobalonline@gmail.com

## Architecture

### Tech Stack
- **Frontend**: React 19 + TailwindCSS + Shadcn/UI
- **Backend**: FastAPI (Python) + FFmpeg for video processing
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o via Emergent Integrations

### Core Feature: Generate Clips
User uploads video → AI processes → Outputs viral clip
- Video upload (drag & drop, max 3 minutes)
- Format selection: Portrait (9:16) / Landscape (16:9)
- Duration selection: 15s, 30s, 45s, 60s, 90s, 180s
- AI Notes (optional style guidance)
- Output: Processed video + AI-generated captions

### Backend Endpoints
- `POST /api/upload/video` - Upload video file
- `POST /api/generate/video-clip` - Process and generate clip
- `GET /api/videos/{filename}` - Serve uploaded videos
- `GET /api/outputs/{filename}` - Serve processed outputs
- `POST /api/generate/story` - Story video scripts
- `POST /api/generate/voiceover` - Voiceover scripts
- `POST /api/generate/transcription` - Video transcriptions
- `POST /api/generate/ranking` - SEO analysis
- `POST /api/generate/split-screen` - Split screen concepts

### Frontend Pages
1. **Public**: Home, Features, Pricing, FAQ, Contact, Terms, Privacy, Login, Register
2. **Dashboard**: Dashboard, Library, Profile, Clips, Story, Voiceover, Transcription, Ranking, Split Screen

## Completed Tasks
- [x] Video upload with drag & drop
- [x] Video preview before processing
- [x] Format selector (Portrait/Landscape)
- [x] Duration selector (15s-180s)
- [x] AI Notes field
- [x] FFmpeg video processing
- [x] AI-generated captions
- [x] Output video preview and download
- [x] Content library storage
- [x] Updated FAQ with video upload questions
- [x] All 6 AI tools functional
- [x] JWT authentication
- [x] Dark theme with neon orange accents

## Next Tasks
1. **Stripe Integration** - Implement subscription payments
2. **Email Verification** - Add email confirmation
3. **Usage Tracking** - Implement plan-based limits
4. **Real Audio Processing** - Add actual voiceover generation
5. **Auto Captions on Video** - Burn captions into video output

## Pricing Structure
- **Standard**: $7.99/month (25% off annual)
- **Pro**: $24.99/month (25% off annual)
