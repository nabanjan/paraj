#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo 'Error: missing required inputs.' >&2
  echo 'Usage: ./gen.sh "<prompt_file>" "<whatsapp_number>"' >&2
  exit 1
fi

PROMPT_FILE="$1"
WHATSAPP_NUMBER="$2"

if [ ! -f "${PROMPT_FILE}" ]; then
  echo "Error: prompt file not found: ${PROMPT_FILE}" >&2
  exit 1
fi

if [ ! -r "${PROMPT_FILE}" ]; then
  echo "Error: prompt file is not readable: ${PROMPT_FILE}" >&2
  exit 1
fi

PROMPT_STRING="$(cat "${PROMPT_FILE}")"
PROMPT_STRING_STRIPPED="$(printf '%s' "${PROMPT_STRING}" | tr -d '[:space:]')"

if [ -z "${PROMPT_STRING_STRIPPED}" ]; then
  echo "Error: prompt file content cannot be empty." >&2
  exit 1
fi

if ! [[ "${PROMPT_STRING}" =~ [[:alpha:]] ]]; then
  echo "Error: prompt file content must include text." >&2
  echo 'Usage: ./gen.sh "<prompt_file>" "<whatsapp_number>"' >&2
  exit 1
fi

if [ -z "${WHATSAPP_NUMBER// }" ]; then
  echo "Error: WhatsApp number cannot be empty." >&2
  exit 1
fi

WHATSAPP_NUMBER_NO_SPACES="${WHATSAPP_NUMBER// /}"

if ! [[ "${WHATSAPP_NUMBER_NO_SPACES}" =~ ^\+[0-9]+$ ]]; then
  echo "Error: WhatsApp number must start with '+' and contain digits only." >&2
  echo 'Example: "+919864096534"' >&2
  exit 1
fi

if [ -z "${OPENAI_API_KEY:-}" ] && [ -f "${HOME}/.env" ]; then
  OPENAI_API_KEY_LINE="$(grep -E '^[[:space:]]*OPENAI_API_KEY=' "${HOME}/.env" | tail -n 1 || true)"
  if [ -n "${OPENAI_API_KEY_LINE}" ]; then
    OPENAI_API_KEY_RAW="${OPENAI_API_KEY_LINE#*=}"
    OPENAI_API_KEY_TRIMMED="$(printf '%s' "${OPENAI_API_KEY_RAW}" | sed -E "s/^[[:space:]]+//; s/[[:space:]]+$//")"
    OPENAI_API_KEY_UNQUOTED="${OPENAI_API_KEY_TRIMMED%\"}"
    OPENAI_API_KEY_UNQUOTED="${OPENAI_API_KEY_UNQUOTED#\"}"
    OPENAI_API_KEY_UNQUOTED="${OPENAI_API_KEY_UNQUOTED%\'}"
    OPENAI_API_KEY_UNQUOTED="${OPENAI_API_KEY_UNQUOTED#\'}"
    export OPENAI_API_KEY="${OPENAI_API_KEY_UNQUOTED}"
  fi
fi

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "Error: OPENAI_API_KEY is not set." >&2
  echo 'Set it in ~/.env as OPENAI_API_KEY=... or export it in the shell.' >&2
  exit 1
fi
export REQUIRED_APP_JSX="<button className=\"cta\">Call: ${WHATSAPP_NUMBER_NO_SPACES}</button>"
export REQUIRED_WHATSAPP_NUMBER="${WHATSAPP_NUMBER_NO_SPACES}"

if [ ! -d "node_modules/openai" ]; then
  npm install openai
fi

echo "Generate the site content using the provided prompt and WhatsApp number ..."
node scripts/generate-site.mjs "${PROMPT_STRING}"

PORT="${PORT:-5173}"

if [ ! -f "index.html" ]; then
  cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated Site</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF
fi

if [ ! -f "src/main.jsx" ]; then
  cat > src/main.jsx <<'EOF'
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
fi

if [ ! -d "node_modules/react" ] || [ ! -d "node_modules/react-dom" ]; then
  npm install react react-dom
fi

if ! npx --yes vite --version >/dev/null 2>&1; then
  echo "Vite is not installed. Installing vite..."
  npm install -D vite
fi

npx vite --host 0.0.0.0 --port "${PORT}"
