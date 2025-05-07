#!/bin/bash
# X-University Dev Bootstrap Script (HTTPS via localhost.run)
# - Runs unit tests for all services
# - Starts PostgreSQL via Docker Compose if not running
# - Starts user-service (FastAPI) in background
# - Starts frontend (Next.js) in background
# - Configures and starts SSH reverse tunnel to localhost.run for HTTPS tunneling
# - Frees up ports before starting

set -e

# Load HTTPS environment from frontend/.env.https
if [ -f frontend/.env.https ]; then
  set -o allexport
  source frontend/.env.https
  set +o allexport
fi

# Free ports 8000 and 3000 if needed
for port in 8000 3000; do
  PID=$(lsof -ti tcp:$port || true)
  if [ -n "$PID" ]; then
    echo "Killing process on port $port (PID $PID)"
    kill -9 $PID || true
  fi
done

# Run unit tests for each service
echo "\n--- Running unit tests for all services ---"
SERVICES=(user-service assignment-service evaluation-service content-gen-service chatbot-service notification-service payment-service api-gateway analytics-service)
for svc in "${SERVICES[@]}"; do
  if [ -d "$svc" ]; then
    echo "\n--- Testing $svc ---"
    if [ -f "$svc/requirements.txt" ]; then
      (cd "$svc" && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && pytest --maxfail=1 --disable-warnings)
    elif [ -f "$svc/package.json" ]; then
      (cd "$svc" && npm install && npm test)
    fi
  fi
done

# Check for mkcert certs, generate if missing
if [ ! -f "localhost.pem" ] || [ ! -f "localhost-key.pem" ]; then
  echo "Generating self-signed certs for localhost using mkcert..."
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "mkcert not found. Please install mkcert: brew install mkcert && mkcert -install"
    exit 1
  fi
  mkcert localhost
fi

# Start PostgreSQL if not running
echo "\n--- Checking PostgreSQL via Docker Compose ---"
if ! docker ps | grep -q "postgres"; then
  echo "Starting PostgreSQL..."
  (cd user-service && docker compose up -d db)
else
  echo "PostgreSQL already running."
fi

# Start user-service in background
echo "\n--- Starting user-service (FastAPI) on port 8000 ---"
cd user-service
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 &
cd -

# Start frontend in HTTPS mode with mkcert certs
echo "\n--- Starting frontend (Next.js) on https://localhost:3000 ---"
cd frontend
export NEXT_PUBLIC_RUNTIME_ENV=prod
export HTTPS=true
export SSL_CRT_FILE=../localhost.pem
export SSL_KEY_FILE=../localhost-key.pem
npm install
npm run dev &
cd -

echo "\n--- Starting all services (including Keycloak and db) via Docker Compose ---"
docker compose up -d db keycloak

sleep 2
echo "\nAll services started with HTTPS on https://localhost:3000 using mkcert self-signed certs."
echo "If you see a browser warning, accept the certificate to proceed."
echo "Keycloak is running at http://localhost:8080 (admin/admin)."
echo "Update your .env.https and frontend OIDC config to use Keycloak."

# Open Chrome in incognito mode and developer mode to the frontend URL
open -na "Google Chrome" --args --incognito --auto-open-devtools-for-tabs --user-data-dir="/tmp/xuni-chrome-devtools" https://localhost:3000