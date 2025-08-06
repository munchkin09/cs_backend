FROM node:22-alpine AS builder


# Create app directory
WORKDIR /build

COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Stage 2: producción
FROM node:22-alpine AS production
# Instala solo FFmpeg runtime
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY --from=builder /build/backend ./backend
COPY --from=builder /build/.env .env
COPY --from=builder /build/static ./static

RUN npm install --production

EXPOSE 3000

CMD ["node", "--env-file=.env","backend/src/index.js"]