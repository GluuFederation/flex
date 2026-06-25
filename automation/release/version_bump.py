#!/usr/bin/env python3
"""Flex release version bump + verify.

Rewrites every Flex-owned version from the development sentinels
(``0.0.0-nightly`` / ``0.0.0``) to a release version, in the WORKING TREE only.
``release-trigger.yml`` runs this on a detached HEAD, so ``main`` is never
modified -- the bumped tree exists solely under the release tag. Pushing the
``v**`` tag triggers ``build-packages.yml``, which builds from the tagged tree.

Dual versioning
---------------
Flex ships two kinds of artifacts in one tree:

* Flex's own images / charts / installers, versioned with the FLEX version
  (e.g. ``6.2.0``); and
* upstream Janssen images that Flex re-references, versioned with the JANS
  version. Flex is always +4 majors ahead of Janssen, so the jans version is
  derived as ``(flex_major - 4).minor.patch`` (flex ``6.2.0`` -> jans ``2.2.0``).

The script takes the FLEX version and derives the jans version. Which version a
given ``0.0.0-nightly`` becomes is decided by context:

* an image tag (helm ``tag:``, an ``image: <ref>:0.0.0-nightly`` line, a rancher
  ``image.tag`` default, a Dockerfile base ``ARG``) is mapped by the org of its
  image repository -- ``janssenproject`` -> jans version, ``gluufederation`` ->
  flex version -- and takes the docker suffix (``2.2.0-1`` / ``6.2.0-1``);
* chart package versions (``Chart.yaml`` ``version:`` + dependency pins) take the
  bare flex version;
* a chart's ``appVersion:`` follows that chart's own primary image repository
  (jans image -> jans version, otherwise flex version);
* installer / package versions (``version.py``, ``admin-ui/package.json``,
  the all-in-one ``CN_VERSION``) take the bare flex version;
* every other ``0.0.0-nightly`` references a Flex release and takes the bare flex
  version.

Why two strategies instead of one regex (mirrors the jans script):

* ``0.0.0-nightly`` is globally unique to our artifacts, so it is safe to replace
  as plain text across whole files -- EXCEPT the structured files (``Chart.yaml``,
  ``values.yaml``, rancher ``questions.yaml``) where a single literal can be either
  a suffixed image tag or a bare chart/app version, so those get anchored edits.
  A small EXCLUDE set is skipped entirely (workflow files where the literal is
  control-flow, and CHANGELOG.md history).
* plain ``0.0.0`` also occurs inside unrelated version numbers and lockfiles, so it
  is touched ONLY through anchored edits on known owned fields -- never a blind scan.

``--verify`` re-scans and exits non-zero if any owned dev sentinel was missed, so
the release aborts before a bad tag is pushed. (verify can only confirm the
sentinels are gone -- it cannot check the jans/flex mapping is semantically right,
so the bump logic below is deliberately careful.)
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

NIGHTLY = "0.0.0-nightly"
# shields.io encodes a literal '-' as '--', so chart README badges carry this form
NIGHTLY_BADGE = "0.0.0--nightly"

# Contain "0.0.0-nightly" as control-flow or history, NOT as an owned version.
EXCLUDE_NIGHTLY = {
    ".github/workflows/build-docs.yml",
    ".github/workflows/build-packages.yml",
    ".github/workflows/docker_build_image.yml",
    ".github/workflows/update_janssen_helm_chart.yml",
    "CHANGELOG.md",
}

# Structured files: a single "0.0.0-nightly" in these can be EITHER a suffixed
# image tag OR a bare chart/app version, so they get anchored edits (handled
# explicitly below) and are kept out of the whole-file nightly replace.
STRUCTURED_NIGHTLY = set()  # filled in bump() from the discovered chart files

VERSION_RE = re.compile(r"^\d+\.\d+\.\d+(-[0-9A-Za-z.]+)?$")

ROOT = Path.cwd()
DRY = False

# This script's own repo-relative path. It carries the sentinel strings as source
# (NIGHTLY, "0.0.0", ...), so every grep-driven pass must skip it.
SELF_REL = "automation/release/version_bump.py"


# --------------------------------------------------------------------------- #
# git helpers (tree is a clean checkout in CI, so tracked files == the world)
# --------------------------------------------------------------------------- #
def _git(*args):
    out = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    # git grep exits 1 when there are no matches; that is not an error here
    if out.returncode not in (0, 1):
        raise RuntimeError(f"git {' '.join(args)} failed: {out.stderr.strip()}")
    return [line for line in out.stdout.splitlines() if line]


def grep_files(token):
    # exclude this script: it carries the sentinel literals as source, which the
    # bump/verify passes must never rewrite or flag.
    return [f for f in _git("grep", "-lF", token) if f != SELF_REL]


def ls_files(*globs):
    return _git("ls-files", *globs)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def write(rel, text):
    if not DRY:
        (ROOT / rel).write_text(text, encoding="utf-8")


# --------------------------------------------------------------------------- #
# version mapping
# --------------------------------------------------------------------------- #
def jans_version(flex_version):
    """Derive the jans version from the flex version: (major-4).minor.patch.

    Flex is always +4 majors ahead of Janssen. A pre-release suffix (``-rc1``)
    is preserved. flex_major < 4 has no jans counterpart and is rejected.
    """
    m = re.match(r"^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.]+)?$", flex_version)
    if not m:
        raise SystemExit(f"invalid flex version '{flex_version}' (expected X.Y.Z[-suffix])")
    major, minor, patch, suffix = int(m.group(1)), m.group(2), m.group(3), m.group(4) or ""
    if major < 4:
        raise SystemExit(
            f"flex major version {major} has no Janssen counterpart "
            f"(flex is +4 majors ahead; need major >= 4)"
        )
    return f"{major - 4}.{minor}.{patch}{suffix}"


def repo_org(line):
    """Classify an image repository line by org. Matches both the full flex form
    (ghcr.io/janssenproject/jans/..., ghcr.io/gluufederation/flex/...) and the
    bare rancher form (janssenproject/configurator, gluufederation/casa)."""
    if "janssenproject" in line:
        return "jans"
    if "gluufederation" in line:
        return "flex"
    return None


# --------------------------------------------------------------------------- #
# bump
# --------------------------------------------------------------------------- #
def sub(rel, pattern, repl, flags=0):
    """Apply a single regex substitution to a file; return number of edits."""
    text = read(rel)
    new, n = re.subn(pattern, repl, text, flags=flags)
    if n and new != text:
        write(rel, new)
    return n


def _bump_image_tags_by_preceding_repo(text, flex_tag, jans_tag):
    """Rewrite each ``tag: 0.0.0-nightly`` / ``default: "0.0.0-nightly"`` image-tag
    line using the org of the nearest PRECEDING ``repository:`` (helm values) or
    ``image.repository`` (rancher questions) line in the same file."""
    lines = text.splitlines(keepends=True)
    org = "flex"  # default when no repository precedes (e.g. a leading tag)
    repo_re = re.compile(r"repository:\s*\S")
    # rancher questions.yaml carries the repo as `default: "<org>/..."` under a
    # `- variable: <name>.image.repository` block; track that too.
    var_repo_re = re.compile(r"variable:\s*\S+\.image\.repository")
    default_re = re.compile(r'default:\s*["\']?([^"\'\s]+)')
    tag_re = re.compile(r'(\btag:\s*["\']?)0\.0\.0-nightly')
    qtag_re = re.compile(r'(\bdefault:\s*["\'])0\.0\.0-nightly')
    pending_var_repo = False
    out = []
    for ln in lines:
        if repo_re.search(ln):
            o = repo_org(ln)
            if o:
                org = o
        elif var_repo_re.search(ln):
            pending_var_repo = True
        elif pending_var_repo and default_re.search(ln):
            o = repo_org(default_re.search(ln).group(1))
            if o:
                org = o
            pending_var_repo = False
        tag = jans_tag if org == "jans" else flex_tag
        ln = tag_re.sub(rf"\g<1>{tag}", ln)
        ln = qtag_re.sub(rf"\g<1>{tag}", ln)
        out.append(ln)
    return "".join(out)


def _bump_image_ref_lines(text, flex_tag, jans_tag):
    """Rewrite inline ``<repo>:0.0.0-nightly`` image references (artifacthub
    annotations, compose files) by the org embedded in the reference itself."""
    def repl(m):
        ref = m.group(1)
        tag = jans_tag if repo_org(ref) == "jans" else flex_tag
        return f"{ref}:{tag}"

    return re.sub(r'((?:ghcr\.io/)?(?:janssenproject|gluufederation)/\S*?):0\.0\.0-nightly', repl, text)


def _primary_image_repo(values_text):
    """The chart's primary image is the top-level ``image:`` block (``image:`` at
    column 0 with its ``repository:`` at 2-space indent). all-in-one charts also
    carry nested sub-component images (4-space indent) that must NOT win, so the
    top-level block is preferred; fall back to the first repository otherwise."""
    lines = values_text.splitlines()
    in_top_image = False
    first_repo = None
    for ln in lines:
        if re.match(r"^image:\s*$", ln):
            in_top_image = True
            continue
        m = re.match(r"^(\s*)repository:\s*(\S)", ln)
        if m:
            if first_repo is None:
                first_repo = ln
            if in_top_image and len(m.group(1)) == 2:
                return ln
        elif re.match(r"^\S", ln) and not ln.startswith("image:"):
            in_top_image = False  # left the top-level image: block
    return first_repo


def _chart_app_version(chart_rel, flex_version, jv):
    """appVersion for a chart: follow that chart's own primary image repository
    in the sibling values.yaml. jans image -> jans version; otherwise (flex image,
    or no/ambiguous image) -> flex version."""
    values = str(Path(chart_rel).parent / "values.yaml")
    if (ROOT / values).exists():
        repo = _primary_image_repo(read(values))
        if repo:
            org = repo_org(repo)
            if org == "jans":
                return jv
            if org == "flex":
                return flex_version
    return flex_version


def bump(version, docker_suffix="1"):
    jv = jans_version(version)
    flex_tag = f"{version}-{docker_suffix}"
    jans_tag = f"{jv}-{docker_suffix}"
    changed = []

    chart_files = ls_files("*Chart.yaml")
    values_files = ls_files("*values.yaml")
    # questions.yaml may carry image-tag defaults that follow the repository rule
    questions_files = [f for f in grep_files(NIGHTLY)
                       if Path(f).name == "questions.yaml"]
    STRUCTURED_NIGHTLY.clear()
    STRUCTURED_NIGHTLY.update(chart_files, values_files, questions_files)

    # 1. Chart.yaml -- structured. version + dependency pins -> bare flex; the
    #    artifacthub image annotations -> suffixed image tag by org; appVersion ->
    #    derived from the chart's primary image.
    for rel in chart_files:
        text = read(rel)
        new = text
        # artifacthub.io/images: "image: <ref>:0.0.0-nightly"
        new = _bump_image_ref_lines(new, flex_tag, jans_tag)
        # appVersion (quoted) -> jans or flex per the chart's primary image
        app = _chart_app_version(rel, version, jv)
        new = re.sub(r'(^appVersion:\s*")0\.0\.0-nightly(")',
                     rf"\g<1>{app}\g<2>", new, flags=re.M)
        # chart package version + every dependency `version:` pin -> bare flex
        new = re.sub(r'(^version:\s*)0\.0\.0-nightly', rf"\g<1>{version}", new, flags=re.M)
        new = re.sub(r'(^\s+version:\s*)0\.0\.0-nightly', rf"\g<1>{version}", new, flags=re.M)
        if new != text:
            write(rel, new)
            changed.append(rel)

    # 2. values.yaml -- structured. Only "tag: 0.0.0-nightly" image tags, mapped
    #    by the nearest preceding repository line; suffixed.
    for rel in values_files:
        text = read(rel)
        new = _bump_image_tags_by_preceding_repo(text, flex_tag, jans_tag)
        if new != text:
            write(rel, new)
            changed.append(rel)

    # 3. rancher questions.yaml -- image.tag defaults follow the repository rule.
    for rel in questions_files:
        text = read(rel)
        new = _bump_image_tags_by_preceding_repo(text, flex_tag, jans_tag)
        if new != text:
            write(rel, new)
            changed.append(rel)

    # Dockerfile base-image ARGs are image tags (resolved into a FROM ref), so
    # they take the docker suffix and are mapped by the org they feed:
    # BASE_VERSION -> the janssenproject/jans AIO image (jans tag); FLEX_BASE_VERSION
    # -> the gluufederation/flex images (flex tag). Applied before the bare replace
    # so the generic pass only touches the OCI image.version label (flex bare).
    image_tag_arg_subs = [
        (r'(ARG\s+FLEX_BASE_VERSION=)0\.0\.0-nightly', rf"\g<1>{flex_tag}"),
        (r'(ARG\s+BASE_VERSION=)0\.0\.0-nightly', rf"\g<1>{jans_tag}"),
        # demo scripts: GLUU_VERSION is the flex-all-in-one image tag, so it is suffixed.
        (r'(GLUU_VERSION=["\x27]?)0\.0\.0-nightly', rf"\g<1>{flex_tag}"),
    ]

    # 4. The remaining "0.0.0-nightly" / "0.0.0--nightly" sentinels are Flex-release
    #    references (scripts, READMEs, docs, version.txt, Dockerfile OCI labels) ->
    #    bare flex version, whole-file safe. Structured + excluded files are skipped.
    #    Image refs / base-version ARGs inside these are mapped (suffixed) first.
    for rel in sorted(set(grep_files(NIGHTLY) + grep_files(NIGHTLY_BADGE))):
        if rel in EXCLUDE_NIGHTLY or rel in STRUCTURED_NIGHTLY:
            continue
        text = read(rel)
        new = _bump_image_ref_lines(text, flex_tag, jans_tag)
        for pat, repl in image_tag_arg_subs:
            new = re.sub(pat, repl, new)
        new = new.replace(NIGHTLY, version).replace(NIGHTLY_BADGE, version)
        if new != text:
            write(rel, new)
            changed.append(rel)

    # 5. flex-all-in-one Dockerfile: CN_VERSION (empty) -> bare flex; release-tag
    #    pointers track the flex tag so the download does not 404.
    for rel in grep_files("CN_VERSION="):
        if sub(rel, r"(^ENV\s+CN_VERSION=)$", rf"\g<1>{version}", flags=re.M):
            changed.append(rel)
    for rel in grep_files("CN_RELEASE_TAG=nightly"):
        if sub(rel, r"(CN_RELEASE_TAG=)nightly\b", rf"\g<1>v{version}"):
            changed.append(rel)
    # Flex Dockerfiles that hardcode the release download URL with /nightly.
    for rel in ls_files("*Dockerfile"):
        if "releases/download/nightly" in read(rel):
            if sub(rel, r"(releases/download/)nightly\b", rf"\g<1>v{version}"):
                changed.append(rel)

    # 6. Plain "0.0.0" -- anchored, structured edits on known owned fields only.
    # flex-linux-setup __version__
    for rel in ls_files("*version.py"):
        if sub(rel, r'(__version__\s*=\s*")0\.0\.0(")', rf"\g<1>{version}\g<2>"):
            changed.append(rel)
    # admin-ui top-level package.json "version" (anchored: 2-space indent, not deps)
    pkg = "admin-ui/package.json"
    if (ROOT / pkg).exists():
        if sub(pkg, r'(?m)^(  "version":\s*")0\.0\.0(",?)$', rf"\g<1>{version}\g<2>"):
            changed.append(pkg)

    # flex-linux-setup app_versions: JANS_APP_VERSION -> the mapped jans version and JANS_BUILD
    # emptied, so the installer pulls the jans *release* (not 0.0.0-nightly) at flex release time.
    flex_setup = "flex-linux-setup/flex_linux_setup/flex_setup.py"
    if (ROOT / flex_setup).exists():
        n = sub(flex_setup, r'("JANS_APP_VERSION":\s*")0\.0\.0(")', rf"\g<1>{jv}\g<2>")
        n += sub(flex_setup, r'("JANS_BUILD":\s*")-nightly(")', r"\g<1>\g<2>")
        if n:
            changed.append(flex_setup)

    return sorted(set(changed))


def fetch_jans_source_version(jans_ver):
    """The JANS_SOURCE_VERSION pinned in the jans release Dockerfiles -- so flex builds the
    same jans source the jans release did."""
    import urllib.request
    url = (f"https://raw.githubusercontent.com/JanssenProject/jans/"
           f"v{jans_ver}/docker-jans-all-in-one/Dockerfile")
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            text = resp.read().decode("utf-8")
    except Exception as e:
        raise SystemExit(f"could not fetch jans v{jans_ver} Dockerfile to pin JANS_SOURCE_VERSION: {e}")
    m = re.search(r"JANS_SOURCE_VERSION=([0-9a-f]{40})", text)
    if not m:
        raise SystemExit(f"no JANS_SOURCE_VERSION found in jans v{jans_ver} Dockerfile")
    return m.group(1)


def pin_source_versions(flex_sha, jans_ver):
    """Release mode: pin FLEX_SOURCE_VERSION to the released flex commit and JANS_SOURCE_VERSION
    to the commit the jans release pinned, so each image builds the exact released sources."""
    if not re.fullmatch(r"[0-9a-f]{40}", flex_sha or ""):
        raise SystemExit(f"--flex-source-sha must be a 40-char commit sha, got: {flex_sha!r}")
    jans_sha = fetch_jans_source_version(jans_ver)
    changed = []
    for rel in grep_files("FLEX_SOURCE_VERSION="):
        if sub(rel, r"(FLEX_SOURCE_VERSION=)[0-9a-f]{40}", rf"\g<1>{flex_sha}"):
            changed.append(rel)
    for rel in grep_files("JANS_SOURCE_VERSION="):
        if sub(rel, r"(JANS_SOURCE_VERSION=)[0-9a-f]{40}", rf"\g<1>{jans_sha}"):
            changed.append(rel)

    # Fail closed: after the rewrites, every owned assignment must equal the requested sha. A value
    # the regex could not match (non-40-hex, a branch name, an already-different sha) would otherwise
    # silently ship an image built from stale source. ``${VAR}`` indirections are left alone; skipped
    # under --dry-run, which writes nothing.
    if not DRY:
        stale = []
        for rel in grep_files("FLEX_SOURCE_VERSION="):
            stale += [f"{rel}: FLEX_SOURCE_VERSION={v}"
                      for v in re.findall(r"FLEX_SOURCE_VERSION=(\S+)", read(rel))
                      if not v.startswith("$") and v != flex_sha]
        for rel in grep_files("JANS_SOURCE_VERSION="):
            stale += [f"{rel}: JANS_SOURCE_VERSION={v}"
                      for v in re.findall(r"JANS_SOURCE_VERSION=(\S+)", read(rel))
                      if not v.startswith("$") and v != jans_sha]
        if stale:
            raise SystemExit(
                f"source-version pin incomplete (expected flex={flex_sha} jans={jans_sha}):\n  "
                + "\n  ".join(stale))
    return changed


# --------------------------------------------------------------------------- #
# verify -- the safety net; any leftover owned sentinel fails the release
# --------------------------------------------------------------------------- #
def verify():
    problems = []

    for token in (NIGHTLY, NIGHTLY_BADGE):
        for rel in grep_files(token):
            if rel not in EXCLUDE_NIGHTLY:
                problems.append(f"{rel}: still contains {token}")

    for rel in grep_files("CN_RELEASE_TAG=nightly"):
        problems.append(f"{rel}: CN_RELEASE_TAG still 'nightly'")

    for rel in grep_files("releases/download/nightly"):
        if rel.endswith("Dockerfile"):
            problems.append(f"{rel}: release download URL still points at /nightly")

    for rel in grep_files("CN_VERSION="):
        if re.search(r"(?m)^ENV\s+CN_VERSION=\s*$", read(rel)):
            problems.append(f"{rel}: CN_VERSION is still empty")

    for rel in ls_files("*version.py"):
        if re.search(r'__version__\s*=\s*"0\.0\.0"', read(rel)):
            problems.append(f"{rel}: __version__ still '0.0.0'")

    pkg = "admin-ui/package.json"
    if (ROOT / pkg).exists() and re.search(r'(?m)^  "version":\s*"0\.0\.0"', read(pkg)):
        problems.append(f"{pkg}: top-level version still '0.0.0'")

    flex_setup = "flex-linux-setup/flex_linux_setup/flex_setup.py"
    if (ROOT / flex_setup).exists():
        txt = read(flex_setup)
        if re.search(r'"JANS_APP_VERSION":\s*"0\.0\.0"', txt):
            problems.append(f"{flex_setup}: JANS_APP_VERSION still '0.0.0'")
        if re.search(r'"JANS_BUILD":\s*"-nightly"', txt):
            problems.append(f"{flex_setup}: JANS_BUILD still '-nightly'")

    if problems:
        print("VERSION VERIFY FAILED -- owned versions left at the dev sentinel:\n")
        for p in problems:
            print(f"  - {p}")
        print(f"\n{len(problems)} location(s) not bumped. Refusing to release.")
        return False
    print("Version verify passed: no owned dev-version sentinels remain.")
    return True


# --------------------------------------------------------------------------- #
def main():
    global ROOT, DRY
    ap = argparse.ArgumentParser(description="Bump/verify Flex release versions in the working tree.")
    ap.add_argument("version", help="release version (flex), e.g. 6.2.0")
    ap.add_argument("--verify", action="store_true", help="verify the tree is fully bumped (no writes)")
    ap.add_argument("--dry-run", action="store_true", help="report changes without writing")
    ap.add_argument("--root", type=Path, default=Path.cwd(), help="repo root (default: cwd)")
    ap.add_argument("--docker-suffix", default="1",
                    help="suffix for image tags: '1' -> X.Y.Z-1 (default: 1)")
    ap.add_argument("--flex-source-sha", metavar="SHA",
                    help="release mode: pin FLEX_SOURCE_VERSION to this flex commit and "
                         "JANS_SOURCE_VERSION to the jans release's pinned commit")
    args = ap.parse_args()

    if not VERSION_RE.match(args.version):
        ap.error(f"invalid version '{args.version}' (expected X.Y.Z or X.Y.Z-suffix)")
    if not re.fullmatch(r"[0-9A-Za-z.]+", args.docker_suffix):
        ap.error(f"invalid --docker-suffix '{args.docker_suffix}' (expected alphanumerics and dots)")

    ROOT = args.root.resolve()
    DRY = args.dry_run

    if args.verify:
        sys.exit(0 if verify() else 1)

    changed = bump(args.version, args.docker_suffix)
    if args.flex_source_sha:
        changed = sorted(set(changed + pin_source_versions(args.flex_source_sha, jans_version(args.version))))

    mode = "DRY RUN -- would change" if DRY else "changed"
    jv = jans_version(args.version)
    print(f"{mode} {len(changed)} file(s) -> flex {args.version} / jans {jv}")
    for rel in changed:
        print(f"  {rel}")


if __name__ == "__main__":
    main()
