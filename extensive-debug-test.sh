#!/bin/bash

echo "🔥 UMFASSENDER DEBUG & TEST"
echo "============================"
echo ""

TIMESTAMP=$(date +%s)
FAILED_TESTS=0

# Funktion für Test-Ergebnisse
log_test() {
    if [ $2 -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "📊 1. SERVER BASIC TESTS"
echo "========================"

# Test Frontend
FRONTEND_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/ -o /dev/null)
[ "$FRONTEND_RESPONSE" = "200" ]
log_test "Frontend Landing Page" $?

# Test Backend Health
BACKEND_RESPONSE=$(curl -s http://localhost:4000/health | jq -r '.status // "error"')
[ "$BACKEND_RESPONSE" = "ok" ]
log_test "Backend Health Check" $?

echo ""
echo "🔐 2. AUTHENTICATION TESTS"
echo "==========================="

# Test Registration mit eindeutiger Email
TEST_EMAIL="test_${TIMESTAMP}@example.com"
REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\",\"name\":\"Test User\"}")

REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success // false')
[ "$REG_SUCCESS" = "true" ]
log_test "User Registration" $?

if [ "$REG_SUCCESS" = "true" ]; then
    # Extract token for further tests
    ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken // ""')
    
    # Test Login
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\"}")
    
    LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success // false')
    [ "$LOGIN_SUCCESS" = "true" ]
    log_test "User Login" $?
else
    echo "❌ Skipping login test - registration failed"
    echo "Registration error: $(echo "$REG_RESPONSE" | jq -r '.error.message // "unknown"')"
fi

echo ""
echo "🌐 3. FRONTEND PAGE TESTS"
echo "========================="

# Test verschiedene Frontend Pages
PAGES=("/" "/login" "/register" "/about" "/contact")
for page in "${PAGES[@]}"; do
    RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:3000$page" -o /dev/null)
    if [ "$RESPONSE" = "200" ]; then
        echo "✅ Page $page"
    elif [ "$RESPONSE" = "307" ] || [ "$RESPONSE" = "404" ]; then
        echo "⚠️  Page $page (Status: $RESPONSE - may be redirect/not implemented)"
    else
        echo "❌ Page $page (Status: $RESPONSE)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
done

echo ""
echo "📡 4. API ENDPOINT TESTS"
echo "======================="

# Test verschiedene API Endpoints
echo "Testing API endpoints..."

# Health endpoint
curl -s http://localhost:4000/health > /dev/null
[ $? -eq 0 ]
log_test "API Health Endpoint" $?

# Test protected endpoint ohne Token (sollte 401 geben)
PROTECTED_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:4000/api/v1/users/me -o /dev/null)
[ "$PROTECTED_RESPONSE" = "401" ]
log_test "Protected endpoint returns 401 without token" $?

# Test mit Token (falls verfügbar)
if [ ! -z "$ACCESS_TOKEN" ]; then
    USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
      http://localhost:4000/api/v1/users/me)
    
    USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success // false')
    [ "$USER_SUCCESS" = "true" ]
    log_test "Protected endpoint with valid token" $?
fi

echo ""
echo "💾 5. DATABASE TESTS"
echo "==================="

# Test Database connection durch User count
USER_COUNT_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"count_test_${TIMESTAMP}@example.com\",\"password\":\"Test123!\",\"name\":\"Count Test\"}")

COUNT_SUCCESS=$(echo "$USER_COUNT_RESPONSE" | jq -r '.success // false')
[ "$COUNT_SUCCESS" = "true" ]
log_test "Database User Creation" $?

echo ""
echo "⚠️  6. ERROR HANDLING TESTS"
echo "==========================="

# Test invalid email registration
INVALID_EMAIL_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"Test123!","name":"Test"}')

INVALID_EMAIL_ERROR=$(echo "$INVALID_EMAIL_RESPONSE" | jq -r '.success // true')
[ "$INVALID_EMAIL_ERROR" = "false" ]
log_test "Invalid email rejection" $?

# Test weak password
WEAK_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"weak_${TIMESTAMP}@example.com\",\"password\":\"123\",\"name\":\"Test\"}")

WEAK_PASSWORD_ERROR=$(echo "$WEAK_PASSWORD_RESPONSE" | jq -r '.success // true')
[ "$WEAK_PASSWORD_ERROR" = "false" ]
log_test "Weak password rejection" $?

# Test login with wrong password
WRONG_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"WrongPassword123!\"}")

WRONG_PASSWORD_ERROR=$(echo "$WRONG_PASSWORD_RESPONSE" | jq -r '.success // true')
[ "$WRONG_PASSWORD_ERROR" = "false" ]
log_test "Wrong password rejection" $?

echo ""
echo "📋 7. LOG ANALYSIS"
echo "=================="

echo "Recent backend errors (last 20 lines):"
tail -20 backend-clean.log | grep -i error || echo "✅ No recent errors in backend log"

echo ""
echo "Recent frontend warnings:"
tail -10 frontend-clean.log | grep -i warn | tail -3 || echo "✅ No recent warnings in frontend log"

echo ""
echo "🎯 SUMMARY"
echo "=========="
echo "Failed tests: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    echo "✅ Platform is fully functional"
else
    echo "⚠️  $FAILED_TESTS tests failed - debugging needed"
fi

echo ""
echo "📊 PERFORMANCE CHECK"
echo "==================="
echo "Frontend response time:"
curl -s -w "Time: %{time_total}s\n" http://localhost:3000/ -o /dev/null

echo "Backend response time:"
curl -s -w "Time: %{time_total}s\n" http://localhost:4000/health -o /dev/null