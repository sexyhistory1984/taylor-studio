#!/usr/bin/env python3
"""Stamp the studio assets with a content hash so caches bust exactly when the site changes.

The version is sha1(assets/studio.css + assets/studio.js)[:10]. It is written into:
  * sw.js                     -> const VERSION = '<hash>'
  * every HTML page outside shop/ that links /assets/studio.css or /assets/studio.js (?v=<hash>)
The offers connector in the backend (avce.marketing.channels.asset_version) uses the same formula, so pages it
renders later carry the same version without running this script. Run it before committing: tools/deploy.sh does.
"""
from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def asset_version(root: Path = ROOT) -> str:
    h = hashlib.sha1()
    for name in ("assets/studio.css", "assets/studio.js"):
        h.update((root / name).read_bytes())
    return h.hexdigest()[:10]


def main() -> int:
    v = asset_version()
    changed = []
    sw = ROOT / "sw.js"
    old = sw.read_text(encoding="utf-8")
    new = re.sub(r"const VERSION = '[^']*'", f"const VERSION = '{v}'", old)
    if new != old:
        sw.write_text(new, encoding="utf-8"); changed.append("sw.js")
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT)
        if rel.parts[0] in ("shop", "tools") or ".git" in rel.parts:
            continue
        txt = p.read_text(encoding="utf-8")
        new = re.sub(r"(/assets/studio\.(?:css|js))\?v=[A-Za-z0-9._-]+", rf"\1?v={v}", txt)
        if new != txt:
            p.write_text(new, encoding="utf-8"); changed.append(str(rel))
    more = " …" if len(changed) > 8 else ""
    print(f"version {v}; updated {len(changed)} file(s)" + (": " + ", ".join(changed[:8]) + more if changed else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
