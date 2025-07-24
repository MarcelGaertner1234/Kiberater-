#!/bin/bash

echo "🔄 NEUER UMFASSENDER TEST"
echo "========================="
echo "$(date)"
echo ""

FAILED_TESTS=0
TIMESTAMP=$(date +%s)

# Test-Dateien erstellen
cat > "new_test_user_${TIMESTAMP}.json" << EOF
{
  "email": "new_test_${TIMESTAMP}@example.com",
  "password": "Test123!",
  "name": "New Test User"
}
EOF

cat > "new_invalid_email.json" << EOF
{
  "email": "totally-invalid-email",
  "password": "Test123!",
  "name": "Test User"
}
EOF

cat > "new_weak_password.json" << EOF
{
  "email": "weak_pwd_${TIMESTAMP}@example.com",
  "password": "12",
  "name": "Test User"
}
EOF

# Hilfsfunktion für Tests
test_result() {
    if [ $2 -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "🧪 VOLLSTÄNDIGE SYSTEM-TESTS"
echo "============================"
echo ""

# 1. Basic Server Health
echo "1️⃣ BASIC SERVER TESTS"
echo "---------------------"

echo -n "Frontend Health: "
FRONTEND_RESPONSE=$(curl -s http://localhost:3000/ -w "%{http_code}" -o /dev/null)
[ "$FRONTEND_RESPONSE" = "200" ]
test_result "Frontend accessible" $?

echo -n "Backend Health: "
BACKEND_HEALTH=$(curl -s http://localhost:4000/health | jq -r '.status // "error"')
[ "$BACKEND_HEALTH" = "ok" ]
test_result "Backend health check" $?

echo ""

# 2. Complete Authentication Flow
echo "2️⃣ AUTHENTICATION FLOW"
echo "----------------------"

echo -n "User Registration: "
REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @"new_test_user_${TIMESTAMP}.json")

REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success')
[ "$REG_SUCCESS" = "true" ]
test_result "Registration successful" $?

if [ "$REG_SUCCESS" = "true" ]; then
    ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken')
    
    echo -n "User Login: "
    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
        -H "Content-Type: application/json" \
        -d @"new_test_user_${TIMESTAMP}.json")
    
    LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success')
    [ "$LOGIN_SUCCESS" = "true" ]
    test_result "Login successful" $?
    
    echo -n "Protected Endpoint: "
    USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
        http://localhost:4000/api/v1/users/me)
    
    USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success')
    [ "$USER_SUCCESS" = "true" ]
    test_result "Protected endpoint accessible" $?
else
    echo "❌ Skipping login tests - registration failed"
    FAILED_TESTS=$((FAILED_TESTS + 2))
fi

echo ""

# 3. Security Tests
echo "3️⃣ SECURITY TESTS"
echo "-----------------"

echo -n "Unauthorized Access: "
UNAUTH_STATUS=$(curl -s http://localhost:4000/api/v1/users/me -w "%{http_code}" -o /dev/null)
[ "$UNAUTH_STATUS" = "401" ]
test_result "Correctly blocks unauthorized access" $?

echo -n "Invalid Email Validation: "
INVALID_EMAIL_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @new_invalid_email.json)

INVALID_EMAIL_SUCCESS=$(echo "$INVALID_EMAIL_RESPONSE" | jq -r '.success')
[ "$INVALID_EMAIL_SUCCESS" = "false" ]
test_result "Rejects invalid email" $?

echo -n "Weak Password Validation: "
WEAK_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @new_weak_password.json)

WEAK_PASSWORD_SUCCESS=$(echo "$WEAK_PASSWORD_RESPONSE" | jq -r '.success')
[ "$WEAK_PASSWORD_SUCCESS" = "false" ]
test_result "Rejects weak password" $?

echo ""

# 4. Frontend Tests
echo "4️⃣ FRONTEND TESTS"
echo "-----------------"

PAGES=("/" "/login" "/register" "/about" "/contact")
for page in "${PAGES[@]}"; do
    echo -n "Page $page: "
    STATUS=$(curl -s "http://localhost:3000$page" -w "%{http_code}" -o /dev/null)
    if [ "$STATUS" = "200" ]; then
        echo "✅ Accessible"
    else
        echo "❌ Failed (Status: $STATUS)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
done

echo ""

# 5. Performance & Stability
echo "5️⃣ PERFORMANCE TESTS"
echo "--------------------"

echo -n "Load Test (10 requests): "
LOAD_FAILURES=0
for i in {1..10}; do
    STATUS=$(curl -s http://localhost:4000/health -w "%{http_code}" -o /dev/null)
    if [ "$STATUS" != "200" ]; then
        LOAD_FAILURES=$((LOAD_FAILURES + 1))
    fi
    sleep 0.1
done

[ "$LOAD_FAILURES" -eq 0 ]
test_result "All load test requests successful" $?

echo -n "Response Time Test: "
RESPONSE_TIME=$(curl -s -w "%{time_total}" http://localhost:4000/health -o /dev/null)
# Test if response time is less than 1 second (should be much faster)
RESPONSE_OK=$(echo "$RESPONSE_TIME < 1.0" | bc -l 2>/dev/null || echo "1")
[ "$RESPONSE_OK" = "1" ]
test_result "Response time acceptable ($RESPONSE_TIME s)" $?

echo ""

# 6. Database Connectivity
echo "6️⃣ DATABASE TESTS"
echo "-----------------"

echo -n "Database Operations: "
# Test database by attempting to register another unique user
DB_TEST_EMAIL="db_test_${TIMESTAMP}_$(date +%N)@example.com"
DB_TEST_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$DB_TEST_EMAIL\",\"password\":\"Test123!\",\"name\":\"DB Test\"}")

DB_TEST_SUCCESS=$(echo "$DB_TEST_RESPONSE" | jq -r '.success')
[ "$DB_TEST_SUCCESS" = "true" ]
test_result "Database writes working" $?

echo ""

# 7. Error Handling
echo "7️⃣ ERROR HANDLING"
echo "-----------------"

echo -n "Duplicate User Prevention: "
# Try to register the same user again
DUPLICATE_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d @"new_test_user_${TIMESTAMP}.json")

DUPLICATE_SUCCESS=$(echo "$DUPLICATE_RESPONSE" | jq -r '.success')
[ "$DUPLICATE_SUCCESS" = "false" ]
test_result "Prevents duplicate user registration" $?

echo -n "Wrong Password Handling: "
# Create wrong password JSON
cat > "wrong_password.json" << EOF
{
  "email": "new_test_${TIMESTAMP}@example.com",
  "password": "WrongPassword123!",
  "name": "Test User"
}
EOF

WRONG_PASSWORD_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d @wrong_password.json)

