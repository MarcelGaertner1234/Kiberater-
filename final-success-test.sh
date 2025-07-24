#!/bin/bash

echo "🎯 FINALER ERFOLGS-VERIFIKATIONSTEST"
echo "===================================="
echo ""

# Test-Dateien erstellen
TIMESTAMP=$(date +%s)

cat > "success_test_user.json" << EOF
{
  "email": "success_test_${TIMESTAMP}@example.com",
  "password": "Test123!",
  "name": "Success Test User"
}
EOF

cat > "success_invalid_email.json" << EOF
{
  "email": "invalid-email",
  "password": "Test123!",
  "name": "Test User"
}
EOF

cat > "success_weak_password.json" << EOF
{
  "email": "weak_${TIMESTAMP}@example.com",
  "password": "123",
  "name": "Test User"
}
EOF

echo "🧪 UMFASSENDE FUNKTIONALITÄTSTESTS"
echo "=================================="
echo ""

ALL_TESTS_PASSED=true

# Test 1: Server Health
echo -n "🏥 Server Health Check... "
FRONTEND_STATUS=$(curl -s http://localhost:3000/ -w '%{http_code}' -o /dev/null 2>/dev/null)
BACKEND_STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null 2>/dev/null)

if [ "$FRONTEND_STATUS" = "200" ] && [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED (F:$FRONTEND_STATUS B:$BACKEND_STATUS)"
    ALL_TESTS_PASSED=false
fi

# Test 2: User Registration
echo -n "🔐 User Registration... "
REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @success_test_user.json 2>/dev/null)

REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success // false' 2>/dev/null)

if [ "$REG_SUCCESS" = "true" ]; then
    echo "✅ PASSED"
    ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken // ""' 2>/dev/null)
else
    echo "❌ FAILED"
    ALL_TESTS_PASSED=false
    ACCESS_TOKEN=""
fi

# Test 3: User Login
echo -n "🔓 User Login... "
if [ ! -z "$ACCESS_TOKEN" ]; then
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d @success_test_user.json 2>/dev/null)
    
    LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success // false' 2>/dev/null)
    
    if [ "$LOGIN_SUCCESS" = "true" ]; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
        ALL_TESTS_PASSED=false
    fi
else
    echo "⏭️  SKIPPED (no registration)"
    ALL_TESTS_PASSED=false
fi

# Test 4: Protected Endpoint
echo -n "🛡️  Protected Endpoint Access... "
if [ ! -z "$ACCESS_TOKEN" ]; then
    USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
        http://localhost:4000/api/v1/users/me 2>/dev/null)
    
    USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success // false' 2>/dev/null)
    
    if [ "$USER_SUCCESS" = "true" ]; then
        echo "✅ PASSED"
    else
        echo "❌ FAILED"
        ALL_TESTS_PASSED=false
    fi
else
    echo "⏭️  SKIPPED (no token)"
    ALL_TESTS_PASSED=false
fi

# Test 5: Unauthorized Access Protection
echo -n "🚫 Unauthorized Access Protection... "
UNAUTH_STATUS=$(curl -s http://localhost:4000/api/v1/users/me -w '%{http_code}' -o /dev/null 2>/dev/null)

if [ "$UNAUTH_STATUS" = "401" ]; then
    echo "✅ PASSED"
else
    echo "❌ FAILED (Got $UNAUTH_STATUS, expected 401)"
    ALL_TESTS_PASSED=false
fi

# Test 6: Email Validation (CORRECTED LOGIC)
echo -n "📧 Email Validation... "
INVALID_EMAIL_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @success_invalid_email.json 2>/dev/null)

INVALID_EMAIL_SUCCESS=$(echo "$INVALID_EMAIL_RESPONSE" | jq -r '.success // null' 2>/dev/null)

# KORREKTE LOGIK: success sollte false sein bei invalid email
if [ "$INVALID_EMAIL_SUCCESS" = "false" ]; then
    echo "✅ PASSED (correctly rejected invalid email)"
else
    echo "❌ FAILED (invalid email was accepted: success=$INVALID_EMAIL_SUCCESS)"
    ALL_TESTS_PASSED=false
fi

# Test 7: Password Validation (CORRECTED LOGIC)
echo -n "🔒 Password Validation... "
WEAK_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @success_weak_password.json 2>/dev/null)

WEAK_PASSWORD_SUCCESS=$(echo "$WEAK_PASSWORD_RESPONSE" | jq -r '.success // null' 2>/dev/null)

# KORREKTE LOGIK: success sollte false sein bei weak password
if [ "$WEAK_PASSWORD_SUCCESS" = "false" ]; then
    echo "✅ PASSED (correctly rejected weak password)"
else
    echo "❌ FAILED (weak password was accepted: success=$WEAK_PASSWORD_SUCCESS)"
    ALL_TESTS_PASSED=false
fi

# Test 8: Frontend Pages
echo -n "📱 Frontend Pages... "
FRONTEND_PAGES_OK=true

for page in "/" "/login" "/register" "/about" "/contact"; do
    STATUS=$(curl -s "http://localhost:3000$page" -w '%{http_code}' -o /dev/null 2>/dev/null)
    if [ "$STATUS" != "200" ]; then
        FRONTEND_PAGES_OK=false
        break
    fi
done

if [ "$FRONTEND_PAGES_OK" = "true" ]; then
    echo "✅ PASSED (all pages accessible)"
else
    echo "❌ FAILED (some pages not accessible)"
    ALL_TESTS_PASSED=false
fi

# Test 9: Server Stability (Rapid Requests)
echo -n "⚡ Server Stability... "
STABILITY_OK=true

for i in {1..5}; do
    STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null 2>/dev/null)
    if [ "$STATUS" != "200" ]; then
        STABILITY_OK=false
        break
    fi
    sleep 0.1
done

if [ "$STABILITY_OK" = "true" ]; then
    echo "✅ PASSED (5 rapid requests successful)"
else
    echo "❌ FAILED (server stability issues)"
    ALL_TESTS_PASSED=false
fi

# Cleanup
rm -f success_test_user.json success_invalid_email.json success_weak_password.json

echo ""
echo "🏁 FINAL RESULTS"
echo "==============="

if [ "$ALL_TESTS_PASSED" = "true" ]; then
    echo ""
    echo "🎉🎉🎉 ALL TESTS PASSED! 🎉🎉🎉"
    echo ""
    echo "✅ PLATTFORM IST VOLLSTÄNDIG FUNKTIONAL!"
    echo "✅ ALLE DEBUGGING-AUFGABEN ERFOLGREICH ABGESCHLOSSEN!"
    echo ""
    echo "📊 System Status:"
    echo "- 🌐 Frontend: ONLINE (localhost:3000)"
    echo "- 🔧 Backend:  ONLINE (localhost:4000)"
    echo "- 🔐 Auth:     WORKING"
    echo "- 🛡️  Security: ENABLED"
    echo "- 📧 Validation: ACTIVE"
    echo "- ⚡ Performance: STABLE"
    echo ""
    echo "🎯 DIE KONTINUIERLICHEN TESTS WAREN ERFOLGREICH!"
    echo "🚀 PLATFORM READY FOR PRODUCTION USE!"
    echo ""
    echo "🔗 Zugriff:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:4000/health"
    echo ""
else
    echo ""
    echo "⚠️  SOME TESTS FAILED"
    echo "Additional debugging may be required"
    echo ""
fi

echo "🏆 DEBUGGING SESSION COMPLETED!"
echo "================================"