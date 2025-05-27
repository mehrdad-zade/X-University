#!/usr/bin/env bash
set -euo pipefail

KC_HOME=/opt/keycloak
KC_CMD="$KC_HOME/bin/kc.sh"
BOOTSTRAP="$KC_HOME/bin/setup-keycloak.sh"

echo "🔸 Starting Keycloak in dev mode (background)…"
"$KC_CMD" start-dev --import-realm &
KC_PID=$!

echo "⏳ Waiting for kcadm to be able to log in…"
until /opt/keycloak/bin/kcadm.sh config credentials \
      --server "http://localhost:8080" \
      --realm master \
      --user "${KC_BOOTSTRAP_ADMIN_USERNAME:-admin}" \
      --password "${KC_BOOTSTRAP_ADMIN_PASSWORD:-admin}" \
      > /dev/null 2>&1
do
  sleep 1
done

echo "🔧 Running setup-keycloak.sh…"
bash "$BOOTSTRAP"

echo "✅ Bootstrap done, handing off to Keycloak (pid $KC_PID)…"
wait "$KC_PID"
