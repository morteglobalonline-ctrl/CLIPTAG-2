# ClipTag AI - Requirements & Architecture

## Original Problem Statement
Build ClipTag AI - a production-ready AI video tool SaaS with Viblo.ai as UX reference. Features JWT auth, AI-powered content generation tools, dark theme with neon orange accents, and affordable pricing positioning.

## User Choices
- AI Model: GPT-4o via Emergent LLM Key
- Authentication: JWT-based (email + password)
- Payment: UI-only (no Stripe integration yet)
- Theme: Dark with neon orange (#FF5F1F)
- Contact Email: morteglobalonline@gmail.com

## Architecture

### Tech Stack
- **Frontend**: React 19 + TailwindCSS + Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o via Emergent Integrations

### Backend Structure
```
/app/backend/
├── server.py          # Main FastAPI app with all routes
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

### Frontend Structure
```
/app/frontend/src/
├── App.js                    # Main router
├── context/AuthContext.js    # JWT auth context
├── components/
│   ├── layout/              # Navbar, Footer, Sidebar, DashboardLayout
│   ├── ui/                  # Shadcn components
│   └── ProtectedRoute.js    # Auth protection
└── pages/
    ├── HomePage.js          # Landing page
    ├── FeaturesPage.js      # Features overview
    ├── PricingPage.js       # Pricing plans
    ├── FAQPage.js           # FAQ accordion
    ├── ContactPage.js       # Contact form
    ├── TermsPage.js         # Terms of Service
    ├── PrivacyPage.js       # Privacy Policy
    ├── LoginPage.js         # Login
    ├── RegisterPage.js      # Registration
    ├── DashboardPage.js     # Main dashboard
    ├── LibraryPage.js       # User content library
    ├── ProfilePage.js       # User profile
    ├── ClipsPage.js         # AI clip generation
    ├── StoryPage.js         # AI story generation
    ├── VoiceoverPage.js     # AI voiceover scripts
    ├── TranscriptionPage.js # AI transcription
    ├── RankingPage.js       # SEO optimization
    └── SplitScreenPage.js   # Split screen content
```

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/library` - Get user content
- `DELETE /api/library/{id}` - Delete content
- `PUT /api/profile` - Update profile
- `POST /api/generate/clips` - Generate clip scripts
- `POST /api/generate/story` - Generate stories
- `POST /api/generate/voiceover` - Generate voiceover scripts
- `POST /api/generate/transcription` - Generate transcriptions
- `POST /api/generate/ranking` - SEO analysis
- `POST /api/generate/split-screen` - Split screen concepts

## Completed Tasks
- [x] Dark theme with neon orange (#FF5F1F) accents
- [x] Custom fonts (Outfit, Manrope, JetBrains Mono)
- [x] Public pages (Home, Features, Pricing, FAQ, Contact, Terms, Privacy)
- [x] JWT authentication (Register, Login, Protected routes)
- [x] Dashboard with 6 AI tools
- [x] AI content generation via GPT-4o
- [x] Content library with CRUD
- [x] User profile management
- [x] Responsive design
- [x] All data-testid attributes

## Next Tasks
1. **Stripe Integration** - Implement payment processing for subscriptions
2. **Email Verification** - Add email confirmation on registration
3. **Password Reset** - Implement forgot password flow
4. **Usage Limits** - Track and limit API usage by plan
5. **Google OAuth** - Add social login option
6. **Real Video Processing** - Integrate actual video processing capabilities
7. **Export Features** - Allow downloading generated content in various formats
8. **Analytics Dashboard** - Track content performance metrics

## Pricing Structure
- **Standard**: $7.99/month (25% off annual)
- **Pro**: $24.99/month (25% off annual)
