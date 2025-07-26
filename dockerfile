# Use Node.js 22 Alpine as base image (smaller size)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install system dependencies including FFmpeg
RUN apk add --no-cache \
    ffmpeg \
    wget \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Install Node.js dependencies and build
RUN npm ci --only=production && \
    npm run build && \
    npm cache clean --force

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "backend/index.js"]