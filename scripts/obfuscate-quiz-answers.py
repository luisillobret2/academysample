#!/usr/bin/env python3
"""Replace plaintext quiz answer keys with base64-encoded attributes.

Turns data-correct="b" into data-c="Yg==" across all module pages so the
answer is not trivially readable in the DOM. Not cryptographically secure
(client-side only), but removes the obvious plaintext leak. Idempotent:
skips attributes already converted. module.js decodes data-c at runtime.
"""
import base64
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

pattern = re.compile(r'data-correct="([a-dA-D])"')


def encode(m):
    return f'data-c="{base64.b64encode(m.group(1).encode()).decode()}"'


def main():
    changed = 0
    for path in glob.glob(os.path.join(ROOT, "modules", "**", "*.html"), recursive=True):
        with open(path, encoding="utf-8") as f:
            src = f.read()
        new = pattern.sub(encode, src)
        if new != src:
            with open(path, "w", encoding="utf-8") as f:
                f.write(new)
            changed += 1
            print(f"updated {os.path.relpath(path, ROOT)}")
    print(f"done: {changed} file(s) updated")


if __name__ == "__main__":
    main()
