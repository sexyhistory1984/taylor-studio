#!/usr/bin/env python3
"""Re-render every published offer page and the offers index with the studio shell from the backend connector.

Why: pages under offers/ are written by the TradeUp backend (avce.marketing.channels). When the shell changes, pages
that were published earlier keep the old shell until they are re-rendered here. This script parses each existing page
for its content fragments (title, description, JSON-LD, kind, heading, lead, price, CTAs, body, deliverable, FAQ) and
hands them to ``render_offer_shell`` so the result is byte-for-byte what the connector would render today.

Run with the backend's interpreter so the connector imports:
    ~/tradeup/backend/.venv/bin/python tools/rewrap_offers.py [--dry-run]
"""
from __future__ import annotations

import json
import re
import sys
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKEND = Path.home() / "tradeup" / "backend"
sys.path.insert(0, str(BACKEND))

from avce.marketing.channels import render_offer_shell, render_offers_index, website_config  # noqa: E402

TEXT = re.compile(r"<[^>]+>")


def text(fragment: str) -> str:
    return unescape(TEXT.sub("", fragment or "")).strip()


def grab(pattern: str, src: str, flags: int = re.S) -> str:
    m = re.search(pattern, src, flags)
    return m.group(1) if m else ""


def parse(src: str) -> dict | None:
    if 'class="offer-body"' not in src:
        return None
    page_title = text(grab(r"<title>(.*?)</title>", src))
    meta = unescape(grab(r'<meta name="description" content="(.*?)"', src))
    url = unescape(grab(r'<link rel="canonical" href="(.*?)"', src))
    ld_raw = grab(r'<script type="application/ld\+json">(.*?)</script>', src)
    try:
        ld = json.loads(ld_raw) if ld_raw else None
    except ValueError:
        ld = None
    eyebrow = text(grab(r'<p class="eyebrow">(.*?)</p>', src))
    kind_label = eyebrow.split("·")[0].strip() or "Service"
    h1 = text(grab(r"<h1>(.*?)</h1>", src))
    lead = text(grab(r'<p class="lead">(.*?)</p>', src))
    price_txt = text(grab(r'(?:<div class="offer-price">|<p class="offer-price">(?:<span class="from">.*?</span>)?)(.*?)</(?:div|p)>', src)) or "Quote on request"
    buy_url = buy_label = ""
    m = re.search(r'<a class="btn[^"]*" href="(?!mailto:)([^"]+)"[^>]*>(.*?)</a>', src, re.S)
    if m:
        buy_url, buy_label = unescape(m.group(1)), text(m.group(2))
    mailto = grab(r'<a class="btn[^"]*" href="(mailto:[^"]+)"', src)
    code = grab(r"Request this \(([A-Z0-9-]+)\)", src)
    body = grab(r'<div class="offer-body">(.*?)</div>\s*(?:<section|<p class="offer-note"|<aside|</article)', src)
    # Older pages rendered single-asterisk emphasis literally; the connector now emits <em>.
    body = re.sub(r"<p>\*([^*<]+?)\*</p>", r"<p><em>\1</em></p>", body)
    deliverable = grab(r"<section><h2>What you receive</h2>(.*?)</section>", src)
    faq = grab(r'(<section class="offer-faq">.*?</section>)', src)
    if not (h1 and url):
        return None
    return dict(page_title=page_title or h1, meta=meta or lead or h1, url=url, ld=ld, kind_label=kind_label, h1=h1,
                lead=lead, price_txt=price_txt, buy_url=buy_url, buy_label=buy_label, mailto=mailto, code=code,
                body_html=body.strip(), deliverable_html=deliverable.strip(), faq_html=faq)


def main() -> int:
    dry = "--dry-run" in sys.argv
    cfg = website_config(None)
    cfg["repo_path"] = str(ROOT)
    pages_dir = ROOT / cfg["pages_dir"]
    done = skipped = 0
    kinds: dict[str, str] = {}
    for page in sorted(pages_dir.glob("*/index.html")):
        parts = parse(page.read_text(encoding="utf-8"))
        if not parts:
            skipped += 1
            print(f"skip  {page.parent.name} (could not parse)")
            continue
        html = render_offer_shell(cfg, **parts)
        if not dry:
            page.write_text(html, encoding="utf-8")
        kinds[page.parent.name] = parts["kind_label"].lower()
        done += 1
    manifest = pages_dir / "offers.json"
    entries = json.loads(manifest.read_text(encoding="utf-8")) if manifest.exists() else []
    for e in entries:  # older entries have no kind; take it from the page's own label
        if not e.get("kind") and kinds.get(e.get("slug", "")) in ("product", "note", "service"):
            e["kind"] = kinds[e["slug"]]
    if not dry:
        manifest.write_text(json.dumps(entries, indent=1), encoding="utf-8")
    if not dry:
        (pages_dir / "index.html").write_text(render_offers_index(entries, cfg), encoding="utf-8")
    print(f"rewrapped {done} page(s), skipped {skipped}, index regenerated with {len(entries)} entries" + (" (dry run)" if dry else ""))
    return 0 if not skipped else 1


if __name__ == "__main__":
    sys.exit(main())
