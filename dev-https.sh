#!/usr/bin/env bash
set -euo pipefail

# --- Load HTTPS env if present ---
if [ -f frontend/.env.https ]; then
  set -o allexport
  source frontend/.env.https
  set +o allexport
fi

# --- Free up ports 8000 & 3000 ---
for port in 8000 3000; do
  if pid=$(lsof -ti tcp:$port); then
    echo "Killing process on port $port (PID $pid)"
    kill -9 "$pid" || true
  fi
done

# --- Run unit tests for each service ---
echo -e "\n--- Running unit tests for all services ---"
SERVICES=(
  user-service assignment-service evaluation-service
  content-gen-service chatbot-service notification-service
  payment-service api-gateway analytics-service
)
for svc in "${SERVICES[@]}"; do
  if [ -d "$svc" ]; then
    echo -e "\n--- Testing $svc ---"
    pushd "$svc" >/dev/null

    if [ -f requirements.txt ]; then
      python3 -m venv .venv
      source .venv/bin/activate
      pip install --upgrade pip
      pip install -r requirements.txt
      pytest --maxfail=1 --disable-warnings
      deactivate

    elif [ -f package.json ]; then
      npm install
      npm test
    fi

    popd >/dev/null
  fi
done

# --- mkcert for localhost if needed ---
if [ ! -f localhost.pem ] || [ ! -f localhost-key.pem ]; then
  echo "Generating self-signed certs with mkcert..."
  if ! command -v mkcert >/dev/null; then
    echo "Please install mkcert: brew install mkcert && mkcert -install"
    exit 1
  fi
  mkcert localhost
fi

# --- Start Postgres (user-service/docker-compose) ---
echo -e "\n--- Ensuring PostgreSQL is up for user-service ---"
pushd user-service >/dev/null
if ! docker compose ps | grep -q 'db.*Up'; then
  docker compose up -d db
  echo "Waiting for Postgres to become ready..."
  sleep 10
fi
popd >/dev/null

# --- Start user-service (FastAPI) on port 8000 ---
echo -e "\n--- Starting user-service (FastAPI) on port 8000 ---"
pushd user-service >/dev/null

# Create & activate venv
[ -d .venv ] || python3 -m venv .venv
source .venv/bin/activate

# Install deps
pip install --upgrade pip
pip install -r requirements.txt

# Export both project roots so both `src.*` and `core.*` import paths resolve
export PYTHONPATH="${PWD}:${PWD}/src${PYTHONPATH:+:$PYTHONPATH}"

# Launch uvicorn
uvicorn src.main:app \
  --reload \
  --host 0.0.0.0 \
  --port 8000 &

popd >/dev/null

# --- Start frontend (Next.js) on https://localhost:3000 ---
echo -e "\n--- Starting frontend on https://localhost:3000 ---"
pushd frontend >/dev/null

export NEXT_PUBLIC_RUNTIME_ENV=prod
export HTTPS=true
export SSL_CRT_FILE=../localhost.pem
export SSL_KEY_FILE=../localhost-key.pem

npm install
npm run dev &

popd >/dev/null

# --- Start Keycloak via root docker-compose ---
echo -e "\n--- Starting Keycloak (root docker-compose) ---"
docker compose up -d keycloak

echo "Waiting for Keycloak realm x-university to be ready…"
until curl -sf "http://localhost:8080/realms/x-university/.well-known/openid-configuration" >/dev/null; do
  sleep 2
done

echo -e "\n✅ All services are up:"
echo " • FastAPI → http://localhost:8000"
echo " • Frontend → https://localhost:3000"
echo " • Keycloak → http://localhost:8080 (admin/admin)"
echo

# Optional: open in Chrome
open -na "Google Chrome" --args \
  --incognito \
  --auto-open-devtools-for-tabs \
  --user-data-dir="/tmp/xuni-dev" \
  https://localhost:3000
