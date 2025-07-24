#!/bin/bash

echo "🚀 Starte KI-Beratungsplattform Server"
echo "======================================="
echo ""

# Alte Prozesse beenden
echo "🔧 Beende alte Prozesse..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "next" 2>/dev/null || true
sleep 2

# Backend starten
echo "🔧 Starte Backend (Port 4000)..."
npm run dev:backend > backend.log 2>&1 &
BACKEND_PID=$!

# Frontend starten
echo "🌐 Starte Frontend (Port 3000)..."
npm run dev:frontend > frontend.log 2>&1 &
FRONTEND_PID=$!

# Warten bis Server bereit sind
echo "⏳ Warte auf Server..."
sleep 8

# Testen
echo ""
echo "🧪 Teste Server:"
echo "----------------"

BACKEND_STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null)
FRONTEND_STATUS=$(curl -s http://localhost:3000/ -w '%{http_code}' -o /dev/null)

if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend: Läuft (Port 4000)"
else
    echo "❌ Backend: Fehler (Status: $BACKEND_STATUS)"
    echo "   Log: tail backend.log"
fi

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend: Läuft (Port 3000)"
else
    echo "❌ Frontend: Fehler (Status: $FRONTEND_STATUS)"
    echo "   Log: tail frontend.log"
fi

echo ""
echo "🔗 URLs:"
echo "--------"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:4000/health"

echo ""
echo "📋 Befehle:"
echo "----------"
echo "Server stoppen: ./stop-servers.sh"
echo "Logs anzeigen:  tail -f backend.log frontend.log"
echo "Status prüfen:  ./check-servers.sh"

echo ""
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo "🎉 Beide Server laufen erfolgreich!"
else
    echo "⚠️  Ein oder beide Server haben Probleme. Prüfe die Logs."
fi