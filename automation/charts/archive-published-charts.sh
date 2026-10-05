#!/usr/bin/env bash
#
# Freezes every chart gh-pages has ever served into one GitHub release.
#
# Run once, before the chart index stops pointing at docs.gluu.org. Of the 96 chart versions that
# index holds, only 26 exist as an asset of the matching release tag: every `gluu-all-in-one` build
# is missing, and 42 versions -- the whole 5.0.x line, every `-dev` snapshot, and v6.1.0 -- have no
# release at all. So the index cannot simply be repointed at per-tag assets.
#
# Everything is taken byte-for-byte from gh-pages, which is what the digests in `index.yaml`
# describe. Where a release asset of the same name already exists its bytes differ, because
# `release-upload.yml` packaged the chart directory after downloading the Helm installer into it
# and so shipped `get_helm.sh` inside the tarball. Those published assets are left untouched.
#
#   ./archive-published-charts.sh --dry-run    list what would be uploaded
#   ./archive-published-charts.sh              create the release and upload
#
set -euo pipefail

REPO="${REPO:-GluuFederation/flex}"
TAG="${TAG:-helm-charts-archive}"
SOURCE="${SOURCE:-https://docs.gluu.org/charts}"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

echo "Reading $SOURCE/index.yaml"
curl -fsSL "$SOURCE/index.yaml" -o "$workdir/index.yaml"

# Filenames and their recorded digests, straight from the index.
python3 - "$workdir/index.yaml" > "$workdir/wanted.tsv" <<'PY'
import sys, yaml
index = yaml.safe_load(open(sys.argv[1]))
for name, entries in (index.get("entries") or {}).items():
    for entry in entries:
        print(f"{name}-{entry['version']}.tgz\t{entry.get('digest', '')}")
PY

total=$(wc -l < "$workdir/wanted.tsv" | tr -d ' ')
echo "$total chart versions recorded"

mismatched=0
downloaded=0
: > "$workdir/absent.txt"
while IFS=$'\t' read -r filename digest; do
  for candidate in "$filename" "$filename.sigstore.json"; do
    url="$SOURCE/$candidate"
    if curl -fsSL "$url" -o "$workdir/$candidate" 2>/dev/null; then
      [[ "$candidate" == "$filename" ]] && downloaded=$((downloaded + 1))
    else
      rm -f "$workdir/$candidate"
      [[ "$candidate" == "$filename" ]] && echo "$filename" >> "$workdir/absent.txt"
    fi
  done

  if [[ -n "$digest" && -f "$workdir/$filename" ]]; then
    actual="$(shasum -a 256 "$workdir/$filename" | cut -d' ' -f1)"
    if [[ "$actual" != "${digest#sha256:}" ]]; then
      echo "  digest mismatch on $filename: index says $digest, bytes are $actual"
      mismatched=$((mismatched + 1))
    fi
  fi
done < "$workdir/wanted.tsv"

absent=$(wc -l < "$workdir/absent.txt" | tr -d ' ')
if (( absent > 0 )); then
  echo
  echo "$absent chart(s) are listed in the index but not served, so they cannot be archived:"
  sed 's/^/  /' "$workdir/absent.txt"
  echo "  (these already fail for anyone pinning them; drop them from the index separately)"
  echo
fi

signatures=$(find "$workdir" -name '*.sigstore.json' | wc -l | tr -d ' ')
echo "Downloaded $downloaded chart(s) and $signatures signature bundle(s)"

if (( mismatched > 0 )); then
  echo "::error::$mismatched chart(s) do not match the digest the index records"
  exit 1
fi

if (( DRY_RUN )); then
  echo "Dry run: nothing uploaded. Would create $REPO release $TAG with:"
  find "$workdir" -name 'gluu*' -exec basename {} \; | sort | sed 's/^/  /'
  exit 0
fi

if gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1; then
  echo "Release $TAG already exists; uploading without clobbering published assets"
else
  gh release create "$TAG" --repo "$REPO" --title "Helm chart archive" --notes \
"Every Helm chart version published to https://docs.gluu.org/charts before the charts moved to an
OCI registry, byte-for-byte as that host served it.

These are kept so \`helm repo add gluu https://docs.gluu.org/charts\` keeps resolving for anyone
pinned to an older version. The index's recorded digests describe these bytes.

Current charts are published to their own release tag and to
\`oci://ghcr.io/gluufederation/charts\`. Nothing here is supported; see the version support policy."
fi

# No --clobber: an asset already published is left exactly as it is.
# Only what is not already there, so a re-run is quiet and an upload that genuinely fails --
# authentication, a network error -- is reported rather than mistaken for an existing asset.
gh release view "$TAG" --repo "$REPO" --json assets \
  --jq '.assets[].name' > "$workdir/published.txt"

pending=0
while IFS= read -r path; do
  name="$(basename "$path")"
  if grep -qxF "$name" "$workdir/published.txt"; then continue; fi
  echo "  uploading $name"
  gh release upload "$TAG" "$path" --repo "$REPO"
  pending=$((pending + 1))
done < <(find "$workdir" -name 'gluu*' | sort)

echo "Uploaded $pending asset(s); the rest were already published."
echo "Done. Verify with: gh release view $TAG --repo $REPO"
