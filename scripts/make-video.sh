#!/usr/bin/env bash
# Re-encode the intro splash videos from image-src/ into deployed H.264.
#
# These are the FIRST-VISIT-ONLY fullscreen intro (preload="none", returning
# visitors never mount it, and it sits behind a poster) — so it is NOT the LCP
# element and its size does not move Lighthouse. That lets us keep it at native
# resolution and a high bitrate for a crisp, sharp splash, with a maxrate cap
# only to smooth out buffering spikes. VP9/WebM was tried and came out larger
# than capped H.264 for this high-motion footage, so H.264 mp4 is used alone.
set -e

# Desktop 16:9 — native 1920x1080.
ffmpeg -y -i image-src/paper-airplane-intro-1080.mp4 \
  -vf scale=1920:1080 -c:v libx264 -crf 25 -maxrate 3200k -bufsize 6400k \
  -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k \
  public/assets/intro-desktop.mp4

# Mobile 9:16 — native 1080x1920.
ffmpeg -y -i image-src/paper-airplane-mobile.mp4 \
  -vf scale=1080:1920 -c:v libx264 -crf 26 -maxrate 2600k -bufsize 5200k \
  -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k \
  public/assets/intro-mobile.mp4
