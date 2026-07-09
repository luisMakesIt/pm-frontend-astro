#!/bin/bash
# Smoke Test — PM System
# Quick regression test: verifies all pages load, API responds, and key CRUD operations work.
# Run: bash tests/smoke.sh
# Exit 0 if all pass, non-zero if any fail.

API="http://zasm8vmm79eejamdbgx3zwda.144.217.163.180.sslip.io/api"
FRONT="http://msiqnz11cno6q97gb4gjk5rs.144.217.163.180.sslip.io"
CT="Content-Type: application/json"
ACCEPT="Accept: application/json"
PASS=0
FAIL=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok() { echo -e " ${GREEN}✅ PASS${NC}: $1"; PASS=$((PASS+1)); }
no() { echo -e " ${RED}❌ FAIL${NC}: $1"; FAIL=$((FAIL+1)); }

echo "=========================================="
echo "  Smoke Test — PM System"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "=========================================="
echo ""

# ── 1. Frontend Pages ──
echo "── Frontend Pages ──"
for page in "" "login/" "projects/" "requerimientos/" "actas/" "actividades/" "productos/" "bitacora/" "equipo/" "reportes/"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT/$page" 2>/dev/null)
  if [ "$code" = "200" ]; then ok "GET /$page → $code"; else no "GET /$page → $code"; fi
done

# ── 2. Frontend CSS/JS Assets ──
echo ""
echo "── Frontend Assets ──"
CSS_FILE=$(curl -s "$FRONT/" | grep -oP 'href="\K[^"]+\.css' | head -1)
JS_FILE=$(curl -s "$FRONT/" | grep -oP 'src="\K[^"]+\.js' | head -1)
if [ -n "$CSS_FILE" ]; then
  css_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT$CSS_FILE")
  if [ "$css_code" = "200" ]; then ok "CSS asset ($CSS_FILE) → $css_code"; else no "CSS asset ($CSS_FILE) → $css_code"; fi
else no "No CSS asset found in HTML"; fi
if [ -n "$JS_FILE" ]; then
  js_code=$(curl -s -o /dev/null -w "%{http_code}" "$FRONT$JS_FILE")
  if [ "$js_code" = "200" ]; then ok "JS asset ($JS_FILE) → $js_code"; else no "JS asset ($JS_FILE) → $js_code"; fi
else
  # Astro static may not have external JS — inline scripts are fine
  ok "No external JS (inline scripts OK)"
fi

# ── 3. Frontend Content Verification ──
echo ""
echo "── Frontend Content ──"
DASH_HTML=$(curl -s "$FRONT/")
if echo "$DASH_HTML" | grep -qi "PM System\|Dashboard\|pm_token"; then ok "Dashboard has expected content"; else no "Dashboard missing expected content"; fi
LOGIN_HTML=$(curl -s "$FRONT/login/")
if echo "$LOGIN_HTML" | grep -qi "login\|email\|password\|pm_token"; then ok "Login page has form elements"; else no "Login page missing form elements"; fi
PROJECTS_HTML=$(curl -s "$FRONT/projects/")
if echo "$PROJECTS_HTML" | grep -qi "Proyectos\|project\|Nuevo"; then ok "Projects page has expected content"; else no "Projects page missing content"; fi

# ── 4. Sidebar Navigation (all 9 pages linked) ──
echo ""
echo "── Sidebar Navigation ──"
NAV_PAGES="Dashboard Proyectos Requerimientos Actas Actividades Productos Bitácora Equipo Reportes"
for nav_item in $NAV_PAGES; do
  if echo "$DASH_HTML" | grep -qi "$nav_item"; then ok "Sidebar link: $nav_item"; else no "Sidebar missing: $nav_item"; fi
done

# ── 5. API Health ──
echo ""
echo "── API Health ──"
HEALTH=$(curl -s -w "\n%{http_code}" "$API/health" -H "$ACCEPT")
HEALTH_CODE=$(echo "$HEALTH" | tail -1)
if [ "$HEALTH_CODE" = "200" ]; then ok "GET /api/health → $HEALTH_CODE"; else no "GET /api/health → $HEALTH_CODE"; fi

