#!/usr/bin/env bash
# Re-encode the intro videos from image-src/ into deployed, capped H.264 (<1.2MB
# each). VP9/WebM was tried but came out LARGER than this capped H.264 for such
# high-motion footage, and H.264 mp4 is universally supported, so it is omitted.
set -e
ffmpeg -y -i image-src/paper-airplane-intro-1080.mp4 -vf scale=1280:720 -c:v libx264 -crf 32 -maxrate 900k -bufsize 1400k -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 80k public/assets/intro-desktop.mp4
ffmpeg -y -i image-src/paper-airplane-mobile.mp4     -vf scale=608:1080 -c:v libx264 -crf 32 -maxrate 750k -bufsize 1200k -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 80k public/assets/intro-mobile.mp4
