#!/usr/bin/env python3
"""One-off migration: replace duplicated header/footer markup in every page
with layout mounts and load js/layout.js. Idempotent and safe to re-run."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

HEADER_RE = re.compile(r'<header class="site-header">.*?</header>', re.DOTALL)
FOOTER_RE = re.compile(r'<footer class="site-footer">.*?</footer>', re.DOTALL)

HEADER_MOUNT = '<header id="site-header" class="site-header"></header>'
FOOTER_MOUNT = '<footer id="site-footer" class="site-footer"></footer>'

files = list(ROOT.glob('*.html')) + list(ROOT.glob('modules/**/*.html'))
changed = []

for path in files:
    text = path.read_text(encoding='utf-8')
    original = text
    in_module = 'modules/' in str(path.relative_to(ROOT))
    prefix = '../../' if in_module else ''

    if 'id="site-header"' not in text:
        text = HEADER_RE.sub(HEADER_MOUNT, text, count=1)
    if 'id="site-footer"' not in text:
        text = FOOTER_RE.sub(FOOTER_MOUNT, text, count=1)

    # Load layout.js just before the first store.js script tag.
    if 'js/layout.js' not in text:
        store_re = re.compile(r'([ \t]*)(<script src="[^"]*js/store\.js"></script>)')
        m = store_re.search(text)
        if m:
            indent = m.group(1)
            layout_tag = f'{indent}<script src="{prefix}js/layout.js"></script>\n{indent}{m.group(2)}'
            text = text[:m.start()] + layout_tag + text[m.end():]

    if text != original:
        path.write_text(text, encoding='utf-8')
        changed.append(str(path.relative_to(ROOT)))

print(f'Processed {len(files)} files, changed {len(changed)}:')
for c in sorted(changed):
    print('  ' + c)
