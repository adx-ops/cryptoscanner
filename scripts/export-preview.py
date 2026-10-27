#!/usr/bin/env python3
"""Copy dist/ to a preview folder with root-absolute links rewritten as relative, so the
static build can be hosted under a sub-path (used for the Claude artifact preview only).
Usage: python3 scripts/export-preview.py <dist_dir> <out_dir>
"""
import os, re, shutil, sys

src, out = sys.argv[1], sys.argv[2]
if os.path.exists(out):
    shutil.rmtree(out)
shutil.copytree(src, out)

def rewrite(path: str, depth: int, text: str) -> str:
    prefix = '../' * depth if depth else './'
    def fix(m):
        attr, url = m.group(1), m.group(2)
        if url == '/':
            return f'{attr}="{prefix}index.html"'
        p, _, q = url.partition('?')
        p = p.lstrip('/')
        if not p.startswith('_astro') and '.' not in p.split('/')[-1]:
            p += '.html'
        return f'{attr}="{prefix}{p}{"?" + q if q else ""}"'
    text = re.sub(r'(href|src)="(/[^"]*)"', fix, text)
    # links built in scripts
    text = text.replace('`/compare?cards=', '`' + prefix + 'compare.html?cards=')
    text = text.replace('"/compare?cards="', '"' + prefix + 'compare.html?cards="')
    text = text.replace('`/cards/${', '`' + prefix + 'cards/${')
    return text

n = 0
for root, _, files in os.walk(out):
    for f in files:
        if not (f.endswith('.html') or f.endswith('.js')):
            continue
        p = os.path.join(root, f)
        depth = os.path.relpath(p, out).count(os.sep)
        s = open(p, encoding='utf8').read()
        s2 = rewrite(p, depth, s)
        if s2 != s:
            open(p, 'w', encoding='utf8').write(s2)
            n += 1
print(f'export-preview: {n} file(s) rewritten into {out}')
