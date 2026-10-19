#!/bin/zsh
# The daily treatise update.
#
# This is the file to run. From the website project:
#   npm run sync-treatise
#
# It reads today's files in the Google Drive treatise folder and updates the
# site database. Chapter pages then show the new date and text on the next visit.
# macOS runs this file at 07:15 and 19:15. The log is
# ~/Library/Logs/bettermetrics-treatise-sync.log
set -euo pipefail

cd "/Users/yuleguttenbeil/Better Metrics Codebase/bettermetrics"
export PATH="/opt/homebrew/bin:/usr/bin:/bin"

LOG="${HOME}/Library/Logs/bettermetrics-treatise-sync.log"
mkdir -p "${HOME}/Library/Logs"

{
  echo "----- $(date '+%Y-%m-%d %H:%M:%S %Z') -----"
  ./node_modules/.bin/tsx scripts/sync-treatise-chapters.ts
} >> "$LOG" 2>&1
