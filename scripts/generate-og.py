from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

root = Path(__file__).resolve().parent.parent
size = (1200, 630)
image = Image.new('RGB', size)
pixels = image.load()
for y in range(size[1]):
    for x in range(size[0]):
        glow = max(0, 1 - ((x - 800) ** 2 / 880 ** 2 + (y - 80) ** 2 / 520 ** 2))
        pixels[x, y] = (int(247 - 5 * glow), int(246 - 10 * glow), int(250 + 1 * glow))

draw = ImageDraw.Draw(image)
font_path = '/System/Library/Fonts/Supplemental/Arial.ttf'
bold_path = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font = ImageFont.truetype(bold_path, 68)
small = ImageFont.truetype(font_path, 29)
label = ImageFont.truetype(bold_path, 23)
icon = Image.open(root / 'public/favicon.png').convert('RGBA').resize((78, 78))
image.paste(icon, (78, 79), icon)
draw.text((178, 92), 'Codex Usage Desktop', fill='#26283c', font=label)
draw.text((78, 207), 'Codex usage,', fill='#242638', font=font)
draw.text((78, 285), 'at a glance.', fill='#7159ad', font=font)
draw.text((80, 392), 'Tokens  •  Limits  •  Costs', fill='#696b7c', font=small)

screen = Image.open(root / 'public/images/dashboard.jpg').convert('RGB')
screen.thumbnail((630, 420))
screen = screen.crop((0, 0, min(screen.width, 630), min(screen.height, 370)))
shadow = Image.new('RGBA', (screen.width + 44, screen.height + 44), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle((22, 20, screen.width + 20, screen.height + 20), 20, fill=(53, 42, 91, 100))
shadow = shadow.filter(ImageFilter.GaussianBlur(20))
image.paste(shadow, (585, 222), shadow)
image.paste(screen, (607, 232))
image.save(root / 'public/og.png', optimize=True)
