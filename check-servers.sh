#!/bin/bash

echo "🔍 Server Status Check"
echo "====================="
echo ""

echo "📡 Port Status:"
echo "--------------"
FRONTEND_PROCESS=$(lsof -ti:3000 2>/dev/null | wc -l)
BACKEND_PROCESS=$(lsof -ti:4000 2>/dev/null | wc -l)

if [ "$FRONTEND_PROCESS" -gt 0 ]; then
    echo "✅ Frontend (Port 3000): Läuft"
else
    echo "❌ Frontend (Port 3000): Gestoppt"
fi

if [ "$BACKEND_PROCESS" -gt 0 ]; then
    echo "✅ Backend (Port 4000): Läuft"
else
    echo "❌ Backend (Port 4000): Gestoppt"
fi

echo ""
echo "🌐 HTTP Status:"
echo "--------------"

if [ "$FRONTEND_PROCESS" -gt 0 ]; then
    FRONTEND_HTTP=$(curl -s http://localhost:3000/ -w '%{http_code}' -o /dev/null 2>/dev/null)
    if [ "$FRONTEND_HTTP" = "200" ]; then
        echo "✅ Frontend HTTP: OK ($FRONTEND_HTTP)"
    else
        echo "❌ Frontend HTTP: Fehler ($FRONTEND_HTTP)"
    fi
else
    echo "⚠️  Frontend HTTP: Nicht getestet (Server läuft nicht)"
fi

if [ "$BACKEND_PROCESS" -gt 0 ]; then
    BACKEND_HTTP=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null 2>/dev/null)
    if [ "$BACKEND_HTTP" = "200" ]; then
        echo "✅ Backend HTTP: OK ($BACKEND_HTTP)"
    else
        echo "❌ Backend HTTP: Fehler ($BACKEND_HTTP)"
    fi
else
    echo "⚠️  Backend HTTP: Nicht getestet (Server läuft nicht)"
fi

echo ""
echo "📋 Befehle:"
echo "----------"
if [ "$FRONTEND_PROCESS" -eq 0 ] || [ "$BACKEND_PROCESS" -eq 0 ]; then
    echo "Server starten: ./start-servers.sh"
fi
echo "Server stoppen: ./stop-servers.sh"
echo "Logs anzeigen:  tail -f backend.log frontend.log"

echo ""
echo "🔗 URLs (wenn Server laufen):"
echo "-----------------------------"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:4000/health"