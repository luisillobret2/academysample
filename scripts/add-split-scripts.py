#!/usr/bin/env python3
"""Insert <script> tags for the JS files split out of app.js.

app.js was broken into focused modules (chat, homepage, leaderboard,
cert-recommendations, badges). Every page that loads app.js must load the
new files just before it. Idempotent: skips files already updated.
"""
import pathlib
import re

NEW_FILES = ["chat.js", "homepage.js", "leaderboard.js",
             "cert-recommendations.js", "badges.js"]

ROOT = pathlib.Path(__file__).resolve().parent.parent


def process(path: pathlib.Path) -> bool:
    text = path.read_text()
    m = re.search(r'([ \t]*)<script src="((?:\.\./)*js/)app\.js"></script>', text)
    if not m:
        return False
    if f'{m.group(2)}chat.js' in text:
        return False  # already updated
    indent, jsdir = m.group(1), m.group(2)
    tags = "".join(f'{indent}<script src="{jsdir}{f}"></script>\n'
                   for f in NEW_FILES)
    text = text.replace(m.group(0), tags + m.group(0), 1)
    path.write_text(text)
    return True


def main() -> None:
    changed = 0
    for path in ROOT.rglob("*.html"):
        if "node_modules" in path.parts:
            continue
        if process(path):
            changed += 1
    print(f"Updated {changed} HTML files")


if __name__ == "__main__":
    main()
