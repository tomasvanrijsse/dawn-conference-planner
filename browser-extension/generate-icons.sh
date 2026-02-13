#!/bin/bash

# Generate PNG icons from SVG for Chrome extension
# Requires: inkscape or imagemagick

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SVG_FILE="$SCRIPT_DIR/icon.svg"

# Check if inkscape is available (preferred)
if command -v inkscape &> /dev/null; then
    echo "Using Inkscape to generate icons..."
    inkscape "$SVG_FILE" --export-filename="$SCRIPT_DIR/icon16.png" -w 16 -h 16
    inkscape "$SVG_FILE" --export-filename="$SCRIPT_DIR/icon48.png" -w 48 -h 48
    inkscape "$SVG_FILE" --export-filename="$SCRIPT_DIR/icon128.png" -w 128 -h 128
    echo "✅ Icons generated successfully!"

# Check if imagemagick is available (alternative)
elif command -v convert &> /dev/null; then
    echo "Using ImageMagick to generate icons..."
    convert "$SVG_FILE" -resize 16x16 "$SCRIPT_DIR/icon16.png"
    convert "$SVG_FILE" -resize 48x48 "$SCRIPT_DIR/icon48.png"
    convert "$SVG_FILE" -resize 128x128 "$SCRIPT_DIR/icon128.png"
    echo "✅ Icons generated successfully!"

# Check if rsvg-convert is available (alternative)
elif command -v rsvg-convert &> /dev/null; then
    echo "Using rsvg-convert to generate icons..."
    rsvg-convert -w 16 -h 16 "$SVG_FILE" -o "$SCRIPT_DIR/icon16.png"
    rsvg-convert -w 48 -h 48 "$SVG_FILE" -o "$SCRIPT_DIR/icon48.png"
    rsvg-convert -w 128 -h 128 "$SVG_FILE" -o "$SCRIPT_DIR/icon128.png"
    echo "✅ Icons generated successfully!"

else
    echo "❌ Error: No SVG converter found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Inkscape: https://inkscape.org/"
    echo "  - ImageMagick: sudo apt-get install imagemagick"
    echo "  - librsvg: sudo apt-get install librsvg2-bin"
    echo ""
    echo "Or use an online converter like:"
    echo "  - https://cloudconvert.com/svg-to-png"
    echo "  - https://svgtopng.com/"
    exit 1
fi