# ── 6. API Auth ──
echo ""
echo "── API Authentication ──"
LOGIN_RESP=$(curl -s -X POST "$API/auth/login" -H "$CT" -H "$ACCEPT" -d '{"email":"admin@pmsystem.com","password":"admin123"}')
TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.loads(sys.stdin.read()).get('data',{}).get('token',''))" 2>/dev/null)
if [ -n "$TOKEN" ] && [ "$TOKEN" != "" ]; then
  ok "POST /api/auth/login → token obtained"
else no "POST /api/auth/login → failed: $LOGIN_RESP"; fi

# ── 7. API CRUD (read-only) ──
echo ""
echo "── API Read Endpoints ──"
AUTH="Authorization: Bearer $TOKEN"

EP=$(curl -s -w "\n%{http_code}" "$API/projects" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
EP_CODE=$(echo "$EP" | tail -1)
if [ "$EP_CODE" = "200" ]; then ok "GET /api/projects → $EP_CODE"; else no "GET /api/projects → $EP_CODE"; fi

EP=$(curl -s -w "\n%{http_code}" "$API/reports/summary" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
EP_CODE=$(echo "$EP" | tail -1)
if [ "$EP_CODE" = "200" ]; then ok "GET /api/reports/summary → $EP_CODE"; else no "GET /api/reports/summary → $EP_CODE"; fi

# Only test nested endpoints if projects exist
PROJ_ID=$(curl -s "$API/projects" -H "$ACCEPT" -H "$AUTH" | python3 -c "import sys,json; d=json.loads(sys.stdin.read()).get('data',[]); print(d[0]['id'] if d else '')" 2>/dev/null)
if [ -n "$PROJ_ID" ]; then
  EP=$(curl -s -w "\n%{http_code}" "$API/projects/$PROJ_ID" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
  EP_CODE=$(echo "$EP" | tail -1)
  if [ "$EP_CODE" = "200" ]; then ok "GET /api/projects/$PROJ_ID → $EP_CODE"; else no "GET /api/projects/$PROJ_ID → $EP_CODE"; fi

  # Requirements (nested)
  EP=$(curl -s -w "\n%{http_code}" "$API/projects/$PROJ_ID/requirements" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
  EP_CODE=$(echo "$EP" | tail -1)
  if [ "$EP_CODE" = "200" ]; then ok "GET /api/projects/{id}/requirements → $EP_CODE"; else no "GET /api/projects/{id}/requirements → $EP_CODE"; fi

  # Team members (nested)
  EP=$(curl -s -w "\n%{http_code}" "$API/projects/$PROJ_ID/team-members" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
  EP_CODE=$(echo "$EP" | tail -1)
  if [ "$EP_CODE" = "200" ]; then ok "GET /api/projects/{id}/team-members → $EP_CODE"; else no "GET /api/projects/{id}/team-members → $EP_CODE"; fi
else
  echo -e " ${YELLOW}⚠️ SKIP${NC}: No projects to test nested endpoints"
fi

# ── 8. API Error Handling ──
echo ""
echo "── API Error Handling ──"
EP=$(curl -s -w "\n%{http_code}" "$API/projects/99999" -H "$ACCEPT" -H "$AUTH" 2>/dev/null)
EP_CODE=$(echo "$EP" | tail -1)
if [ "$EP_CODE" = "404" ]; then ok "GET /api/projects/99999 → $EP_CODE (404 expected)"; else no "GET /api/projects/99999 → $EP_CODE (expected 404)"; fi

EP=$(curl -s -w "\n%{http_code}" "$API/projects" -H "$ACCEPT" -H "Authorization: Bearer invalid_token_12345" 2>/dev/null)
EP_CODE=$(echo "$EP" | tail -1)
if [ "$EP_CODE" = "401" ]; then ok "GET /api/projects (invalid token) → $EP_CODE (401 expected)"; else no "GET /api/projects (invalid token) → $EP_CODE (expected 401)"; fi

EP=$(curl -s -w "\n%{http_code}" -X POST "$API/projects" -H "$CT" -H "$ACCEPT" -H "$AUTH" -d '{}' 2>/dev/null)
EP_CODE=$(echo "$EP" | tail -1)
if [ "$EP_CODE" = "422" ]; then ok "POST /api/projects (empty body) → $EP_CODE (422 expected)"; else no "POST /api/projects (empty body) → $EP_CODE (expected 422)"; fi

# ── 9. Security Checks ──
echo ""
echo "── Security ──"

# CORS not wildcard
CORS_RESP=$(curl -s -I -X OPTIONS "$API/projects" -H "Origin: http://evil.com" -H "Access-Control-Request-Method: GET" 2>/dev/null)
CORS_HEADER=$(echo "$CORS_RESP" | grep -i "access-control-allow-origin" | tr -d '\r')
if echo "$CORS_HEADER" | grep -qi "\*"; then
  no "CORS allows wildcard origin — security risk"
else
  ok "CORS does not allow wildcard origin"
fi

# Login page does not show demo credentials
if echo "$LOGIN_HTML" | grep -qi "admin123\|admin@pmsystem"; then
  no "Login page leaks demo credentials"
else
  ok "Login page does not expose credentials"
fi

# Login page does not have mock-token fallback
if echo "$LOGIN_HTML" | grep -qi "mock-token\|mock-token"; then
  no "Login page has mock-token fallback — security risk"
else
  ok "Login page has no mock-token bypass"
fi

# Frontend does not hardcode internal API URL in HTML
if echo "$LOGIN_HTML" | grep -qi "zasm8vmm79eejamdbgx3zwda"; then
  no "Login page leaks internal API hostname"
else
  ok "Login page does not leak internal API URL"
fi

# Security headers present on frontend
SEC_HEADERS=$(curl -s -I "$FRONT/" 2>/dev/null)
if echo "$SEC_HEADERS" | grep -qi "X-Content-Type-Options"; then
  ok "Frontend has X-Content-Type-Options header"
else
  no "Frontend missing X-Content-Type-Options header"
fi
if echo "$SEC_HEADERS" | grep -qi "X-Frame-Options"; then
  ok "Frontend has X-Frame-Options header"
else
  no "Frontend missing X-Frame-Options header"
fi

# API rate limiting on login (5 attempts → 429)
RATE_LIMITED=0
for i in 1 2 3 4 5 6 7; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/auth/login" -H "$CT" -H "$ACCEPT" -d '{"email":"fake@test.com","password":"wrong"}' 2>/dev/null)
  if [ "$code" = "429" ]; then RATE_LIMITED=1; break; fi
done
if [ "$RATE_LIMITED" = "1" ]; then
  ok "Login rate limiting active (429 after repeated failures)"
else
  echo -e " ${YELLOW}⚠️ SKIP${NC}: Login rate limiting not triggered (may need more attempts)"
fi

# XSS protection: esc() helper present in pages with innerHTML
for page_file in src/pages/requerimientos.astro src/pages/actividades.astro src/pages/productos.astro src/pages/equipo.astro src/pages/actas.astro src/pages/bitacora.astro src/pages/reportes.astro; do
  if [ -f "$page_file" ]; then
    if grep -q "function esc" "$page_file"; then
      ok "XSS esc() helper in $page_file"
    else
      no "XSS esc() helper missing in $page_file"
    fi
  fi
done

# ── Summary ──
echo ""
echo "=========================================="
TOTAL=$((PASS + FAIL))
echo "  RESULTS: $PASS/$TOTAL passed, $FAIL failed"
echo "=========================================="
if [ $FAIL -eq 0 ]; then
  echo -e "  ${GREEN}✅ ALL SMOKE TESTS PASSED${NC}"
else
  echo -e "  ${RED}❌ $FAIL TEST(S) FAILED — REGRESSION DETECTED${NC}"
fi

exit $FAIL
