# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev          # Start development server with tsx + .env
npm run build        # Compile TypeScript to JavaScript (outputs to ./backend)
npm start            # Run compiled JavaScript
npm install          # Install dependencies
```

### Testing
```bash
npm test                     # Run all tests with Jest
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Run tests with coverage report
npm run test:coverage:watch  # Run tests with coverage in watch mode
```

### Docker
```bash
docker-compose up -d         # Start full stack (MongoDB, backend, Nginx)
docker build -t cs-backend . # Build backend image
```

## Architecture Overview

### Core Technology Stack
- **Backend**: Node.js/TypeScript with Express 5
- **Database**: MongoDB via Mongoose
- **AI Processing**: Gemini AI for video analysis
- **Video Processing**: FFmpeg via fluent-ffmpeg for compression
- **Authentication**: Steam OAuth via Passport
- **API Documentation**: Swagger UI (development only)

### Project Structure
```
src/
├── index.ts                    # Application entry point
├── config/ffmpeg.ts            # FFmpeg configuration and initialization
├── controllers/                # Business logic controllers
│   ├── authentication.ts      # Steam OAuth logic
│   ├── generation.ts           # AI analysis controller
│   ├── upload.ts              # Video upload processor
│   ├── db/                    # Database layer
│   └── llms/                  # LLM integrations
├── routes/v1/                 # API route definitions
│   ├── auth.ts                # Authentication routes
│   ├── generation.ts          # Video analysis endpoints
│   ├── user.ts                # User management
│   └── docs.ts                # Swagger documentation
├── types/                     # TypeScript type definitions
└── utils/videoCompressor.ts   # Video compression utilities
```

### Key Features
- **Video Upload**: Handles multiple formats (mp4, avi, mov, webm, etc.)
- **Auto Compression**: Videos >20MB compressed using FFmpeg presets
- **AI Analysis**: Gemini integration for CS gameplay analysis
- **Steam Authentication**: OAuth integration for user management

## Environment Configuration

Required `.env` variables:
```bash
NODE_ENV=development
PORT=3000
LLM_PROVIDER=gemini
LLM_API_KEY=your_gemini_api_key
AZURE_COSMOS_CONNECTIONSTRING=mongodb://localhost:27017/cs_analyzer
SESSION_SECRET=your_session_secret
DOMAIN=http://localhost:3000/
STEAM_RETURN_URL=http://localhost:3000/auth/
STEAM_API_KEY=your_steam_api_key
```

## API Endpoints

### Core Endpoints
- `POST /api/v1/generation/upload` - Upload video files (multipart/form-data)
- `POST /api/v1/generation/generate` - Analyze uploaded video
- `GET /auth/steam` - Initiate Steam OAuth
- `GET /auth/steam/return` - Steam OAuth callback
- `GET /api/v1/docs` - Swagger UI (development only)

### Static Assets
- `GET /` - Serves `static/index.html`
- `GET /static/*` - Static file serving

## FFmpeg Requirements

FFmpeg must be installed system-wide:
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian  
sudo apt update && sudo apt install -y ffmpeg

# Verification
ffmpeg -version
```

The application checks FFmpeg availability at startup via `src/config/ffmpeg.ts:95`.

## Development Notes

### TypeScript Configuration
- Output directory: `./backend`
- Target: ES2024
- Strict mode: disabled
- Module: ESNext with Node resolution

### Database Connection
- Uses `AZURE_COSMOS_CONNECTIONSTRING` environment variable
- Connection established in `src/index.ts:65`
- Database operations in `src/controllers/db/`

### Authentication Flow
- Steam OAuth integration
- Session-based authentication
- Auth middleware applied after generation routes

### Video Processing Pipeline
1. Upload via multer to `uploads/` directory
2. Compression check (>20MB triggers FFmpeg processing)
3. Gemini AI analysis (current limit ~20MB base64)
4. Response with analysis results

## Testing Framework
- Jest with ts-jest transformer
- Configuration in `jest.config.js`
- Test files in `tests/` directory
- Run individual tests: `jest tests/specific.test.ts`