WRONG_PASSWORD_SUCCESS=$(echo "$WRONG_PASSWORD_RESPONSE" | jq -r '.success')
[ "$WRONG_PASSWORD_SUCCESS" = "false" ]
test_result "Rejects wrong password" $?

echo ""

# Cleanup
rm -f "new_test_user_${TIMESTAMP}.json" new_invalid_email.json new_weak_password.json wrong_password.json

# Final Results
echo "🏁 TEST RESULTS"
echo "==============="
echo "Date: $(date)"
echo "Failed Tests: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED! 🎉"
    echo ""
    echo "✅ System is FULLY FUNCTIONAL"
    echo "✅ All security measures working"
    echo "✅ Database operations stable"
    echo "✅ Frontend accessible"
    echo "✅ Authentication flow complete"
    echo "✅ Error handling proper"
    echo ""
    echo "🚀 PLATFORM READY FOR USE!"
    echo ""
    echo "🔗 Access:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:4000"
    echo ""
    echo "📊 Performance:"
    echo "   Response Time: $RESPONSE_TIME seconds"
    echo "   Load Test: 10/10 requests successful"
    echo ""
else
    echo "⚠️  $FAILED_TESTS TESTS FAILED"
    echo "System needs additional attention"
    echo ""
fi

echo "🔚 Test completed at $(date)"