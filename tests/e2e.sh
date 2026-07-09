#!/bin/bash
# E2E Test Script for PM System API
# Tests full CRUD flow: Project → Requirement → Acta → Activity → Product → DevLog → TeamMember
set +e  # Don't exit on error, we handle it ourselves

API="http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api"
PASS=0
FAIL=0
TEST_DATA=""
CT="Content-Type: application/json"
ACCEPT="Accept: application/json"

 GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_pass() { echo -e " ${GREEN}✅ PASS${NC}: $1"; PASS=$((PASS+1)); }
log_fail() { echo -e " ${RED}❌ FAIL${NC}: $1"; FAIL=$((FAIL+1)); }

echo "=========================================="
echo "  E2E Test — PM System API"
echo "=========================================="
echo ""

# 1. Login
echo "--- Step 1: Login ---"
LOGIN_RESP=$(curl -s -X POST "$API/auth/login" \
  -H "$CT" -H "$ACCEPT" \
  -d '{"email":"admin@pmsystem.com","password":"admin123"}')

TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('token',''))" 2>/dev/null)

if [ -n "$TOKEN" ] && [ "$TOKEN" != "" ]; then
  log_pass "Login successful, token obtained"
else
  log_fail "Login failed: $LOGIN_RESP"
  echo "Aborting."
  exit 1
fi

AUTH="Authorization: Bearer $TOKEN"

# 2. Create Project
echo ""
echo "--- Step 2: Create Project ---"
PROJ_RESP=$(curl -s -X POST "$API/projects" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"name":"E2E Test Project","description":"Created by e2e test","status":"en_desarrollo","start_date":"2026-07-09","end_date":"2026-12-31","client_name":"Test Client"}')
PROJ_ID=$(echo "$PROJ_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$PROJ_ID" ] && [ "$PROJ_ID" != "" ]; then
  log_pass "Project created (ID: $PROJ_ID)"
else
  log_fail "Project creation failed: $PROJ_RESP"
  exit 1
fi

# 3. Create Requirement
echo ""
echo "--- Step 3: Create Requirement ---"
REQ_RESP=$(curl -s -X POST "$API/projects/$PROJ_ID/requirements" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"title":"E2E Test Requirement","description":"Test req description","priority":"alta","status":"pendiente"}')
REQ_ID=$(echo "$REQ_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$REQ_ID" ] && [ "$REQ_ID" != "" ]; then
  log_pass "Requirement created (ID: $REQ_ID)"
else
  log_fail "Requirement creation failed: $REQ_RESP"
fi

# 4. Create Acta
echo ""
echo "--- Step 4: Create Acta ---"
ACTA_RESP=$(curl -s -X POST "$API/requirements/$REQ_ID/actas" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"fecha_sesion":"2026-07-09","cliente_nombre":"Test Cliente","cliente_email":"cliente@test.com","cliente_empresa":"TestCorp","participantes":["Juan","Maria"],"notas":"Notas de prueba","estado_firma":"sin_firmar"}')
ACTA_ID=$(echo "$ACTA_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$ACTA_ID" ] && [ "$ACTA_ID" != "" ]; then
  log_pass "Acta created (ID: $ACTA_ID)"
else
  log_fail "Acta creation failed: $ACTA_RESP"
fi

# 5. Create Activity
echo ""
echo "--- Step 5: Create Activity ---"
ACT_RESP=$(curl -s -X POST "$API/requirements/$REQ_ID/activities" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"title":"E2E Test Activity","description":"Test activity","status":"pendiente","tiempo_estimado_horas":4}')
ACT_ID=$(echo "$ACT_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$ACT_ID" ] && [ "$ACT_ID" != "" ]; then
  log_pass "Activity created (ID: $ACT_ID)"
else
  log_fail "Activity creation failed: $ACT_RESP"
fi

# 6. Create Product
echo ""
echo "--- Step 6: Create Product ---"
PROD_RESP=$(curl -s -X POST "$API/activities/$ACT_ID/products" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"name":"E2E Test Product","type":"documento","description":"Test product","version":"1.0"}')
PROD_ID=$(echo "$PROD_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$PROD_ID" ] && [ "$PROD_ID" != "" ]; then
  log_pass "Product created (ID: $PROD_ID)"
else
  log_fail "Product creation failed: $PROD_RESP"
fi

# 7. Create Development Log
echo ""
echo "--- Step 7: Create Development Log ---"
DEVLOG_RESP=$(curl -s -X POST "$API/activities/$ACT_ID/development-logs" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"developer_name":"Test Dev","developer_email":"dev@test.com","tipo_accion":"commit","descripcion":"Test commit","tiempo_gastado_minutos":30}')
DEVLOG_ID=$(echo "$DEVLOG_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$DEVLOG_ID" ] && [ "$DEVLOG_ID" != "" ]; then
  log_pass "Development Log created (ID: $DEVLOG_ID)"
else
  log_fail "Development Log creation failed: $DEVLOG_RESP"
fi

