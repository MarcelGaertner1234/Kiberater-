#!/bin/bash

echo "🔄 VERBESSERTE KONTINUIERLICHE TESTS"
echo "====================================="
echo "Rate Limiting behoben - Drücke Ctrl+C zum Stoppen"
echo ""

# Test Konfiguration
MAX_ITERATIONS=10
ITERATION=1
TOTAL_FAILURES=0
CONSECUTIVE_SUCCESSES=0
REQUIRED_CONSECUTIVE_SUCCESSES=5

# Log-Datei
LOG_FILE="improved-test-$(date +%Y%m%d_%H%M%S).log"
echo "Test gestartet um $(date)" > "$LOG_FILE"

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test JSON-Files erstellen
create_test_files() {
    local timestamp=$1
    
    # Gültiger Test User
    cat > "test_user_${timestamp}.json" << EOF
{
  "email": "test_${timestamp}@example.com",
  "password": "Test123!",
  "name": "Test User ${timestamp}"
}
EOF

    # Invalid Email Test
    cat > "invalid_email_test.json" << EOF
{
  "email": "invalid-email",
  "password": "Test123!",
  "name": "Test User"
}
EOF

    # Weak Password Test
    cat > "weak_password_test.json" << EOF
{
  "email": "weak_${timestamp}@example.com",
  "password": "123",
  "name": "Test User"
}
EOF
}

# Umfassender Test
run_improved_test() {
    local iteration=$1
    local timestamp=$(date +%s)
    local test_failures=0
    
    echo -e "${BLUE}📊 Test Iteration $iteration - $(date)${NC}"
    echo "Test Iteration $iteration - $(date)" >> "$LOG_FILE"
    
    # Test-Dateien erstellen
    create_test_files $timestamp
    
    # 1. Server Health
    echo -n "🏥 Server Health... "
    FRONTEND_STATUS=$(curl -s http://localhost:3000/ -w '%{http_code}' -o /dev/null 2>/dev/null)
    BACKEND_STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null 2>/dev/null)
    
    if [ "$FRONTEND_STATUS" != "200" ] || [ "$BACKEND_STATUS" != "200" ]; then
        echo -e "${RED}FAILED${NC} (F:$FRONTEND_STATUS B:$BACKEND_STATUS)"
        echo "Server health failed: Frontend:$FRONTEND_STATUS Backend:$BACKEND_STATUS" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # 2. Registration Test (mit File)
    echo -n "🔐 Registration... "
    REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d @"test_user_${timestamp}.json" 2>/dev/null)
    
    REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success // false' 2>/dev/null)
    
    if [ "$REG_SUCCESS" != "true" ]; then
        echo -e "${RED}FAILED${NC}"
        echo "Registration failed: $(echo "$REG_RESPONSE" | jq -r '.error.message // "unknown error"')" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
        ACCESS_TOKEN=""
    else
        echo -e "${GREEN}OK${NC}"
        ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken // ""' 2>/dev/null)
    fi
    
    # 3. Login Test
    echo -n "🔓 Login... "
    if [ ! -z "$ACCESS_TOKEN" ]; then
        LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
            -H "Content-Type: application/json" \
            -d @"test_user_${timestamp}.json" 2>/dev/null)
        
        LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success // false' 2>/dev/null)
        
        if [ "$LOGIN_SUCCESS" != "true" ]; then
            echo -e "${RED}FAILED${NC}"
            echo "Login failed" >> "$LOG_FILE"
            test_failures=$((test_failures + 1))
        else
            echo -e "${GREEN}OK${NC}"
        fi
    else
        echo -e "${YELLOW}SKIPPED${NC} (no registration)"
    fi
    
    # 4. Protected Endpoint Test
    echo -n "🛡️  Protected Endpoint... "
    if [ ! -z "$ACCESS_TOKEN" ]; then
        USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
            http://localhost:4000/api/v1/users/me 2>/dev/null)
        
        USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success // false' 2>/dev/null)
        
        if [ "$USER_SUCCESS" != "true" ]; then
            echo -e "${RED}FAILED${NC}"
            echo "Protected endpoint failed" >> "$LOG_FILE"
            test_failures=$((test_failures + 1))
        else
            echo -e "${GREEN}OK${NC}"
        fi
    else
        echo -e "${YELLOW}SKIPPED${NC} (no token)"
    fi
    
    # 5. Validation Tests
    echo -n "📧 Email Validation... "
    INVALID_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d @invalid_email_test.json 2>/dev/null)
    
    INVALID_SUCCESS=$(echo "$INVALID_RESPONSE" | jq -r '.success // true' 2>/dev/null)
    
    if [ "$INVALID_SUCCESS" != "false" ]; then
        echo -e "${RED}FAILED${NC}"
        echo "Email validation failed" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    echo -n "🔒 Password Validation... "
    WEAK_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d @weak_password_test.json 2>/dev/null)
    
    WEAK_SUCCESS=$(echo "$WEAK_RESPONSE" | jq -r '.success // true' 2>/dev/null)
    
    if [ "$WEAK_SUCCESS" != "false" ]; then
        echo -e "${RED}FAILED${NC}"
        echo "Password validation failed" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # 6. Frontend Pages
    echo -n "📱 Frontend Pages... "
    page_failures=0
    
    for page in "/" "/login" "/register" "/about" "/contact"; do
        STATUS=$(curl -s "http://localhost:3000$page" -w '%{http_code}' -o /dev/null 2>/dev/null)
        if [ "$STATUS" != "200" ]; then
            page_failures=$((page_failures + 1))
        fi
    done
    
    if [ $page_failures -gt 0 ]; then
        echo -e "${RED}FAILED${NC} ($page_failures pages)"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # 7. Unauthorized Access Test
    echo -n "🚫 Unauthorized Access... "
    UNAUTH_STATUS=$(curl -s http://localhost:4000/api/v1/users/me -w '%{http_code}' -o /dev/null 2>/dev/null)
    
    if [ "$UNAUTH_STATUS" != "401" ]; then
        echo -e "${RED}FAILED${NC} (Got $UNAUTH_STATUS, expected 401)"
        echo "Unauthorized access test failed: got $UNAUTH_STATUS" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # Cleanup
    rm -f "test_user_${timestamp}.json"
    
    # Ergebnis
    if [ $test_failures -eq 0 ]; then
        echo -e "${GREEN}✅ Iteration $iteration: ALL TESTS PASSED${NC}"
        CONSECUTIVE_SUCCESSES=$((CONSECUTIVE_SUCCESSES + 1))
    else
        echo -e "${RED}❌ Iteration $iteration: $test_failures FAILURES${NC}"
        echo "Iteration $iteration failures: $test_failures" >> "$LOG_FILE"
        TOTAL_FAILURES=$((TOTAL_FAILURES + test_failures))
        CONSECUTIVE_SUCCESSES=0
    fi
    
    echo "---" >> "$LOG_FILE"
    return $test_failures
}

