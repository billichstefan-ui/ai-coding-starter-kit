#!/usr/bin/env python3
"""Generate transparent 1080x1920 text-overlay PNGs for the pancake TikTok.
Runner-portable: resolves a bold sans font from several candidate locations."""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
CANDIDATES = [
    os.environ.get("FONT_PATH", ""),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    "/mnt/skills/examples/canvas-design/canvas-fonts/Outfit-Bold.ttf",
]
FONT = next((p for p in CANDIDATES if p and os.path.exists(p)), None)
if FONT is None:
    raise SystemExit("No bold font found in candidates: %s" % CANDIDATES)
print("Using font:", FONT)


def font(sz):
    return ImageFont.truetype(FONT, sz)


def text_center(draw, cy, lines, sizes, sw=10):
    metrics = []
    total_h = 0
    gap = 18
    for line, sz in zip(lines, sizes):
        f = font(sz)
        bbox = draw.textbbox((0, 0), line, font=f, stroke_width=sw)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        metrics.append((line, f, w, h, bbox))
        total_h += h + gap
    total_h -= gap
    y = cy - total_h / 2
    for line, f, w, h, bbox in metrics:
        x = (W - w) / 2 - bbox[0]
        draw.text((x, y - bbox[1]), line, font=f, fill=(255, 255, 255, 255),
                  stroke_width=sw, stroke_fill=(0, 0, 0, 255))
        y += h + gap


def heart(draw, cx, cy, s, color=(232, 30, 45, 255)):
    import math
    pts = []
    for i in range(0, 360, 4):
        t = math.radians(i)
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        pts.append((cx + x * s / 16, cy - y * s / 16))
    draw.polygon(pts, fill=color, outline=(0, 0, 0, 255))
    draw.line(pts + [pts[0]], fill=(0, 0, 0, 255), width=6, joint="curve")


def arrow_down(draw, cx, cy, w, h, color=(255, 255, 255, 255)):
    sw = 8
    shaft_w = w * 0.34
    head_h = h * 0.5
    top = cy - h / 2
    bot = cy + h / 2
    draw.rectangle([cx - shaft_w / 2, top, cx + shaft_w / 2, bot - head_h],
                   fill=color, outline=(0, 0, 0, 255), width=sw)
    draw.polygon([(cx - w / 2, bot - head_h), (cx + w / 2, bot - head_h), (cx, bot)],
                 fill=color, outline=(0, 0, 0, 255))
    draw.line([(cx - w / 2, bot - head_h), (cx, bot), (cx + w / 2, bot - head_h)],
              fill=(0, 0, 0, 255), width=sw, joint="curve")


def new():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


# 1) HOOK -- top
img, d = new()
text_center(d, int(H * 0.16), ["WARTE AUF DEN", "SIRUP AM ENDE..."], [92, 92], sw=11)
img.save("ov_hook.png")

# 2) LIKE -- middle, red heart + double-tap
img, d = new()
heart(d, W // 2, int(H * 0.40), 150)
text_center(d, int(H * 0.51), ["DOPPELTIPP", "wenn du reinbeissen wuerdest"], [96, 52], sw=10)
img.save("ov_like.png")

# 3) KOMMENTAR -- middle, question + arrow + CTA
img, d = new()
text_center(d, int(H * 0.40), ["AHORNSIRUP", "oder HONIG?"], [90, 90], sw=11)
arrow_down(d, W // 2, int(H * 0.52), 120, 150)
text_center(d, int(H * 0.61), ["Schreib es in die Kommentare!"], [54], sw=9)
img.save("ov_comment.png")

# 4) FOLGEN -- middle
img, d = new()
text_center(d, int(H * 0.47), ["FOLGE FUER", "taeglich neue Rezepte"], [98, 60], sw=11)
img.save("ov_follow.png")

print("overlays written")
