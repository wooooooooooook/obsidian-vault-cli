#!/usr/bin/env bash
# Runner for obsidian-vault-cli — sets up polyfill, path-loader, and env
set -euo pipefail
cd "$(dirname "$0")"

# Read config from obsidian-livesync config
CONF="$HOME/.config/obsidian-livesync/config.json"
if [ -f "$CONF" ]; then
  export COUCHDB_URL="${COUCHDB_URL:-$(python3 -c "import json;print(json.load(open('$CONF'))['dbUrl'])")}"
  export COUCHDB_USER="${COUCHDB_USER:-$(python3 -c "import json;print(json.load(open('$CONF'))['dbUser'])")}"
  export COUCHDB_PASSWORD="${COUCHDB_PASSWORD:-$(python3 -c "import json;print(json.load(open('$CONF'))['dbPass'])")}"
  export DB_NAME="${DB_NAME:-$(python3 -c "import json;print(json.load(open('$CONF'))['dbName'])")}"
fi

: "${COUCHDB_USER:?COUCHDB_USER not set}"
: "${COUCHDB_PASSWORD:?COUCHDB_PASSWORD not set}"
: "${DB_NAME:?DB_NAME not set}"
: "${COUCHDB_URL:=http://127.0.0.1:5984}"

exec node \
  --import ./polyfill.mjs \
  --import tsx/esm \
  --import 'data:text/javascript,import{register}from"node:module";import{pathToFileURL}from"node:url";register("./path-loader.mjs",pathToFileURL("./"));' \
  src/index.ts "$@"
