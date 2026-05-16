"""
UI Template Snapshot Verifier — _template4 v1.0.0
Framework-agnostic. Supports Flask/Jinja2 and React/Vite.

Usage:
  python scripts/verify_ui_snapshot.py              # check all pages
  python scripts/verify_ui_snapshot.py --strict     # exit 1 on any warning

Integration points (add all three — missing any = 0 protection):
  1. .git/hooks/pre-commit  → python scripts/verify_ui_snapshot.py
  2. deploy_py.py           → subprocess.run(["python", "scripts/verify_ui_snapshot.py", "--strict"])
  3. services/self_checker  → periodic check on startup
"""
import argparse
import hashlib
import re
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
TEMPLATES_DIR = PROJECT_ROOT / "templates"
SNAPSHOTS_DIR = PROJECT_ROOT / "docs" / "ui-templates"

# Register pages to verify:
# (page_key, template_filename, snapshot_subdir, framework)
# framework: "flask-jinja2" | "react-vite" | "vue" | "none"
PAGES = [
    # Flask/Jinja2 pages — add your pages here
    # ("job", "job.html", "job", "flask-jinja2"),
]

# LIVE marker regex — supports both Jinja2 {# #} and HTML <!-- --> comments
_LIVE_PATTERN = re.compile(
    r"(?:"
    r"\{#\s*LIVE:\s*(\S+)\s*\|\s*sha256:([0-9a-f]+)\s*#\}"
    r"|"
    r"<!--\s*LIVE:\s*(\S+)\s*\|\s*sha256:([0-9a-f]+)\s*-->"
    r")"
)

errors: list[str] = []
warnings: list[str] = []


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def strip_first_line(content: bytes) -> bytes:
    """Remove the LIVE marker line (first line) before computing sha256."""
    idx = content.find(b"\n")
    if idx == -1:
        return content
    return content[idx + 1:]


def parse_live_marker(first_line: str) -> tuple[str | None, str | None]:
    """Return (version, sha256) from LIVE marker, or (None, None)."""
    m = _LIVE_PATTERN.search(first_line)
    if not m:
        return None, None
    # group 1+2 = Jinja2 match, group 3+4 = HTML match
    version = m.group(1) or m.group(3)
    sha = m.group(2) or m.group(4)
    return version, sha


def verify_flask_page(page_key: str, template_path: Path, snapshot_dir: Path):
    raw = template_path.read_bytes()
    first_line = raw.split(b"\n", 1)[0].decode("utf-8", errors="replace")

    declared_version, declared_sha = parse_live_marker(first_line)
    if not declared_version:
        warnings.append(
            f"[WARN] {page_key}: No LIVE marker in {template_path.name} line 1"
        )
        return

    # 1. Check snapshot exists
    snapshot_path = snapshot_dir / f"{declared_version}_full.html"
    if not snapshot_path.exists():
        errors.append(f"[ERROR] {page_key}: Snapshot missing: {snapshot_path}")
        return

    # 2. Check declared sha256 matches snapshot sha256
    snapshot_sha = sha256_bytes(snapshot_path.read_bytes())
    if snapshot_sha != declared_sha:
        errors.append(
            f"[ERROR] {page_key}: LIVE marker sha256 != snapshot sha256\n"
            f"  marker  : {declared_sha}\n"
            f"  snapshot: {snapshot_sha}"
        )

    # 3. Check template (minus LIVE comment line) matches snapshot
    template_body = strip_first_line(raw)
    template_body_sha = sha256_bytes(template_body)
    if template_body_sha != snapshot_sha:
        errors.append(
            f"[ERROR] {page_key}: DRIFT DETECTED — {template_path.name} was modified "
            f"after snapshot {declared_version} was taken!\n"
            f"  template sha: {template_body_sha}\n"
            f"  snapshot sha: {snapshot_sha}\n"
            f"  → Create {declared_version.rsplit('-', 1)[0]}-UI-{{NNN+1}} snapshot before committing."
        )
    else:
        print(f"[OK] {page_key}: {declared_version} — no drift detected")

    # 4. Check meta.yaml exists
    meta_path = snapshot_dir / f"{declared_version}_meta.yaml"
    if not meta_path.exists():
        warnings.append(f"[WARN] {page_key}: meta.yaml missing for {declared_version}")
    else:
        print(f"[OK] {page_key}: meta.yaml exists")


def verify_react_page(page_key: str, src_dir: Path, snapshot_dir: Path):
    """Stub for React/Vite pages — hash src/pages/*.tsx files."""
    warnings.append(
        f"[WARN] {page_key}: React/Vite verification not fully implemented. "
        f"Manual check required: compare {src_dir} with snapshot in {snapshot_dir}"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--strict", action="store_true", help="Exit 1 on warnings too")
    args = parser.parse_args()

    print("=" * 60)
    print("UI Template Snapshot Verifier v1.0.0")
    print("=" * 60)

    if not PAGES:
        print("[INFO] No pages registered in PAGES list.")
        print("[INFO] Edit scripts/verify_ui_snapshot.py to add your pages.")
        sys.exit(0)

    for page_key, template_name, snapshot_subdir, framework in PAGES:
        snapshot_dir = SNAPSHOTS_DIR / snapshot_subdir

        if not snapshot_dir.exists():
            warnings.append(f"[WARN] {page_key}: snapshot dir not found: {snapshot_dir}")
            continue

        if framework == "flask-jinja2":
            template_path = TEMPLATES_DIR / template_name
            if not template_path.exists():
                warnings.append(f"[WARN] {page_key}: template not found: {template_path}")
                continue
            verify_flask_page(page_key, template_path, snapshot_dir)
        elif framework in ("react-vite", "vue", "next"):
            src_dir = PROJECT_ROOT / "src" / "pages"
            verify_react_page(page_key, src_dir, snapshot_dir)
        else:
            warnings.append(f"[WARN] {page_key}: unknown framework '{framework}', skipping")

    print("\n" + "=" * 60)
    if warnings:
        print(f"WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(w)

    if errors:
        print(f"\nERRORS ({len(errors)}):")
        for e in errors:
            print(e)
        print("\n❌ Verification FAILED")
        sys.exit(1)
    elif args.strict and warnings:
        print("\n❌ Strict mode: warnings treated as errors")
        sys.exit(1)
    else:
        print("\n✅ All checks passed")
        sys.exit(0)


if __name__ == "__main__":
    main()
