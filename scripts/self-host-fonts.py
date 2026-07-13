#!/usr/bin/env python3
"""Replace the Google Fonts CDN <link>s with the self-hosted css/fonts.css.

Removes the preconnect + stylesheet pair that loads Poppins from
fonts.googleapis.com on every page and points at the local font CSS instead
(path prefixed with ../../ for nested module pages). Idempotent.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent

PRECONNECT = re.compile(
    r'[ \t]*<link rel="preconnect" href="https://fonts\.googleapis\.com">\n'
    r'[ \t]*<link href="https://fonts\.googleapis\.com/css2\?family=Poppins[^"]*" rel="stylesheet">\n'
)


def process(path: pathlib.Path) -> bool:
    text = path.read_text()
    m = PRECONNECT.search(text)
    if not m:
        return False
    indent = re.match(r'[ \t]*', m.group(0)).group(0)
    prefix = '../../' if '/modules/' in path.as_posix() else ''
    replacement = f'{indent}<link rel="stylesheet" href="{prefix}css/fonts.css">\n'
    path.write_text(text.replace(m.group(0), replacement, 1))
    return True


def main() -> None:
    changed = sum(
        process(p)
        for p in ROOT.rglob("*.html")
        if "node_modules" not in p.parts
    )
    print(f"Updated {changed} HTML files")


if __name__ == "__main__":
    main()
