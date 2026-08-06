#!/usr/bin/env python3
"""One-shot migration: rewrite legacy `--sx-*` token references to the new
Figma-aligned semantic token names across the component source.

Single-pass, whole-token lookup (no cascading rewrites). Skips the token
DEFINITIONS file (src/styles/tokens.css). Run from repo root:
    python3 scripts/migrate-tokens.py
"""
import glob
import re

# legacy token  ->  Figma-aligned semantic token
MAP = {
    # text / foreground
    "--sx-fg": "--sx-text-primary",
    "--sx-fg-1": "--sx-text-primary",
    "--sx-fg-2": "--sx-text-secondary",
    "--sx-fg-3": "--sx-text-secondary",
    "--sx-fg-4": "--sx-disabled-on-surface",
    "--sx-fg-inverse": "--sx-text-inverse",
    # background / surface
    "--sx-bg": "--sx-surface",
    "--sx-bg-subtle": "--sx-surface-secondary",
    "--sx-bg-muted": "--sx-surface-secondary",
    "--sx-bg-success": "--sx-status-surface-positive",
    # lines / borders
    "--sx-line": "--sx-border",
    "--sx-line-strong": "--sx-border",
    "--sx-line-soft": "--sx-border",
    # brand
    "--sx-vibrant-green": "--sx-primary",
    "--sx-secure-teal": "--sx-interactive-active",
    "--sx-deep-ivy": "--sx-text-primary",
    "--sx-mint": "--sx-brand-seamless-mint",
    "--sx-gold": "--sx-brand-wealthy-gold",
    "--sx-blue": "--sx-brand-credible-blue",
    "--sx-grey": "--sx-border",
    "--sx-light-grey": "--sx-surface-disabled",
    "--sx-xsgd": "--sx-brand-xsgd",
    "--sx-xidr": "--sx-brand-xidr",
    "--sx-xusd": "--sx-brand-xusd",
    # status / feedback (git invented -border/-neutral; map to Figma Status/*)
    "--sx-positive": "--sx-status-positive",
    "--sx-positive-soft": "--sx-status-surface-positive",
    "--sx-positive-border": "--sx-status-positive",
    "--sx-critical": "--sx-status-critical",
    "--sx-critical-soft": "--sx-status-surface-critical",
    "--sx-critical-border": "--sx-status-critical",
    "--sx-warning": "--sx-status-warning",
    "--sx-warning-soft": "--sx-status-surface-warning",
    "--sx-warning-border": "--sx-status-warning",
    "--sx-information": "--sx-status-information",
    "--sx-information-soft": "--sx-status-surface-information",
    "--sx-information-border": "--sx-status-information",
    "--sx-neutral": "--sx-text-primary",
    "--sx-neutral-soft": "--sx-surface-secondary",
    "--sx-neutral-border": "--sx-border",
    # radius
    "--sx-radius-card": "--sx-radius-md",
    "--sx-radius-control": "--sx-radius-lg",
    # typography (legacy short -> full size names)
    "--sx-display-l": "--sx-display-large",
    "--sx-display-m": "--sx-display-medium",
    "--sx-display-s": "--sx-display-small",
    "--sx-headline-l": "--sx-headline-large",
    "--sx-headline-m": "--sx-headline-medium",
    "--sx-headline-s": "--sx-headline-small",
    "--sx-title-l": "--sx-title-large",
    "--sx-title-m": "--sx-title-medium",
    "--sx-title-s": "--sx-title-small",
    "--sx-label-l-hk": "--sx-body-bold-large",
    "--sx-label-m-hk": "--sx-body-bold-medium",
    "--sx-label-s-hk": "--sx-body-bold-small",
    "--sx-label-l": "--sx-label-large",
    "--sx-label-m": "--sx-label-medium",
    "--sx-label-s": "--sx-label-small",
    "--sx-body-l": "--sx-body-large",
    "--sx-body-m": "--sx-body-medium",
    "--sx-body-s": "--sx-body-small",
}

TOKEN_RE = re.compile(r"--sx-[a-z0-9-]+")
SKIP = {"src/styles/tokens.css"}

def main():
    files = []
    for pat in ("src/**/*.css", "src/**/*.jsx", "src/**/*.js"):
        files += glob.glob(pat, recursive=True)
    total = 0
    for path in sorted(set(files)):
        if path.replace("\\", "/") in SKIP:
            continue
        src = open(path).read()
        n = [0]
        def repl(m):
            tok = m.group(0)
            if tok in MAP:
                n[0] += 1
                return MAP[tok]
            return tok
        out = TOKEN_RE.sub(repl, src)
        if n[0]:
            open(path, "w").write(out)
            total += n[0]
            print(f"  {n[0]:3d}  {path}")
    print(f"\nTotal replacements: {total}")

if __name__ == "__main__":
    main()
