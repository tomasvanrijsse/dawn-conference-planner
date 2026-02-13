#!/usr/bin/env python3
"""
Generate simple placeholder icons for Chrome extension
Requires: Pillow (PIL)
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("❌ Error: Pillow not installed")
    print("Install with: pip install Pillow")
    exit(1)

def create_icon(size):
    """Create a simple calendar icon"""
    # Create image with gradient-like background
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)

    # Calculate proportions
    padding = size // 8
    calendar_width = size - (padding * 2)
    calendar_height = int(calendar_width * 0.9)

    # Draw calendar background (white)
    cal_x = padding
    cal_y = padding + size // 10
    draw.rectangle(
        [cal_x, cal_y, cal_x + calendar_width, cal_y + calendar_height],
        fill='white',
        outline='#764ba2',
        width=max(1, size // 64)
    )

    # Draw calendar header (yellow)
    header_height = calendar_height // 4
    draw.rectangle(
        [cal_x, cal_y, cal_x + calendar_width, cal_y + header_height],
        fill='#f7b500'
    )

    # Draw calendar grid lines
    grid_color = '#667eea'
    line_width = max(1, size // 64)

    # Vertical lines
    for i in range(1, 4):
        x = cal_x + (calendar_width * i // 4)
        draw.line(
            [(x, cal_y + header_height), (x, cal_y + calendar_height)],
            fill=grid_color,
            width=line_width
        )

    # Horizontal lines
    for i in range(1, 3):
        y = cal_y + header_height + ((calendar_height - header_height) * i // 3)
        draw.line(
            [(cal_x, y), (cal_x + calendar_width, y)],
            fill=grid_color,
            width=line_width
        )

    # Draw plus sign circle (bottom right)
    if size >= 48:
        plus_radius = size // 6
        plus_x = size - padding - plus_radius
        plus_y = size - padding - plus_radius

        # Draw circle
        draw.ellipse(
            [plus_x - plus_radius, plus_y - plus_radius,
             plus_x + plus_radius, plus_y + plus_radius],
            fill='#4285f4'
        )

        # Draw plus sign
        plus_size = plus_radius // 2
        plus_width = max(2, size // 32)
        # Vertical line
        draw.line(
            [(plus_x, plus_y - plus_size), (plus_x, plus_y + plus_size)],
            fill='white',
            width=plus_width
        )
        # Horizontal line
        draw.line(
            [(plus_x - plus_size, plus_y), (plus_x + plus_size, plus_y)],
            fill='white',
            width=plus_width
        )

    return img

# Generate icons
script_dir = os.path.dirname(os.path.abspath(__file__))
sizes = [16, 48, 128]

for size in sizes:
    icon = create_icon(size)
    filename = os.path.join(script_dir, f'icon{size}.png')
    icon.save(filename, 'PNG')
    print(f'✅ Generated icon{size}.png')

print('\n🎉 All icons generated successfully!')
