#!/bin/bash

echo "🛑 Stoppe KI-Beratungsplattform Server"
echo "======================================="
echo ""

echo "🔧 Beende Frontend (Port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "🔧 Beende Backend (Port 4000)..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || true

echo "🔧 Beende alle Node-Prozesse..."
pkill -f "nodemon" 2>/dev/null || true
pkill -f "next" 2>/dev/null || true

sleep 2

echo ""
echo "🧪 Überprüfe Ports:"
echo "------------------"
FRONTEND_CHECK=$(lsof -ti:3000 | wc -l)
BACKEND_CHECK=$(lsof -ti:4000 | wc -l)

if [ "$FRONTEND_CHECK" -eq 0 ]; then
    echo "✅ Port 3000: Frei"
else
    echo "⚠️  Port 3000: Noch belegt"
fi

if [ "$BACKEND_CHECK" -eq 0 ]; then
    echo "✅ Port 4000: Frei"
else
    echo "⚠️  Port 4000: Noch belegt"
fi

echo ""
echo "🎯 Server gestoppt!"
echo "Zum Neustarten: ./start-servers.sh"