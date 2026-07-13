#!/usr/bin/env python3
"""Build-free template system for module pages.

Every page under modules/ shares an identical head + body scaffold + script
list; only the <title>, an optional <meta name="description">, and the
<main class="module-content"> body differ. Editing that boilerplate used to
mean touching 61 files. Now the boilerplate lives once in templates/module.html
and each page's unique parts live in a content partial under content/modules/.

Usage:
    python3 scripts/build-modules.py extract   # modules/*.html -> content partials
    python3 scripts/build-modules.py build     # content partials -> modules/*.html
    python3 scripts/build-modules.py check     # build to memory, diff vs on-disk

The generated modules/*.html are committed so the site stays a pure static
deploy (no build step at serve time). Run `build` after editing the template
or a content partial.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODULES = ROOT / "modules"
CONTENT = ROOT / "content" / "modules"
TEMPLATE = ROOT / "templates" / "module.html"

TITLE_RE = re.compile(r"[ \t]*<title>(.*?)</title>\n", re.S)
META_RE = re.compile(r'\n[ \t]*<meta name="description" content="(.*?)">')
MAIN_RE = re.compile(
    r'<main class="module-content" id="main-content">\n(.*?)\n[ \t]*</main>',
    re.S,
)


def parse(html: str):
    """Return (title, description|None, main_inner) from a module page."""
    title = TITLE_RE.search(html).group(1)
    meta = META_RE.search(html)
    main = MAIN_RE.search(html).group(1)
    return title, (meta.group(1) if meta else None), main


def render(title: str, description, content: str) -> str:
    tmpl = TEMPLATE.read_text()
    meta = f'\n    <meta name="description" content="{description}">' if description else ""
    return (
        tmpl.replace("{{TITLE}}", title)
        .replace("{{META}}", meta)
        .replace("{{CONTENT}}", content)
    )


def iter_pages():
    return sorted(MODULES.rglob("*.html"))


def partial_path(page: pathlib.Path) -> pathlib.Path:
    return CONTENT / page.relative_to(MODULES)


def write_partial(page: pathlib.Path):
    title, description, main = parse(page.read_text())
    fm = [f"title: {title}"]
    if description is not None:
        fm.append(f"description: {description}")
    body = "---\n" + "\n".join(fm) + "\n---\n" + main + "\n"
    out = partial_path(page)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(body)


def read_partial(path: pathlib.Path):
    text = path.read_text()
    m = re.match(r"---\n(.*?)\n---\n(.*)\n", text, re.S)
    fm, content = m.group(1), m.group(2)
    title = re.search(r"^title: (.*)$", fm, re.M).group(1)
    desc_m = re.search(r"^description: (.*)$", fm, re.M)
    return title, (desc_m.group(1) if desc_m else None), content


def cmd_extract():
    for page in iter_pages():
        write_partial(page)
    print(f"Extracted {len(iter_pages())} content partials to {CONTENT}")


def cmd_build():
    partials = sorted(CONTENT.rglob("*.html"))
    for partial in partials:
        title, description, content = read_partial(partial)
        page = MODULES / partial.relative_to(CONTENT)
        page.write_text(render(title, description, content))
    print(f"Built {len(partials)} module pages from {CONTENT}")


def cmd_check():
    partials = sorted(CONTENT.rglob("*.html"))
    mismatched = []
    for partial in partials:
        title, description, content = read_partial(partial)
        page = MODULES / partial.relative_to(CONTENT)
        if page.read_text() != render(title, description, content):
            mismatched.append(str(page.relative_to(ROOT)))
    if mismatched:
        print("Out of sync (run build):")
        for m in mismatched:
            print(f"  {m}")
        sys.exit(1)
    print(f"All {len(partials)} module pages are in sync with their partials")


def main():
    cmds = {"extract": cmd_extract, "build": cmd_build, "check": cmd_check}
    if len(sys.argv) != 2 or sys.argv[1] not in cmds:
        print(__doc__)
        sys.exit(2)
    cmds[sys.argv[1]]()


if __name__ == "__main__":
    main()
