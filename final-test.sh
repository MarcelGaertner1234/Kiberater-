#!/bin/bash

echo "🚀 Final Test der KI-Beratungsplattform"
echo "========================================"
echo ""

# Kill existing processes
echo "🔧 Stopping existing processes..."
lsof -ti:3000,3001,3002,4000 | xargs kill -9 2>/dev/null || true
sleep 2

# Start servers
echo "🎯 Starting servers..."
cd /Users/marcelgaertner/ki-beratung-platform

# Start backend
echo "📦 Starting Backend on port 4000..."
npm run dev:backend > backend.log 2>&1 &
BACKEND_PID=$!
sleep 5

# Start frontend  
echo "🌐 Starting Frontend on port 3000..."
npm run dev:frontend > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 10

# Test servers
echo ""
echo "🧪 Testing servers..."
echo ""

# Backend test
echo "Backend Health Check:"
curl -s http://localhost:4000/health | jq '.' || echo "❌ Backend not responding"

echo ""
echo "Frontend Check:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:3000 || echo "❌ Frontend not responding"

echo ""
echo "✅ Test complete!"
echo ""
echo "📝 Logs:"
echo "- Backend: backend.log"
echo "- Frontend: frontend.log"
echo ""
echo "🛑 To stop servers: kill $BACKEND_PID $FRONTEND_PID"