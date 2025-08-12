# 🎮 CS Analyzer Backend

Backend en Node.js/TypeScript para analizar partidas de Counter‑Strike usando Gemini, con subida de vídeos, compresión vía FFmpeg y autenticación con Steam.

## Versión
0.0.1

## Autoría
Ariadne & Munchkin

## Licencia
SEE LICENSE IN LICENSE.MD

## 🚀 Puesta en marcha

### Desarrollo local
```bash
# Instalar dependencias
npm install

# Arrancar en modo desarrollo (tsx + .env)
npm run dev

# Compilar a JavaScript (salida en ./backend)
npm run build

# Ejecutar compilado
npm start
```

### Docker (opcional)
```bash
# Construir imagen
docker build -t cs-backend .

# Ejecutar (recuerda pasar variables de entorno necesarias)
docker run -p 3000:3000 cs-backend
```

### Azure Container Registry (opcional)
```bash
# Pull de la última imagen
docker pull csanalyzer.azurecr.io/cs-backend:latest

# Ejecutar la imagen del registro
docker run -p 3000:3000 csanalyzer.azurecr.io/cs-backend:latest

# Publicar tu build
az acr login --name <ACR_NAME>
docker tag cs-backend <ACR_NAME>.azurecr.io/cs-backend:latest
docker push <ACR_NAME>.azurecr.io/cs-backend:latest
```

## 📚 Documentación

- �️ FFmpeg: ver notas en `src/config/ffmpeg.ts`
- 🧪 Tests: `jest` con configuración en `jest.config.js`
- � API Docs (solo en desarrollo): `http://localhost:3000/api/v1/docs`
  - Spec: `http://localhost:3000/api/v1/docs/swagger.json`

## ⚙️ Arquitectura

### Componentes clave
- Express 5 (API REST)
- Gemini (vía `@google/genai`) para análisis de vídeo
- FFmpeg (vía `fluent-ffmpeg`) para compresión/optimización
- MongoDB (vía `mongoose`)
- Autenticación con Steam (Passport + `passport-steam` + sesiones)

### Estructura del proyecto
```
src/
├─ index.ts                 # entrypoint
├─ config/ffmpeg.ts         # checks y presets
├─ controllers/             # auth, upload, generation, db
├─ routes/v1/               # auth, generation, user, docs
├─ types/                   # tipos TS
└─ utils/videoCompressor.ts # wrapper de compresión
```

## 🛠️ Funcionalidades

### Procesamiento de vídeo
- Soporte múltiples formatos (mp4, avi, mov, webm…)
- Compresión automática si > 20MB (presets low/medium/high)
- Extracción de metadatos básicos

### Análisis con IA
- Integración con Gemini
- Límite actual práctico ≈ 20MB por vídeo (antes de base64)

## 🔌 Endpoints actuales

- Raíz y estáticos
  - `GET /` → sirve `static/index.html`
  - `GET /static/*` y activos (`/main.js`, `favicon`, …)

- Autenticación (Steam)
  - `GET /auth/steam`
  - `GET /auth/steam/return`
  - `GET /auth/logout`

- Generación/Análisis
  - `POST /api/v1/generation/upload`  → multipart/form-data (campo `video`)
    - Respuesta: nombre de archivo procesado y datos de compresión
  - `POST /api/v1/generation/generate`
    - Estado actual: usa un vídeo fijo `uploads/subject_1.mp4` (parámetro `videoName` aún no aplicado)

- Usuarios
  - `GET /api/v1/users` (placeholder)

- Documentación (solo en `NODE_ENV=development`)
  - `GET /api/v1/docs` (UI)
  - `GET /api/v1/docs/swagger.json`

## ▶️ Ejemplos de uso (cURL)

Subir vídeo:
```bash
curl -X POST \
  -F "video=@gameplay.mp4" \
  http://localhost:3000/api/v1/generation/upload
```

Lanzar análisis (estado actual usa un vídeo de ejemplo en `uploads`):
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"videoName":"subject_1.mp4"}' \
  http://localhost:3000/api/v1/generation/generate
```

Iniciar login con Steam (navegador):
- `http://localhost:3000/auth/steam`

## � Variables de entorno

Crear `.env` en la raíz. Valores típicos:
```bash
# Servidor
NODE_ENV=development
PORT=3000

# LLM
LLM_PROVIDER=gemini
LLM_API_KEY=tu_api_key_de_gemini

# Base de datos (usa este nombre en el código actual)
AZURE_COSMOS_CONNECTIONSTRING=mongodb://localhost:27017/cs_analyzer

# Sesiones y Steam (obligatorios para auth)
SESSION_SECRET=tu_session_secret
DOMAIN=http://localhost:3000/
STEAM_RETURN_URL=http://localhost:3000/auth/
STEAM_API_KEY=tu_api_key_de_steam
```

Notas:
- La documentación Swagger solo se monta en desarrollo.
- El código usa `AZURE_COSMOS_CONNECTIONSTRING` para conectar vía `mongoose`. Si prefieres `MONGODB_URI`, añade lógica o ajusta la variable.
- No se usa `swagger-ui-express`; se sirve UI usando `swagger-ui-dist` + rutas personalizadas.
- No se incluye `ffmpeg-static`; instala FFmpeg en el sistema o usa Docker.

## 📦 Dependencias relevantes

- Runtime
  - express 5.1.0, helmet 8.1.0
  - mongoose 8.15.1, express-session 1.18.1, multer 2.0.1
  - passport 0.7.0, passport-steam 1.0.18
  - fluent-ffmpeg 2.1.3, swagger-ui-dist 5.24.1
- Desarrollo
  - typescript 5.8.3, tsx 4.19.4
  - jest 29.7.0, ts-jest 29.3.4, @types/*
  - @google/genai 1.4.0 (usado en runtime; considera moverlo a dependencies para despliegues de producción)

## 🧪 Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

## � Solución de problemas

FFmpeg no encontrado (requerido para comprimir):
```bash
# macOS (Homebrew)
brew install ffmpeg

# Ubuntu/Debian
sudo apt update && sudo apt install -y ffmpeg
```

MongoDB no arranca o no conecta:
```bash
mongosh --eval "db.adminCommand('ping')"
```

Compilación TypeScript:
```bash
npx tsc --noEmit
```

## 🤝 Contribuir

1. Crea rama: `git checkout -b feat/lo-que-sea`
2. Commits: `git commit -m "feat: ..."`
3. Push y PR

---

🎮 ¡Listo para analizar tus partidas de Counter‑Strike!
