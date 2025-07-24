#!/bin/bash

echo "🧪 Testing KI-Beratungsplattform Servers..."
echo ""

# Test Frontend
echo "📱 Testing Frontend (http://localhost:3000)..."
curl -s -o /dev/null -w "Frontend Status: %{http_code}\n" http://localhost:3000 || echo "Frontend: NOT RUNNING ❌"

# Test Backend Health
echo ""
echo "🔧 Testing Backend Health (http://localhost:4000/health)..."
curl -s http://localhost:4000/health | jq '.' 2>/dev/null || echo "Backend: NOT RUNNING ❌"

# Test Backend API
echo ""
echo "🌐 Testing Backend API..."
curl -s -o /dev/null -w "API Status: %{http_code}\n" http://localhost:4000/api/v1/auth/status || echo "API: NOT ACCESSIBLE ❌"

echo ""
echo "✅ Server Test Complete!"