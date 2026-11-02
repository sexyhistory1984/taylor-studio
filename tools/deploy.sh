#!/bin/sh
# Stamp asset versions, commit everything in the website repo and push to GitHub Pages.
# Usage: tools/deploy.sh "commit message"
set -eu
cd "$(dirname "$0")/.."
python3 tools/stamp.py
git add -A
if git diff --cached --quiet; then echo "nothing to deploy"; exit 0; fi
git -c user.name="Taylor Caldwell" -c user.email="tarthwell@gmail.com" commit -q -m "${1:-Site update}" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push origin main
echo "pushed; GitHub Pages redeploys in about a minute: https://taylor.famemaker.app/"
