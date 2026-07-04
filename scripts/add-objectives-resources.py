#!/usr/bin/env python3
"""Retrofit existing module pages with a Learning Objectives block (derived
from their section headings) and a Resources & Related Labs block.
Idempotent: skips any module that already has a .module-objectives block."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODULES = ROOT / 'modules'

H2_RE = re.compile(r'<h2>(.*?)</h2>', re.DOTALL)
FIRST_SECTION_RE = re.compile(r'([ \t]*)<section class="module-section">')
FOOTER_RE = re.compile(r'([ \t]*)<div class="module-footer">')

SKIP_TITLES = ('knowledge check', 'resources')

RESOURCES_BLOCK = '''<section class="module-section">
                <h2>Resources &amp; Related Labs</h2>
                <div class="module-resources">
                    <a class="module-resource" href="../../labs.html"><span class="resource-icon">&#128187;</span><span>Hands-on Labs<span class="resource-meta">Practice environment</span></span></a>
                    <a class="module-resource" href="../../resources.html"><span class="resource-icon">&#128196;</span><span>Resource Library<span class="resource-meta">Guides &amp; templates</span></span></a>
                    <a class="module-resource" href="../../certifications.html"><span class="resource-icon">&#127942;</span><span>Certifications<span class="resource-meta">Validate your skills</span></span></a>
                </div>
            </section>

'''

changed = []
for path in sorted(MODULES.glob('**/*.html')):
    text = path.read_text(encoding='utf-8')
    if 'module-objectives' in text:
        continue  # already enriched (includes the 12 new modules)

    titles = [t.strip() for t in H2_RE.findall(text)]
    titles = [t for t in titles if not any(s in t.lower() for s in SKIP_TITLES)]
    objectives = titles[:4]
    if not objectives:
        continue

    lis = '\n'.join(f'                    <li>{t}</li>' for t in objectives)
    objectives_block = (
        '<div class="module-objectives">\n'
        '                <h4>&#127919; Learning Objectives</h4>\n'
        '                <p>In this module you will cover:</p>\n'
        '                <ul>\n'
        f'{lis}\n'
        '                </ul>\n'
        '            </div>\n\n            '
    )

    # Insert objectives before the first content section.
    m = FIRST_SECTION_RE.search(text)
    if not m:
        continue
    text = text[:m.start()] + m.group(1) + objectives_block + text[m.start(1) + len(m.group(1)):]

    # Insert resources block before the footer.
    fm = FOOTER_RE.search(text)
    if fm:
        indent = fm.group(1)
        text = text[:fm.start()] + indent + RESOURCES_BLOCK + indent + text[fm.start(1) + len(indent):]

    path.write_text(text, encoding='utf-8')
    changed.append(str(path.relative_to(ROOT)))

print(f'Enriched {len(changed)} modules:')
for c in changed:
    print('  ' + c)