# Cleanup alte Testdateien
rm -f test_user_*.json invalid_email_test.json weak_password_test.json

echo "Starting improved continuous testing..."
echo ""

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    run_improved_test $ITERATION
    
    # Prüfe Erfolg
    if [ $CONSECUTIVE_SUCCESSES -ge $REQUIRED_CONSECUTIVE_SUCCESSES ]; then
        echo ""
        echo -e "${GREEN}🎉 SUCCESS: $REQUIRED_CONSECUTIVE_SUCCESSES consecutive successful test runs!${NC}"
        echo -e "${GREEN}✅ Platform is STABLE and FULLY FUNCTIONAL${NC}"
        echo ""
        echo "📊 Final Stats:"
        echo "- Total iterations: $ITERATION"
        echo "- Total failures: $TOTAL_FAILURES"
        echo "- Success rate: $(( (ITERATION - TOTAL_FAILURES) * 100 / ITERATION ))%"
        echo ""
        echo "🎯 ALL DEBUGGING COMPLETED SUCCESSFULLY!"
        echo "🔗 Platform ready: Frontend (3000) | Backend (4000)"
        
        echo "CONTINUOUS TESTING COMPLETED SUCCESSFULLY at $(date)" >> "$LOG_FILE"
        
        # Cleanup
        rm -f invalid_email_test.json weak_password_test.json
        
        exit 0
    fi
    
    sleep 1
    ITERATION=$((ITERATION + 1))
done

# Max iterations erreicht
echo ""
echo -e "${YELLOW}⚠️  Reached $MAX_ITERATIONS iterations${NC}"
echo "📊 Stats: $TOTAL_FAILURES failures, $CONSECUTIVE_SUCCESSES consecutive successes"
echo "📋 Log: $LOG_FILE"

# Cleanup
rm -f invalid_email_test.json weak_password_test.json

exit 1