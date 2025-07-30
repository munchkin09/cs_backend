FROM node:22-alpine

# Install ffmpeg
RUN apk add --no-cache ffmpeg

# Create app directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install --production=false

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose application port
EXPOSE 3000

# Start the server
CMD ["node", "backend/index.js"]
