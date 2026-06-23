#!/usr/bin/env bash
# Assemble the ~60s pancake TikTok from clip1..clip4 + voice.mp3 + overlay PNGs.
set -euo pipefail
cd "$(dirname "$0")"

# 1) Normalize each clip: scale-to-cover -> center-crop 1080x1920, 30fps, drop audio.
for i in 1 2 3 4; do
  ffmpeg -y -i "clip${i}.mp4" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1" \
    -an -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "n${i}.mp4"
done

# 2) Concat normalized clips.
printf "file 'n1.mp4'\nfile 'n2.mp4'\nfile 'n3.mp4'\nfile 'n4.mp4'\n" > concat.txt
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy concat.mp4
TOTAL=$(ffprobe -v error -show_entries format=duration -of csv=p=0 concat.mp4)
echo "Concatenated video duration: ${TOTAL}s"
END=$(printf "%.2f" "$TOTAL")

# 3) Burn overlays on the absolute timeline + lay voiceover in starting at 1s.
#    HOOK 0.2-6.5 | LIKE 17-26 | KOMMENTAR 36-48 | FOLGEN 48-end
ffmpeg -y -i concat.mp4 \
  -i ov_hook.png -i ov_like.png -i ov_comment.png -i ov_follow.png \
  -i voice.mp3 \
  -filter_complex "
    [0:v][1:v]overlay=0:0:enable='between(t,0.2,6.5)'[v1];
    [v1][2:v]overlay=0:0:enable='between(t,17,26)'[v2];
    [v2][3:v]overlay=0:0:enable='between(t,36,48)'[v3];
    [v3][4:v]overlay=0:0:enable='between(t,48,${END})'[v];
    [5:a]adelay=1000|1000,apad[a]
  " \
  -map "[v]" -map "[a]" \
  -t "$TOTAL" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  pancake_tiktok.mp4

echo "=== DONE ==="
ffprobe -v error -show_entries format=duration:stream=width,height,codec_name,avg_frame_rate -of default=noprint_wrappers=1 pancake_tiktok.mp4 || true
