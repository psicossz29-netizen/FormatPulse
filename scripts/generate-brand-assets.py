import os
from PIL import Image, ImageDraw, ImageFont

def create_brand_assets():
    icons_dir = os.path.join('src-tauri', 'icons')
    os.makedirs(icons_dir, exist_ok=True)

    # ── 1. Render Master High-Res Icon (512x512) ─────────────────────────────
    size = (512, 512)
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background bevel (#18181b -> #09090b)
    draw.rounded_rectangle([32, 32, 480, 480], radius=104, fill=(16, 16, 18, 255), outline=(39, 39, 42, 255), width=8)
    # Inner accent hairline
    draw.rounded_rectangle([52, 52, 460, 460], radius=88, outline=(255, 79, 0, 60), width=3)

    # Precision corner calibrators (#3f3f46)
    corner_color = (63, 63, 70, 255)
    # Top-Left
    draw.line([(68, 68), (68, 96)], fill=corner_color, width=4)
    draw.line([(68, 68), (96, 68)], fill=corner_color, width=4)
    # Top-Right
    draw.line([(444, 68), (416, 68)], fill=corner_color, width=4)
    draw.line([(444, 68), (444, 96)], fill=corner_color, width=4)
    # Bottom-Left
    draw.line([(68, 444), (68, 416)], fill=corner_color, width=4)
    draw.line([(68, 444), (96, 444)], fill=corner_color, width=4)
    # Bottom-Right
    draw.line([(444, 444), (416, 444)], fill=corner_color, width=4)
    draw.line([(444, 444), (444, 416)], fill=corner_color, width=4)

    # Left Bracket (Safety Orange #ff4f00)
    orange = (255, 79, 0, 255)
    draw.line([(192, 152), (124, 256)], fill=orange, width=32)
    draw.line([(124, 256), (192, 360)], fill=orange, width=32)

    # Right Bracket (Safety Orange #ff4f00)
    draw.line([(320, 152), (388, 256)], fill=orange, width=32)
    draw.line([(388, 256), (320, 360)], fill=orange, width=32)

    # Electric Telemetry Pulse Wave (White core + Orange/Green gradient aesthetic)
    white = (255, 255, 255, 255)
    draw.line([(148, 256), (206, 256)], fill=white, width=22)
    draw.line([(206, 256), (236, 168)], fill=white, width=22)
    draw.line([(236, 168), (276, 344)], fill=orange, width=22)
    draw.line([(276, 344), (306, 256)], fill=white, width=22)
    draw.line([(306, 256), (364, 256)], fill=white, width=22)

    # Sentinel Status Indicator Node (Emerald #10b981)
    emerald_halo = (16, 185, 129, 60)
    emerald = (16, 185, 129, 255)
    draw.ellipse([340, 232, 388, 280], fill=emerald_halo)
    draw.ellipse([350, 242, 378, 270], fill=emerald, outline=(9, 9, 11, 255), width=3)
    draw.ellipse([360, 252, 368, 260], fill=(255, 255, 255, 255))

    # Save PNG formats
    img.save(os.path.join(icons_dir, 'icon.png'))
    img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, '32x32.png'))
    img.resize((128, 128), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, '128x128.png'))
    img.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(icons_dir, '128x128@2x.png'))

    # Save Windows multi-resolution icon .ico
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    img.save(os.path.join(icons_dir, 'icon.ico'), format='ICO', sizes=ico_sizes)

    # Also save to public for browser assets
    img.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join('public', 'icon-192.png'))
    img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join('public', 'icon-512.png'))

    # ── 2. NSIS Header Bitmap (150x57 px) ────────────────────────────────────
    header = Image.new('RGB', (150, 57), (9, 9, 11))
    h_draw = ImageDraw.Draw(header)
    # Border line
    h_draw.line([(0, 56), (150, 56)], fill=(39, 39, 42), width=1)
    # Thumbnail logo placed on the right
    logo_thumb = img.resize((44, 44), Image.Resampling.LANCZOS)
    header.paste(logo_thumb, (98, 6), logo_thumb)
    # Text on left
    h_draw.text((10, 14), "FormatPulse", fill=(244, 244, 245))
    h_draw.text((10, 30), "Zero-Knowledge", fill=(161, 161, 170))
    header.save(os.path.join(icons_dir, 'nsis-header.bmp'), format='BMP')

    # ── 3. NSIS Sidebar Bitmap (164x314 px) ──────────────────────────────────
    sidebar = Image.new('RGB', (164, 314), (9, 9, 11))
    s_draw = ImageDraw.Draw(sidebar)
    # Background subtle grid lines
    for y in range(0, 314, 24):
        s_draw.line([(0, y), (164, y)], fill=(20, 20, 24), width=1)
    for x in range(0, 164, 24):
        s_draw.line([(x, 0), (x, 314)], fill=(20, 20, 24), width=1)

    # Orange accent accent border on right
    s_draw.line([(163, 0), (163, 314)], fill=(255, 79, 0), width=2)

    # Large logo mark in center
    logo_side = img.resize((96, 96), Image.Resampling.LANCZOS)
    sidebar.paste(logo_side, (34, 48), logo_side)

    # Branding text
    s_draw.text((28, 160), "FORMATPULSE", fill=(244, 244, 245))
    s_draw.text((36, 178), "// v1.2 NATIVE", fill=(255, 79, 0))
    s_draw.text((20, 214), "100% Client-Side", fill=(161, 161, 170))
    s_draw.text((20, 230), "Zero Server I/O", fill=(161, 161, 170))
    s_draw.text((20, 246), "AST Code Studio", fill=(161, 161, 170))
    s_draw.text((20, 280), "AIR-GAPPED SECURE", fill=(16, 185, 129))

    sidebar.save(os.path.join(icons_dir, 'nsis-sidebar.bmp'), format='BMP')

    print("All brand assets, Windows icons (.ico), and NSIS bitmaps successfully generated!")

if __name__ == '__main__':
    create_brand_assets()
