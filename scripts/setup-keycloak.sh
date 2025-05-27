#!/usr/bin/env bash
set -euo pipefail

KCADM="/opt/keycloak/bin/kcadm.sh"
HOST="${KC_HOST:-localhost}"
PORT="${KC_PORT:-8080}"
ADMIN="${KC_ADMIN_USER:-admin}"
PASS="${KC_ADMIN_PASS:-admin}"

REALM="x-university"
CLIENT_ID="frontend-local"
CLIENT_SECRET="${CLIENT_SECRET:-SOME_SUPER_SECRET}"

echo "🔐 Login to master realm"
"$KCADM" config credentials \
  --server "http://$HOST:$PORT" \
  --realm master \
  --user "$ADMIN" --password "$PASS"

echo "🌐 Ensure realm exists"
if ! "$KCADM" get realms/"$REALM" >/dev/null 2>&1; then
  "$KCADM" create realms -s realm="$REALM" -s enabled=true
fi

echo "🔑 Ensure client exists"
if ! "$KCADM" get clients -r "$REALM" -q clientId="$CLIENT_ID" | grep . >/dev/null; then
  "$KCADM" create clients -r "$REALM" \
    -s clientId="$CLIENT_ID" \
    -s enabled=true \
    -s publicClient=false \
    -s secret="$CLIENT_SECRET" \
    -s directAccessGrantsEnabled=true
fi

echo "   • Fetching client UUID"
CLIENT_UUID=$(
  "$KCADM" get clients -r "$REALM" -q clientId="$CLIENT_ID" \
    -o json | jq -r '.[0].id'
) || CLIENT_UUID=""

if [[ -n "$CLIENT_UUID" && "$CLIENT_UUID" != "null" ]]; then
  echo "   • Configuring redirect URIs & web origins"
  "$KCADM" update clients/"$CLIENT_UUID" -r "$REALM" \
    -s 'redirectUris=["https://localhost:3000/*","http://localhost:3000/*"]' \
    -s 'webOrigins=["https://localhost:3000","http://localhost:3000"]' \
    -s baseUrl="https://localhost:3000" \
    -s adminUrl="https://localhost:3000"
else
  echo "⚠️  Could not look up client UUID for $CLIENT_ID, skipping URL configuration"
fi

echo "📋 Creating realm roles"
for role in admin teacher student; do
  if ! "$KCADM" get roles -r "$REALM" -q name="$role" | grep . >/dev/null; then
    "$KCADM" create roles -r "$REALM" -s name="$role"
  fi
done

echo "👥 Creating test users"
declare -A USERS=(
  [alice]=admin
  [bob]=teacher
  [carol]=student
)
for username in "${!USERS[@]}"; do
  if ! "$KCADM" get users -r "$REALM" -q username="$username" | grep . >/dev/null; then
    "$KCADM" create users -r "$REALM" \
      -s username="$username" \
      -s enabled=true \
      -s email="${username}@example.com" \
      -s emailVerified=true
  fi

  # get user id
  USER_ID=$(
    "$KCADM" get users -r "$REALM" -q username="$username" \
      -o json | jq -r '.[0].id'
  ) || continue

  echo "   • Setting password for $username"
  "$KCADM" set-password -r "$REALM" \
    --userid "$USER_ID" \
    --new-password "${username}Pass123!" \
    --temporary=false

  echo "   • Granting role ${USERS[$username]}"
  "$KCADM" add-roles -r "$REALM" --uid "$USER_ID" \
    --rolename "${USERS[$username]}"
done

echo "✅ setup-keycloak.sh complete"