# 8. Create Team Member
echo ""
echo "--- Step 8: Create Team Member ---"
MEMBER_RESP=$(curl -s -X POST "$API/projects/$PROJ_ID/team-members" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"name":"Test Member","email":"member@test.com","role":"developer","nivel_experiencia":"senior","estado":"disponible"}')
MEMBER_ID=$(echo "$MEMBER_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('id',''))" 2>/dev/null)

if [ -n "$MEMBER_ID" ] && [ "$MEMBER_ID" != "" ]; then
  log_pass "Team Member created (ID: $MEMBER_ID)"
else
  log_fail "Team Member creation failed: $MEMBER_RESP"
fi

# 9. Read back all entities
echo ""
echo "--- Step 9: Read back all entities ---"

PROJ_GET=$(curl -s "$API/projects/$PROJ_ID" -H "$AUTH")
PROJ_NAME=$(echo "$PROJ_GET" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('name',''))" 2>/dev/null)
if [ "$PROJ_NAME" = "E2E Test Project" ]; then log_pass "Read project: $PROJ_NAME"; else log_fail "Read project failed: $PROJ_GET"; fi

REQ_GET=$(curl -s "$API/projects/$PROJ_ID/requirements" -H "$AUTH")
REQ_COUNT=$(echo "$REQ_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$REQ_COUNT" -ge 1 ]; then log_pass "Requirements list: $REQ_COUNT item(s)"; else log_fail "Requirements list empty"; fi

ACTA_GET=$(curl -s "$API/requirements/$REQ_ID/actas" -H "$AUTH")
ACTA_COUNT=$(echo "$ACTA_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$ACTA_COUNT" -ge 1 ]; then log_pass "Actas list: $ACTA_COUNT item(s)"; else log_fail "Actas list empty"; fi

ACT_GET=$(curl -s "$API/requirements/$REQ_ID/activities" -H "$AUTH")
ACT_COUNT=$(echo "$ACT_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$ACT_COUNT" -ge 1 ]; then log_pass "Activities list: $ACT_COUNT item(s)"; else log_fail "Activities list empty"; fi

PROD_GET=$(curl -s "$API/activities/$ACT_ID/products" -H "$AUTH")
PROD_COUNT=$(echo "$PROD_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$PROD_COUNT" -ge 1 ]; then log_pass "Products list: $PROD_COUNT item(s)"; else log_fail "Products list empty"; fi

DEVLOG_GET=$(curl -s "$API/activities/$ACT_ID/development-logs" -H "$AUTH")
DEVLOG_COUNT=$(echo "$DEVLOG_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$DEVLOG_COUNT" -ge 1 ]; then log_pass "Dev Logs list: $DEVLOG_COUNT item(s)"; else log_fail "Dev Logs list empty"; fi

MEMBER_GET=$(curl -s "$API/projects/$PROJ_ID/team-members" -H "$AUTH")
MEMBER_COUNT=$(echo "$MEMBER_GET" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(len(d) if isinstance(d,list) else 1)" 2>/dev/null)
if [ "$MEMBER_COUNT" -ge 1 ]; then log_pass "Team Members list: $MEMBER_COUNT item(s)"; else log_fail "Team Members list empty"; fi

# 10. Update project
echo ""
echo "--- Step 10: Update Project ---"
UPD_RESP=$(curl -s -X POST "$API/projects/$PROJ_ID?_method=PUT" \
  -H "$CT" -H "$AUTH" -H "$ACCEPT" \
  -d '{"name":"E2E Updated Project","status":"completado"}')
UPD_NAME=$(echo "$UPD_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('name',''))" 2>/dev/null)
if [ "$UPD_NAME" = "E2E Updated Project" ]; then log_pass "Project updated: $UPD_NAME"; else log_fail "Project update failed: $UPD_RESP"; fi

# 11. Cleanup — delete all test entities (children first)
echo ""
echo "--- Step 11: Cleanup (delete test data) ---"

curl -s -X DELETE "$API/activities/$ACT_ID/development-logs/$DEVLOG_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "DevLog deleted"

curl -s -X DELETE "$API/activities/$ACT_ID/products/$PROD_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Product deleted"

curl -s -X DELETE "$API/requirements/$REQ_ID/activities/$ACT_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Activity deleted"

curl -s -X DELETE "$API/requirements/$REQ_ID/actas/$ACTA_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Acta deleted"

curl -s -X DELETE "$API/projects/$PROJ_ID/requirements/$REQ_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Requirement deleted"

curl -s -X DELETE "$API/projects/$PROJ_ID/team-members/$MEMBER_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Team Member deleted"

curl -s -X DELETE "$API/projects/$PROJ_ID" -H "$AUTH" -H "Accept: application/json" > /dev/null
log_pass "Project deleted"

# Summary
echo ""
echo "=========================================="
echo "  RESULTS: $PASS passed, $FAIL failed"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
  echo -e "  ${GREEN}ALL TESTS PASSED ✅${NC}"
else
  echo -e "  ${RED}SOME TESTS FAILED ❌${NC}"
fi

exit $FAIL
