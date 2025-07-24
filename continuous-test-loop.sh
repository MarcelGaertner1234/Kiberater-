#!/bin/bash

echo "🔄 KONTINUIERLICHER TEST-LOOP"
echo "============================="
echo "Drücke Ctrl+C zum Stoppen"
echo ""

# Test Konfiguration
MAX_ITERATIONS=50
ITERATION=1
TOTAL_FAILURES=0
CONSECUTIVE_SUCCESSES=0
REQUIRED_CONSECUTIVE_SUCCESSES=5

# Log-Datei für kontinuierliche Tests
LOG_FILE="continuous-test-$(date +%Y%m%d_%H%M%S).log"
echo "Test gestartet um $(date)" > "$LOG_FILE"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test-Funktion
run_comprehensive_test() {
    local iteration=$1
    local timestamp=$(date +%s)
    local test_failures=0
    
    echo -e "${BLUE}📊 Test Iteration $iteration/$(MAX_ITERATIONS) - $(date)${NC}"
    echo "Test Iteration $iteration - $(date)" >> "$LOG_FILE"
    
    # 1. Server Health Check
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
    
    # 2. Authentication Flow Test
    echo -n "🔐 Auth Flow... "
    TEST_EMAIL="loop_test_${timestamp}@example.com"
    
    # Registration
    REG_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\",\"name\":\"Loop Test $iteration\"}" 2>/dev/null)
    
    REG_SUCCESS=$(echo "$REG_RESPONSE" | jq -r '.success // false' 2>/dev/null)
    
    if [ "$REG_SUCCESS" != "true" ]; then
        echo -e "${RED}FAILED${NC} (Registration)"
        echo "Registration failed: $(echo "$REG_RESPONSE" | jq -r '.error.message // "unknown error"')" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        # Login Test
        LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
            -H "Content-Type: application/json" \
            -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"Test123!\"}" 2>/dev/null)
        
        LOGIN_SUCCESS=$(echo "$LOGIN_RESPONSE" | jq -r '.success // false' 2>/dev/null)
        
        if [ "$LOGIN_SUCCESS" != "true" ]; then
            echo -e "${RED}FAILED${NC} (Login)"
            echo "Login failed: $(echo "$LOGIN_RESPONSE" | jq -r '.error.message // "unknown error"')" >> "$LOG_FILE"
            test_failures=$((test_failures + 1))
        else
            # Protected Endpoint Test
            ACCESS_TOKEN=$(echo "$REG_RESPONSE" | jq -r '.data.tokens.accessToken // ""' 2>/dev/null)
            if [ ! -z "$ACCESS_TOKEN" ]; then
                USER_RESPONSE=$(curl -s -H "Authorization: Bearer $ACCESS_TOKEN" \
                    http://localhost:4000/api/v1/users/me 2>/dev/null)
                
                USER_SUCCESS=$(echo "$USER_RESPONSE" | jq -r '.success // false' 2>/dev/null)
                
                if [ "$USER_SUCCESS" != "true" ]; then
                    echo -e "${RED}FAILED${NC} (Protected Endpoint)"
                    echo "Protected endpoint failed" >> "$LOG_FILE"
                    test_failures=$((test_failures + 1))
                else
                    echo -e "${GREEN}OK${NC}"
                fi
            else
                echo -e "${RED}FAILED${NC} (No Token)"
                echo "No access token received" >> "$LOG_FILE"
                test_failures=$((test_failures + 1))
            fi
        fi
    fi
    
    # 3. Validation Tests
    echo -n "🛡️  Validation... "
    
    # Invalid email test
    INVALID_RESPONSE=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{"email":"invalid","password":"Test123!","name":"Test"}' 2>/dev/null)
    
    INVALID_SUCCESS=$(echo "$INVALID_RESPONSE" | jq -r '.success // true' 2>/dev/null)
    
    if [ "$INVALID_SUCCESS" != "false" ]; then
        echo -e "${RED}FAILED${NC} (Invalid email not rejected)"
        echo "Invalid email validation failed" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # 4. Frontend Pages Test
    echo -n "📱 Frontend Pages... "
    page_failures=0
    
    for page in "/" "/login" "/register" "/about" "/contact"; do
        STATUS=$(curl -s "http://localhost:3000$page" -w '%{http_code}' -o /dev/null 2>/dev/null)
        if [ "$STATUS" != "200" ]; then
            page_failures=$((page_failures + 1))
            echo "Page $page failed with status $STATUS" >> "$LOG_FILE"
        fi
    done
    
    if [ $page_failures -gt 0 ]; then
        echo -e "${RED}FAILED${NC} ($page_failures pages)"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # 5. Load Test (5 rapid requests)
    echo -n "⚡ Load Test... "
    load_failures=0
    
    for i in {1..5}; do
        STATUS=$(curl -s http://localhost:4000/health -w '%{http_code}' -o /dev/null 2>/dev/null)
        if [ "$STATUS" != "200" ]; then
            load_failures=$((load_failures + 1))
        fi
        sleep 0.1
    done
    
    if [ $load_failures -gt 0 ]; then
        echo -e "${RED}FAILED${NC} ($load_failures/5)"
        echo "Load test failed: $load_failures failures" >> "$LOG_FILE"
        test_failures=$((test_failures + 1))
    else
        echo -e "${GREEN}OK${NC}"
    fi
    
    # Ergebnis für diese Iteration
    if [ $test_failures -eq 0 ]; then
        echo -e "${GREEN}✅ Iteration $iteration: ALL TESTS PASSED${NC}"
        CONSECUTIVE_SUCCESSES=$((CONSECUTIVE_SUCCESSES + 1))
    else
        echo -e "${RED}❌ Iteration $iteration: $test_failures FAILURES${NC}"
        echo "Iteration $iteration failures: $test_failures" >> "$LOG_FILE"
        TOTAL_FAILURES=$((TOTAL_FAILURES + test_failures))
        CONSECUTIVE_SUCCESSES=0
    fi
    
    echo "Total failures so far: $TOTAL_FAILURES" >> "$LOG_FILE"
    echo "---" >> "$LOG_FILE"
    
    return $test_failures
}

# Hauptschleife
echo "Starting continuous testing..."
echo ""

while [ $ITERATION -le $MAX_ITERATIONS ]; do
    run_comprehensive_test $ITERATION
    
    # Prüfe ob wir genug aufeinanderfolgende Erfolge haben
    if [ $CONSECUTIVE_SUCCESSES -ge $REQUIRED_CONSECUTIVE_SUCCESSES ]; then
        echo ""
        echo -e "${GREEN}🎉 SUCCESS: $REQUIRED_CONSECUTIVE_SUCCESSES consecutive successful test runs!${NC}"
        echo -e "${GREEN}✅ Platform appears to be stable and fully functional${NC}"
        echo ""
        echo "📊 Final Stats:"
        echo "- Total iterations: $ITERATION"
        echo "- Total failures: $TOTAL_FAILURES"
        echo "- Consecutive successes: $CONSECUTIVE_SUCCESSES"
        echo "- Success rate: $(( (ITERATION - TOTAL_FAILURES) * 100 / ITERATION ))%"
        echo ""
        echo "🔗 Platform Access:"
        echo "- Frontend: http://localhost:3000"
        echo "- Backend:  http://localhost:4000"
        echo ""
        echo "📋 Test log saved to: $LOG_FILE"
        
        echo "CONTINUOUS TESTING COMPLETED SUCCESSFULLY at $(date)" >> "$LOG_FILE"
        echo "Final stats: $ITERATION iterations, $TOTAL_FAILURES failures, $CONSECUTIVE_SUCCESSES consecutive successes" >> "$LOG_FILE"
        
        exit 0
    fi
    
    # Kurze Pause zwischen Tests
    sleep 2
    
    ITERATION=$((ITERATION + 1))
    
    # Zeige Progress
    if [ $((ITERATION % 10)) -eq 0 ]; then
        echo ""
        echo -e "${YELLOW}📊 Progress: $ITERATION/$MAX_ITERATIONS iterations completed${NC}"
        echo -e "${YELLOW}📈 Total failures so far: $TOTAL_FAILURES${NC}"
        echo -e "${YELLOW}🔄 Consecutive successes: $CONSECUTIVE_SUCCESSES${NC}"
        echo ""
    fi
done

# Wenn wir hier ankommen, haben wir das Maximum erreicht ohne genug Erfolge
echo ""
echo -e "${YELLOW}⚠️  Reached maximum iterations ($MAX_ITERATIONS) without achieving stability${NC}"
echo "📊 Final Stats:"
echo "- Total failures: $TOTAL_FAILURES"
echo "- Success rate: $(( (MAX_ITERATIONS - TOTAL_FAILURES) * 100 / MAX_ITERATIONS ))%"
echo "- Best consecutive successes: $CONSECUTIVE_SUCCESSES"
echo ""
echo "📋 Detailed log: $LOG_FILE"
echo ""
echo "🔧 Platform may need additional debugging for full stability"

echo "CONTINUOUS TESTING COMPLETED at $(date) - Max iterations reached" >> "$LOG_FILE"
echo "Final stats: $MAX_ITERATIONS iterations, $TOTAL_FAILURES failures" >> "$LOG_FILE"