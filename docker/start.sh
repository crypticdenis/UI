#!/bin/bash

# Quick start script for Docker deployment

echo "🚀 Starting Butler Evaluation Dashboard with Docker..."
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials!"
    echo ""
    read -p "Press Enter to continue after editing .env, or Ctrl+C to exit..."
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 5

# Check status
echo ""
echo "✅ Services started!"
echo ""
echo "📊 Frontend: http://localhost:5174"
echo "🔧 Backend API: http://localhost:3001/api"
echo "💚 Health Check: http://localhost:3001/api/health"
echo ""
echo "View logs with: docker-compose logs -f"
echo "Stop services with: docker-compose down"
