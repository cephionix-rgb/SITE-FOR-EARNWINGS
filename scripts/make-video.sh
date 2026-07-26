#!/usr/bin/env bash
# Re-encode the intro videos from image-src/ into deployed, capped H.264 (<1.2MB
# each). VP9/WebM was tried but came out LARGER than this capped H.264 for such
# high-motion footage, and H.264 mp4 is universally supported, so it is omitted.
set -e
ffmpeg -y -i image-src/paper-airplane-intro-1080.mp4 -vf scale=1152:648 -c:v libx264 -crf 33 -maxrate 650k -bufsize 1000k -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 72k public/assets/intro-desktop.mp4
ffmpeg -y -i image-src/paper-airplane-mobile.mp4     -vf scale=540:960 -c:v libx264 -crf 33 -maxrate 600k -bufsize 1000k -preset medium -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 72k public/assets/intro-mobile.mp4
