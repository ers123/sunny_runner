# 📋 Icon Checklist for Rainbow Sparkle Runner

Place your icon images in this `/public/` folder.

## ✅ Required Icons

### icon-192.png
- **Size:** 192x192 pixels
- **Format:** PNG with transparency
- **Purpose:** Mobile home screen icon, PWA install
- **Design:** Pastel gradient background (#FFB6C1 → #DDA0DD), sparkle/star icon
- **Status:** ⬜ Not added yet

### icon-512.png
- **Size:** 512x512 pixels
- **Format:** PNG with transparency
- **Purpose:** High-resolution displays, splash screens
- **Design:** Same as 192px but with more detail
- **Status:** ⬜ Not added yet

---

## 📸 Optional Images (Recommended)

### og-image.png
- **Size:** 1200x630 pixels
- **Format:** PNG or JPG
- **Purpose:** Social media sharing (Twitter, Facebook, LinkedIn)
- **Design:** Game title + tagline + character on pastel background
- **Status:** ⬜ Not added yet

### favicon.ico
- **Size:** 32x32 pixels
- **Format:** ICO
- **Purpose:** Browser tab icon
- **Design:** Simplified sparkle icon
- **Status:** ⬜ Not added yet

### screenshot-wide.png
- **Size:** 1280x720 pixels
- **Format:** PNG
- **Purpose:** PWA app store listing (desktop)
- **Design:** Gameplay screenshot showing pastel world
- **Status:** ⬜ Not added yet

### screenshot-narrow.png
- **Size:** 750x1334 pixels
- **Format:** PNG
- **Purpose:** PWA app store listing (mobile)
- **Design:** Mobile gameplay screenshot
- **Status:** ⬜ Not added yet

---

## 🎨 Design Guidelines

### Color Palette to Use:
```
Hot Pink:     #FF69B4
Light Pink:   #FFB6C1
Plum/Purple:  #DDA0DD
Sky Blue:     #87CEEB
Pale Green:   #98FB98
Lavender:     #E6E6FA
Misty Rose:   #FFE4E1
```

### Icon Design Keywords:
- Magical, sparkles, stars
- Rainbow gradient background
- Unicorn or fairy silhouette
- Cute running character
- Pastel colors, child-friendly
- Rounded corners (20px radius for square icons)

---

## 🔨 Quick Icon Generation Options

### Option 1: AI Generation (Fastest)
Use DALL-E, Midjourney, or similar with this prompt:
```
"Cute magical app icon, pastel pink and purple gradient background,
white sparkle star in center, rounded corners, child-friendly,
minimalist, kawaii style, 512x512 pixels, app icon design"
```

### Option 2: Design Tools
- **Figma** (free): Create with gradients and export at exact sizes
- **Canva** (free): Use templates and customize colors
- **Adobe Express** (free): Quick icon maker

### Option 3: Simple Placeholder
Create a simple gradient square with a sparkle emoji:
1. Use any image editor
2. Create 512x512 canvas
3. Add gradient: pink → purple
4. Add white sparkle/star in center
5. Export as PNG
6. Resize to 192x192 for smaller version

---

## ✅ Verification

After adding icons, verify:
- [ ] Files are in `/public/` folder
- [ ] Correct sizes (192x192 and 512x512)
- [ ] PNG format with transparency
- [ ] Filenames match exactly: `icon-192.png`, `icon-512.png`
- [ ] Colors match the game theme (pastel pink/purple)
- [ ] Visible and recognizable at small sizes

---

## 🚀 Next Steps

Once icons are added:
```bash
# 1. Add files to git
git add public/icon-192.png public/icon-512.png public/og-image.png

# 2. Commit
git commit -m "Add PWA icons and social media images"

# 3. Push
git push origin claude/build-pwa-app-01FB6pkGuKocP8fDXsShMqok

# 4. Deploy to Vercel
# Follow instructions in DEPLOYMENT.md
```
