# 🎮 CS Analyzer Backend

## Description
AI-powered video analysis system for Counter-Strike gameplay using Gemini LLM with FFmpeg video compression and Docker containerization.

## Version
0.0.1

## Author
Ariadne & Munchkin

## License
SEE LICENSE IN LICENSE.MD

## 🚀 Quick Start

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Docker (Recommended)**
```bash
# Build image
docker build -t cs-backend .

# Run locally
docker run -p 3000:3000 cs-backend
```

### **Azure Container Registry**
```bash
# Pull from registry
docker pull csanalyzer.azurecr.io/cs-backend:latest

# Run from registry
docker run -p 3000:3000 csanalyzer.azurecr.io/cs-backend:latest

# Push your build
az acr login --name <ACR_NAME>
docker tag cs-backend <ACR_NAME>.azurecr.io/cs-backend:latest
docker push <ACR_NAME>.azurecr.io/cs-backend:latest
```

## 📚 Documentation

- 🐳 **[Docker Setup](DOCKER_README.md)** - Complete Docker configuration guide
- 📽️ **[FFmpeg Setup](FFMPEG_SETUP.md)** - Video compression system
- ☁️ **[Container Registry](CONTAINER_REGISTRY.md)** - Azure deployment guide
- 🔧 **[API Documentation](http://localhost:3000/docs)** - Swagger interface

## ⚙️ Architecture

### **Core Components**
- **Express.js API** - REST endpoints for video upload and analysis
- **Gemini LLM** - AI-powered gameplay analysis and content generation
- **FFmpeg Integration** - Video compression and optimization
- **MongoDB** - Data persistence and user management
- **Docker Container** - Production-ready deployment

### **Project Structure**
```
cs_backend/
├── 📄 Configuration Files
│   ├── package.json          # Dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration
│   ├── jest.config.js        # Testing setup
│   ├── dockerfile            # Container definition
│   └── docker-compose.yml    # Multi-service orchestration
│
├── 🚀 Source Code (src/)
│   ├── index.ts              # Application entry point
│   ├── config/
│   │   └── ffmpeg.ts         # FFmpeg configuration
│   ├── controllers/
│   │   ├── authentication.ts # User authentication
│   │   ├── generation.ts     # AI content generation
│   │   ├── upload.ts         # Video upload handling
│   │   ├── db/
│   │   │   ├── database.ts   # MongoDB connection
│   │   │   └── schemas.ts    # Data models
│   │   └── llms/
│   │       └── gemini_implementation.ts # AI integration
│   ├── routes/v1/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── generation.ts     # Analysis routes
│   │   ├── user.ts           # User management
│   │   └── docs.ts           # API documentation
│   ├── types/                # TypeScript definitions
│   └── utils/
│       └── videoCompressor.ts # FFmpeg wrapper
│
├── 📋 Documentation
│   ├── DOCKER_README.md      # Docker setup guide
│   ├── FFMPEG_SETUP.md       # Video processing guide
│   └── CONTAINER_REGISTRY.md # Azure deployment guide
│
├── 🧪 Testing
│   └── tests/tests.test.ts   # Unit tests
│
└── 🔧 CI/CD
    └── .github/workflows/    # GitHub Actions
```

## 🛠️ Features

### **Video Processing**
- ✅ **Multi-format support** - MP4, AVI, MOV, etc.
- ✅ **Smart compression** - 3 quality levels (low/medium/high)
- ✅ **Size optimization** - Automatic compression for Gemini API limits
- ✅ **Metadata extraction** - Duration, resolution, codec information

### **AI Analysis**
- 🤖 **Gemini Integration** - Advanced video understanding
- 📊 **Gameplay Analysis** - Strategic insights and recommendations
- 🎯 **Content Generation** - Automated descriptions and highlights
- 🔄 **Batch Processing** - Multiple video analysis support

### **API Endpoints**
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/generation/upload` - Video upload with compression
- `POST /api/v1/generation/` - AI analysis and content generation
- `GET /api/v1/user/profile` - User management
- `GET /docs` - Interactive API documentation

## 🔧 Dependencies

### **Core Framework**
*   `express`: 5.1.0 - Web application framework
*   `typescript`: Latest - Type-safe JavaScript development
*   `@types/node`: Latest - Node.js type definitions

### **AI & Video Processing**
*   `@google/genai`: 1.4.0 - Gemini AI integration
*   `fluent-ffmpeg`: Latest - FFmpeg wrapper for video processing
*   `ffmpeg-static`: Latest - Static FFmpeg binary

### **Database & Session**
*   `mongodb`: Latest - MongoDB driver
*   `express-session`: 1.18.1 - Session management
*   `mongoose`: Latest - MongoDB object modeling

### **Development Tools**
*   `jest`: Latest - Testing framework
*   `nodemon`: Latest - Development auto-reload
*   `swagger-ui-express`: Latest - API documentation

## 🚀 Environment Setup

### **Required Environment Variables**
Create a `.env` file based on `.env.example`:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# AI Configuration
LLM_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cs_analyzer

# Session Configuration
SESSION_SECRET=your_session_secret_here

# FFmpeg Configuration (optional)
FFMPEG_PRESET=medium
MAX_FILE_SIZE=100MB
```

### **Required Software**
- **Node.js** 18+ with npm
- **FFmpeg** (included in Docker)
- **MongoDB** (or MongoDB Atlas)
- **Docker** (optional but recommended)

## 🐳 Docker Deployment

### **Local Docker Setup**
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# Check logs
npm run docker:logs

# Stop services
npm run docker:down
```

### **Production Deployment**
```bash
# Build production image
docker build -t cs-backend .

# Run with production settings
docker run -d \
  --name cs-backend-prod \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e LLM_API_KEY="your_key" \
  cs-backend
```

## ☁️ Azure Container Registry

### **Automated Deployment**
1. Push to `Generation_Controller` branch
2. GitHub Actions builds and pushes to registry
3. Deploy using Azure Container Instances or Web Apps

### **Manual Deployment**
```bash
# Pull latest image
docker pull csanalyzer.azurecr.io/cs-backend:latest

# Deploy to Azure Container Instance
az container create \
  --resource-group cs_analyzer_dev \
  --name cs-backend \
  --image csanalyzer.azurecr.io/cs-backend:latest \
  --dns-name-label cs-backend \
  --ports 3000
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 API Usage Examples

### **Upload and Analyze Video**
```bash
# Upload video file
curl -X POST \
  -F "video=@gameplay.mp4" \
  http://localhost:3000/api/v1/generation/upload

# Generate analysis
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"videoId": "uploaded_video_id"}' \
  http://localhost:3000/api/v1/generation/
```

### **User Authentication**
```bash
# Login user
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "player1", "password": "password"}' \
  http://localhost:3000/api/v1/auth/login
```

## 🔧 Troubleshooting

### **Common Issues**

**FFmpeg not found:**
```bash
# Install FFmpeg locally
npm install ffmpeg-static

# Or use Docker (recommended)
npm run docker:up
```

**MongoDB connection error:**
```bash
# Check MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Or use Docker MongoDB
docker run -d -p 27017:27017 mongo:latest
```

**TypeScript compilation errors:**
```bash
# Clean build
npm run clean
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the terms specified in LICENSE.MD.

## 🔗 Related Projects

- **Frontend:** CS Analyzer Web Interface
- **Mobile:** CS Analyzer Mobile App
- **Analytics:** CS Analyzer Dashboard

---

🎮 **Ready to analyze your Counter-Strike gameplay!** 🚀
*   `helmet`: 8.1.0
*   `mongoose`: 8.15.1
*   `passport`: 0.7.0
*   `passport-steam`: 1.0.18

## Development Dependencies
*   `@jest/globals`: 30.0.0-beta.3
*   `@types/express`: 5.0.3
*   `@types/express-session`: 1.18.2
*   `@types/passport-steam`: 1.0.6
*   `@types/typescript`: 0.4.29
*   `jest`: 29.7.0
*   `ts-jest`: 29.3.4
*   `tsx`: 4.19.4
*   `typescript`: 5.8.3

## Scripts
*   `test`: Run tests using Jest.
*   `test:watch`: Run tests in watch mode.
*   `test:coverage`: Generate test coverage report.
*   `test:coverage:watch`: Generate test coverage report in watch mode.
*   `start:dev`: (Script not defined in package.json)

## Endpoints

The application exposes the following endpoints:

*   `GET /`: Returns a JSON object with the message `API running`.
*   `/api/v1/auth`: Handles authentication-related routes (defined in `src/routes/v1/auth.ts`).
*   `/api/v1/users`: Handles user-related routes (defined in `src/routes/v1/user.ts`).
