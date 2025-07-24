#!/bin/bash

echo "🧪 Testing Prisma with pgbouncer fix..."
echo "======================================="
echo ""

# Kill existing backend processes
echo "🔧 Cleaning up old processes..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 2

# Start backend
echo "🚀 Starting backend with new Prisma config..."
cd /Users/marcelgaertner/ki-beratung-platform
npm run dev:backend > prisma-test.log 2>&1 &
BACKEND_PID=$!

echo "⏳ Waiting for backend to start..."
sleep 8

# Test multiple queries to check for prepared statement errors
echo ""
echo "📝 Running Prisma queries test..."
echo ""

for i in {1..5}; do
    echo "Test $i: Register attempt"
    RESULT=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test$i@example.com\",\"password\":\"Test123!\",\"name\":\"Test User $i\"}" \
        -w "\nStatus: %{http_code}" | tail -1)
    echo "$RESULT"
    
    # Check if we got the prepared statement error
    if curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"test$i@example.com\",\"password\":\"Test123!\",\"name\":\"Test User $i\"}" 2>&1 | grep -q "prepared statement"; then
        echo "❌ PREPARED STATEMENT ERROR STILL PRESENT!"
        break
    fi
    
    sleep 1
done

echo ""
echo "📊 Test Results:"
echo "----------------"

# Check logs for prepared statement errors
if grep -q "prepared statement" prisma-test.log; then
    echo "❌ Prisma prepared statement error detected in logs"
    echo ""
    echo "Error details:"
    grep -A2 -B2 "prepared statement" prisma-test.log | head -20
else
    echo "✅ No prepared statement errors detected!"
fi

echo ""
echo "🛑 Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true

echo ""
echo "📝 Full log available in: prisma-test.log"