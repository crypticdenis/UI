#!/bin/bash

# Butler Evaluation - Start Script
# This script starts both the backend and frontend servers

echo "🚀 Starting Butler Evaluation System..."
echo ""

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 -q; then
    echo "❌ PostgreSQL is not running!"
    echo "   Start it with: brew services start postgresql@15"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Start backend server
echo "🔧 Starting backend server..."
cd server
if [ ! -d "node_modules" ]; then
    echo "   Installing dependencies..."
    npm install
fi

# Kill any existing process on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null

node server.js > server.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) on http://localhost:3001"
cd ..

# Wait for backend to be ready
echo "   Waiting for backend to be ready..."
for i in {1..10}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
done

echo ""

# Start frontend
echo "🎨 Starting frontend..."
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Butler Evaluation System is now running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Backend API:  http://localhost:3001"
echo "🌐 Frontend UI:  http://localhost:5173"
echo "💾 Database:     butler_eval @ localhost:5432"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    # Kill any remaining vite/node processes
    pkill -f "vite" 2>/dev/null
    pkill -f "node server.js" 2>/dev/null
    echo "👋 Goodbye!"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Wait forever
wait
