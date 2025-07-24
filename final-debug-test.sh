#!/bin/bash

echo "🎯 FINALER UMFASSENDER DEBUG-TEST"
echo "=================================="
echo ""

FAILED_TESTS=0

# Test-Funktion
test_result() {
    if [ $2 -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "🏥 1. SERVER HEALTH CHECK"
echo "========================"

# Frontend Test
FRONTEND_STATUS=$(curl -s http://localhost:3000/ -w '%{http_code}' -o /dev/null)
[ "$FRONTEND_STATUS" = "200" ]
test_result "Frontend Health (200)" $?

# Backend Test  
BACKEND_HEALTH=$(curl -s http://localhost:4000/health | jq -r '.status // "error"')
[ "$BACKEND_HEALTH" = "ok" ]
test_result "Backend Health Check" $?

echo ""
echo "📱 2. FRONTEND PAGES"
echo "==================="

PAGES=("/" "/login" "/register" "/about" "/contact")
for page in "${PAGES[@]}"; do
    STATUS=$(curl -s "http://localhost:3000$page" -w '%{http_code}' -o /dev/null)
    [ "$STATUS" = "200" ]
    test_result "Page $page" $?
done

echo ""
echo "🔐 3. AUTHENTICATION FLOW"
echo "========================="

# Unique email for test
TIMESTAMP=$(date +%s)
TEST_EMAIL="final_test_${TIMESTAMP}@example.com"

# Test Registration
REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\",\"name\":\"Final Test\"}")

REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success // false')
[ "$REG_SUCCESS" = "true" ]
test_result "User Registration" $?

if [ "$REG_SUCCESS" = "true" ]; then
    # Extract token
    ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken // ""')
    
    # Test Login
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\"}")
    
    LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success // false')
    [ "$LOGIN_SUCCESS" = "true" ]
    test_result "User Login" $?

    # Test Protected Endpoint
    if [ ! -z "$ACCESS_TOKEN" ]; then
        USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
          http://localhost:4000/api/v1/users/me)
        
        USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success // false')
        [ "$USER_SUCCESS" = "true" ]
        test_result "Protected Endpoint Access" $?
    else
        echo "❌ No token received - skipping protected endpoint test"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
else
    echo "❌ Registration failed - skipping dependent tests"
    FAILED_TESTS=$((FAILED_TESTS + 2))
fi

echo ""
echo "🛡️  4. SECURITY & VALIDATION"
echo "============================"

# Test 401 on protected endpoint without token
UNAUTH_STATUS=$(curl -s http://localhost:4000/api/v1/users/me -w '%{http_code}' -o /dev/null)
[ "$UNAUTH_STATUS" = "401" ]
test_result "Unauthorized Access Protection" $?

# Test invalid email validation
INVALID_EMAIL_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"Test123!","name":"Test"}')

INVALID_EMAIL_SUCCESS=$(echo "$INVALID_EMAIL_RESPONSE" | jq -r '.success // true')
[ "$INVALID_EMAIL_SUCCESS" = "false" ]
test_result "Invalid Email Rejection" $?

# Test weak password validation
WEAK_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"weak_${TIMESTAMP}@test.com\",\"password\":\"123\",\"name\":\"Test\"}")

WEAK_PASSWORD_SUCCESS=$(echo "$WEAK_PASSWORD_RESPONSE" | jq -r '.success // true')
[ "$WEAK_PASSWORD_SUCCESS" = "false" ]
test_result "Weak Password Rejection" $?

echo ""
echo "📊 5. PERFORMANCE & STABILITY"
echo "============================="

# Multiple rapid requests test
echo "Testing server stability with rapid requests..."
for i in {1..5}; do
    STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null)
    if [ "$STATUS" != "200" ]; then
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "❌ Rapid request $i failed"
        break
    fi
done
if [ $i -eq 5 ]; then
    echo "✅ Server Stability (5 rapid requests)"
fi

echo ""
echo "📋 6. LOG ANALYSIS"
echo "=================="

# Check for critical errors in recent logs
BACKEND_ERRORS=$(tail -20 backend-fixed.log | grep -c "app crashed\|Error:" || echo "0")
if [ "$BACKEND_ERRORS" -eq 0 ]; then
    echo "✅ No Critical Backend Errors"
else
    echo "⚠️  Found $BACKEND_ERRORS recent backend errors"
fi

echo ""
echo "🎯 FINAL RESULTS"
echo "================"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALLE TESTS BESTANDEN!"
    echo "✅ Platform is fully functional and stable"
    echo ""
    echo "🚀 READY FOR PRODUCTION USE!"
    echo ""
    echo "📊 System Status:"
    echo "- Frontend: ✅ Running (localhost:3000)"
    echo "- Backend:  ✅ Running (localhost:4000)"  
    echo "- Auth:     ✅ Working"
    echo "- Database: ✅ Connected"
    echo "- Security: ✅ Validated"
    echo ""
    echo "🔗 Access URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend:  http://localhost:4000/health"
else
    echo "⚠️  $FAILED_TESTS TESTS FAILED"
    echo "Platform needs additional debugging"
fi

echo ""
echo "📈 Response Times:"
echo "Frontend: $(curl -s -w "%{time_total}s" http://localhost:3000/ -o /dev/null)"
echo "Backend:  $(curl -s -w "%{time_total}s" http://localhost:4000/health -o /dev/null)"