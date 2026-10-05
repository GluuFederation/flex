#!/usr/bin/env python3
"""Point the Helm repo index at GitHub release assets.

The chart binaries no longer live on the gh-pages branch, only this index does.
Each entry keeps the metadata and digest Helm already recorded for it and gets
its ``urls`` rewritten to the release asset holding that version, so
``helm repo add gluu https://docs.gluu.org/charts`` keeps resolving.

``helm repo index --url`` cannot do this: it stamps one base URL on every entry,
while each chart version is an asset of its own release tag.

Two differences from the Janssen original this was ported from:

* Versions published before the cutover point at one frozen archive release
  rather than at their own tag. Of the 96 chart versions this index held, only
  26 existed as an asset of the matching tag: every ``gluu-all-in-one`` build
  was missing, and 42 versions -- the whole 5.0.x line, every ``-dev`` snapshot,
  and v6.1.0 -- have no GitHub release at all.
* ``--verify-digest`` downloads each asset and compares its SHA-256 against the
  digest the index already records. A HEAD request is not enough here: where a
  gh-pages blob and a release asset both existed, their bytes differed, because
  ``release-upload.yml`` packaged the chart directory after downloading the Helm
  installer into it and so shipped ``get_helm.sh`` inside the tarball.
"""

from __future__ import annotations

import argparse
import hashlib
import subprocess
import sys
from pathlib import Path

import yaml

ASSET_URL = "https://github.com/{repo}/releases/download/{tag}/{filename}"

def release_tag(version: str) -> str:
    return "nightly" if version.endswith("-nightly") else f"v{version}"

def version_key(version: str) -> tuple[int, ...]:
    """Numeric ordering, so 5.16.0 sorts above 5.9.0 and a suffix sorts below."""
    head = version.split("-", 1)[0]
    parts = tuple(int(part) for part in head.split(".") if part.isdigit())
    return (*parts, 0 if "-" in version else 1)

def is_archived(version: str, cutover: str | None) -> bool:
    """Whether this version predates the cutover and lives in the archive release."""
    if not cutover:
        return False
    return version_key(version) < version_key(cutover)

def merge_new_charts(index: Path, chart_dir: Path) -> Path:
    subprocess.run(
        ["helm", "repo", "index", str(chart_dir), "--merge", str(index)],
        check=True,
    )
    return chart_dir / "index.yaml"

def rewrite_urls(
    index: dict, repo: str, archive_tag: str | None, cutover: str | None
) -> list[tuple[str, str]]:
    """Returns (url, digest) per entry, so a caller can verify the bytes."""
    rewritten = []
    for name, entries in (index.get("entries") or {}).items():
        for entry in entries:
            version = entry["version"]
            filename = f"{name}-{version}.tgz"
            tag = (
                archive_tag
                if archive_tag and is_archived(version, cutover)
                else release_tag(version)
            )
            url = ASSET_URL.format(repo=repo, tag=tag, filename=filename)
            entry["urls"] = [url]
            rewritten.append((url, entry.get("digest", "")))
    return rewritten

def mismatched_digests(entries: list[tuple[str, str]]) -> list[str]:
    """Download each asset and compare its SHA-256 against the recorded digest.

    An index whose digest does not describe the blob it points at is worse than
    one pointing nowhere: Helm reports a corrupt chart rather than a missing one.
    """
    problems = []
    for url, digest in entries:
        if not digest:
            problems.append(f"no digest recorded {url}")
            continue
        result = subprocess.run(
            ["curl", "-sSL", url], check=False, capture_output=True,
        )
        if result.returncode != 0:
            problems.append(f"curl exit {result.returncode} {url}")
            continue
        actual = hashlib.sha256(result.stdout).hexdigest()
        if actual != digest.removeprefix("sha256:"):
            problems.append(f"digest {digest} but asset is {actual} {url}")
    return problems

def missing_assets(urls: list[str]) -> list[str]:
    missing = []
    for url in urls:
        result = subprocess.run(
            ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}",
             "-L", "--head", url],
            check=False, text=True, capture_output=True,
        )
        if result.returncode != 0:
            missing.append(f"curl exit {result.returncode} {url}")
        elif result.stdout.strip() != "200":
            missing.append(f"{result.stdout.strip()} {url}")
    return missing

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--index", required=True,
                        help="existing charts/index.yaml to rewrite")
    parser.add_argument("--add", type=Path,
                        help="directory of freshly packaged .tgz to merge in first")
    parser.add_argument("--repo", default="GluuFederation/flex")
    parser.add_argument(
        "--archive-tag",
        help="release holding every chart published before --cutover-version",
    )
    parser.add_argument(
        "--cutover-version",
        help="first version published as an asset of its own release tag",
    )
    parser.add_argument("--output", help="defaults to --index, rewritten in place")
    parser.add_argument("--verify", action="store_true",
                        help="check every rewritten URL resolves before writing")
    parser.add_argument(
        "--verify-digest",
        action="store_true",
        help="download every asset and check its SHA-256 against the index",
    )
    args = parser.parse_args()

    index_path = Path(args.index)
    if args.add:
        index_path = merge_new_charts(index_path, args.add)

    index = yaml.safe_load(index_path.read_text(encoding="utf-8"))
    entries = rewrite_urls(index, args.repo, args.archive_tag, args.cutover_version)
    urls = [url for url, _ in entries]

    if args.verify:
        missing = missing_assets(urls)
        if missing:
            print("Assets not reachable:", file=sys.stderr)
            for line in missing:
                print(f"  {line}", file=sys.stderr)
            return 1

    if args.verify_digest:
        problems = mismatched_digests(entries)
        if problems:
            print("Assets do not match the digests the index records:", file=sys.stderr)
            for line in problems:
                print(f"  {line}", file=sys.stderr)
            return 1

    output = Path(args.output or args.index)
    output.write_text(
        yaml.safe_dump(index, default_flow_style=False, sort_keys=True,
                       width=10000),
        encoding="utf-8",
    )
    print(f"Rewrote {len(urls)} chart URLs into {output}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
