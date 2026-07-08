#!/usr/bin/env python3
"""Inject favicon links into every HTML page and SEO meta (Open Graph, Twitter
Card, canonical) into top-level pages. Idempotent: re-running makes no changes.

No build step: the tags are written directly into the static HTML <head>.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://luisillobret2.github.io/academysample"

FAVICON_MARK = "<!-- favicon -->"
SEO_MARK = "<!-- seo -->"

# Short descriptions for the top-level pages (fallback derived from <title>).
DESCRIPTIONS = {
    "index.html": "Mend Learn is the Mend.io partner learning platform: guided tracks, hands-on labs, certifications, and gamified progress for application security.",
    "learning-paths.html": "Browse 12 curated learning tracks across SCA, SAST, secrets, containers, supply chain, and more on the Mend.io partner academy.",
    "certifications.html": "Earn Mend.io partner certifications by completing tracks and passing assessments. Track your progress and download certificates.",
    "labs.html": "Practice application security skills in hands-on Mend.io lab environments covering scanning, remediation, and platform workflows.",
    "resources.html": "Battlecards, competitive analysis, datasheets, and reference material for Mend.io partners.",
    "leaderboard.html": "See how you rank against other Mend.io partners. Compete for top spots and earn quarterly challenge rewards.",
    "ai-coach.html": "Ask the Mend Learn AI Coach for guidance on tracks, certifications, and application security concepts.",
    "profile.html": "Your Mend Learn profile: XP, level, badges, streaks, saved modules, and a downloadable progress transcript.",
    "certifications.html": "Earn Mend.io partner certifications by completing tracks and passing assessments.",
}
DEFAULT_DESC = DESCRIPTIONS["index.html"]


def favicon_block(prefix: str) -> str:
    return (
        f'    {FAVICON_MARK}\n'
        f'    <link rel="icon" type="image/svg+xml" href="{prefix}img/mend-logo.svg">\n'
        f'    <link rel="icon" type="image/png" href="{prefix}img/mend-logo.png">\n'
        f'    <link rel="apple-touch-icon" href="{prefix}img/mend-logo.png">\n'
        f'    <meta name="theme-color" content="#073C8C">\n'
    )


def seo_block(page: str, title: str) -> str:
    desc = DESCRIPTIONS.get(page, DEFAULT_DESC)
    url = f"{BASE_URL}/{page}"
    image = f"{BASE_URL}/img/mend-logo.png"
    return (
        f'    {SEO_MARK}\n'
        f'    <meta name="description" content="{desc}">\n'
        f'    <link rel="canonical" href="{url}">\n'
        f'    <meta property="og:type" content="website">\n'
        f'    <meta property="og:site_name" content="Mend Learn">\n'
        f'    <meta property="og:title" content="{title}">\n'
        f'    <meta property="og:description" content="{desc}">\n'
        f'    <meta property="og:url" content="{url}">\n'
        f'    <meta property="og:image" content="{image}">\n'
        f'    <meta name="twitter:card" content="summary_large_image">\n'
        f'    <meta name="twitter:title" content="{title}">\n'
        f'    <meta name="twitter:description" content="{desc}">\n'
        f'    <meta name="twitter:image" content="{image}">\n'
    )


VIEWPORT_RE = re.compile(r'(\n[ \t]*<meta name="viewport"[^>]*>\n)')
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.DOTALL)


def process(path: Path, prefix: str, top_level: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    changed = False

    m = VIEWPORT_RE.search(text)
    if not m:
        print(f"  ! no viewport meta in {path}")
        return False
    insert_at = m.end()

    additions = ""
    if FAVICON_MARK not in text:
        additions += favicon_block(prefix)
    if top_level and SEO_MARK not in text:
        tm = TITLE_RE.search(text)
        title = tm.group(1).strip() if tm else "Mend Learn"
        title = re.sub(r"\s+", " ", title)
        additions += seo_block(path.name, title)

    if additions:
        text = text[:insert_at] + additions + text[insert_at:]
        path.write_text(text, encoding="utf-8")
        changed = True
    return changed


def main() -> None:
    count = 0
    for path in sorted(ROOT.glob("*.html")):
        if process(path, "", top_level=True):
            count += 1
            print(f"updated {path.relative_to(ROOT)}")
    for path in sorted(ROOT.glob("modules/**/*.html")):
        if process(path, "../../", top_level=False):
            count += 1
            print(f"updated {path.relative_to(ROOT)}")
    print(f"\nDone. {count} file(s) updated.")


if __name__ == "__main__":
    main()
