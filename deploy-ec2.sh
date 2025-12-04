#!/bin/bash

# EC2 Deployment Script for CoFounder Circle
# This script helps deploy the application to EC2 with proper asset handling

set -e

echo "🚀 Starting EC2 deployment..."

# Check if required environment variables are set
if [ -z "$VITE_API_BASE_URL" ]; then
    echo "❌ Error: VITE_API_BASE_URL environment variable is required"
    exit 1
fi

if [ -z "$VITE_AGENT_URL" ]; then
    echo "❌ Error: VITE_AGENT_URL environment variable is required"
    exit 1
fi

if [ -z "$VITE_SAAS_APP_URL" ]; then
    echo "❌ Error: VITE_SAAS_APP_URL environment variable is required"
    exit 1
fi

echo "✅ Environment variables validated"

# Build the application for production
echo "📦 Building application for production..."
NODE_ENV=production npm run build:production

# Verify that assets were built correctly
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: dist/index.html not found after build"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH"
    exit 1
fi

# Build Docker image
echo "🐳 Building Docker image..."
docker build \
    --build-arg VITE_API_BASE_URL="$VITE_API_BASE_URL" \
    --build-arg VITE_AGENT_URL="$VITE_AGENT_URL" \
    --build-arg VITE_SAAS_APP_URL="$VITE_SAAS_APP_URL" \
    -t vikaskamwal/cofounder-nectar:test .

echo "✅ Docker image built successfully"

# Stop and remove existing container if it exists
echo "🔄 Stopping existing container..."
docker stop cofounder-circle-app 2>/dev/null || true
docker rm cofounder-circle-app 2>/dev/null || true

# Push image to Docker Hub
echo "📤 Pushing image to Docker Hub..."
docker push vikaskamwal/cofounder-nectar:test

echo "✅ Image pushed successfully"

# Run the new container
echo "🚀 Starting new container..."
docker run -d \
    --name cofounder-circle-app \
    -p 3000:3000 \
    --restart unless-stopped \
    vikaskamwal/cofounder-nectar:test

echo "✅ Container started successfully"

# Wait a moment for the container to start
sleep 5

# Check if the container is running
if docker ps | grep -q cofounder-circle-app; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Application is available at: http://$(curl -s ifconfig.me)"
    echo "📊 Container status:"
    docker ps | grep cofounder-circle-app
else
    echo "❌ Error: Container failed to start"
    echo "📋 Container logs:"
    docker logs cofounder-circle-app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
