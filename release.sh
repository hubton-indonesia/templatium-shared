#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

# === USAGE ===
# Human:  ./release.sh 0.0.1
# AI:     ./release.sh --commit 0.0.1   (stages all, commits, then releases)

AUTO_COMMIT=false

while [ $# -gt 0 ]; do
    case "$1" in
        --commit)
            AUTO_COMMIT=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--commit] [<version>]"
            echo ""
            echo "  --commit    Auto-stage all changes and commit (AI agent mode)"
            echo "  <version>   Set package.json version before releasing"
            exit 0
            ;;
        *)
            break
            ;;
    esac
done

# Accept version arg, update package.json
if [ $# -ge 1 ]; then
    NEW_VERSION="$1"
    jq --arg v "$NEW_VERSION" '.version = $v' "$DIR/package.json" > "$DIR/package.json.tmp"
    mv "$DIR/package.json.tmp" "$DIR/package.json"
    echo "→ Version set to $NEW_VERSION"
fi

VERSION="$(jq -r '.version' "$DIR/package.json")"
RELEASE_TAG="v$VERSION"

echo "→ Releasing $RELEASE_TAG"

# === AI agent: stage & commit dirty tree ===
if [ "$AUTO_COMMIT" = "true" ] && [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "release: $RELEASE_TAG"
    echo "→ Staged and committed all changes"
fi

# === Version check: ensure new version > latest v* tag ===
git fetch --tags origin 2>/dev/null || true
LATEST_TAG=$(git tag -l 'v*' --sort=-v:refname | head -1 2>/dev/null || true)
if [ -n "$LATEST_TAG" ]; then
    LATEST_VER="${LATEST_TAG#v}"
    HIGHEST=$(printf '%s\n' "$LATEST_VER" "$VERSION" | sort -t. -k1,1n -k2,2n -k3,3n | tail -n1)
    if [ "$HIGHEST" != "$VERSION" ] || [ "$VERSION" = "$LATEST_VER" ]; then
        echo "Error: new version $VERSION must be > latest release version $LATEST_VER"
        exit 1
    fi
fi

# === Branch check ===
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo "Must be on main branch (currently on $BRANCH)"
    exit 1
fi

# === Clean tree check ===
if [ -n "$(git status --porcelain)" ]; then
    echo "Working tree is not clean. Use --commit flag or commit manually."
    exit 1
fi

# === Publish ===
git tag "$RELEASE_TAG"
git push origin "$RELEASE_TAG"

gh release create "$RELEASE_TAG" --title "$RELEASE_TAG" --notes ""
