#!/bin/sh
# Derives the WebP files the site serves from the PNG screenshots (take-shots.js, take-surfaces.js).
# Lossless WebP: UI screenshots compress better losslessly than lossily and text stays pixel-exact.
# Only 800 px (phones) and 2200 px (everything else): an intermediate width came out larger than 2200 px,
# because resampling adds smoothed pixels that compress worse.
# Run from the site root: sh tools/capture/make-webp.sh
set -eu
command -v cwebp >/dev/null 2>&1 || { echo "make-webp: cwebp not found (brew install webp)" >&2; exit 1; }
count=0
for png in assets/session-*.png assets/environments-*.png; do
  [ -f "$png" ] || { echo "make-webp: no screenshots matched ($png)" >&2; exit 1; }
  base=${png%.png}
  cwebp -quiet -lossless -z 9 -resize 800 0 "$png" -o "$base-800.webp"
  cwebp -quiet -lossless -z 9 "$png" -o "$base-2200.webp"
  count=$((count + 1))
done
echo "make-webp: $count screenshots -> $((count * 2)) WebP files"
