# Texture Files untuk AI Pattern Generation

Folder ini berisi seamless pattern textures untuk aplikasi Clo Visual.

## File yang Diperlukan:

Download seamless patterns (512x512px atau 1024x1024px, PNG format) dan simpan di folder ini:

### Required Textures:

**SVG Files (Geometric/Simple Patterns):**
- `geometric.svg` - Pola geometris (shapes, triangles, hexagons)
- `stripes.svg` - Garis-garis horizontal/vertical

**PNG Files (Realistic/Photo Textures):**
- `floral.png` - Pola bunga/botanical
- `batik.png` - Motif batik Indonesia
- `denim.png` - Tekstur kain denim/jeans
- `knit.png` - Tekstur rajutan/jersey knit
- `cotton.png` - Tekstur kain katun

> **Note**: SVG cocok untuk pattern vector sederhana (geometric, stripes).
> PNG cocok untuk texture realistis (fabric, denim, floral).

## Sumber Download Gratis:

### 1. **Subtle Patterns** (Recommended)
- Website: https://www.toptal.com/designers/subtlepatterns/
- Format: PNG, seamless tileable
- Kategori: Fabric, geometric, patterns
- Lisensi: Free for personal & commercial use

### 2. **Hero Patterns**
- Website: https://heropatterns.com/
- Format: SVG (convert to PNG)
- Kategori: Geometric patterns only
- Lisensi: Free (CC BY 4.0)

### 3. **Pattern Monster**
- Website: https://pattern.monster/
- Format: SVG/PNG
- Kategori: Custom geometric patterns
- Lisensi: Free

### 4. **Freepik** (Require attribution)
- Website: https://www.freepik.com/
- Search: "seamless pattern texture fabric"
- Lisensi: Free with attribution

## Format Requirements:

### For PNG Files:
✅ **Resolution**: 512x512px minimal (1024x1024px optimal)
✅ **Format**: PNG dengan transparency (bila perlu)
✅ **Seamless**: Pastikan pattern bisa repeat tanpa sambungan terlihat
✅ **Color**: Grayscale atau color (warna akan di-tint oleh material Three.js)

### For SVG Files:
✅ **ViewBox**: Set viewBox="0 0 512 512" atau sesuai pattern size
✅ **Seamless**: Pattern harus tileable (pakai pattern editor jika perlu)
✅ **Simple Shapes**: Hindari SVG terlalu kompleks (banyak path/gradients)
✅ **Color**: Monochrome/simple colors (Three.js akan tint dengan warna user)

## Tips Memilih Pattern:

1. **Geometric**: Pilih pola yang tidak terlalu ramai, bentuk sederhana
2. **Stripes**: Garis tegas, bisa diagonal/horizontal
3. **Floral**: Bunga kecil-kecil, tidak terlalu detail
4. **Batik**: Traditional Indonesian pattern, medium complexity
5. **Denim**: Close-up tekstur kain denim dengan weave visible
6. **Knit**: Jersey knit texture, subtle
7. **Cotton**: Plain weave texture, very subtle

## SVG vs PNG: Kapan Pakai Apa?

### Pakai SVG untuk:
✅ Geometric patterns (Hero Patterns, Pattern Monster)
✅ Stripes, chevrons, zigzags
✅ Simple shapes (circles, triangles, hexagons)
✅ Abstract vector patterns

### Pakai PNG untuk:
✅ Photo-realistic textures (denim weave, cotton fabric)
✅ Complex organic patterns (floral dengan detail, batik)
✅ Grainy/noisy textures (fabric grain)
✅ Jika SVG render tidak sempurna

## Download SVG Langsung (No Conversion Needed):

### Hero Patterns (SVG Native):
1. Buka: https://heropatterns.com/
2. Pilih pattern (geometric, stripes, etc.)
3. Adjust spacing & stroke width
4. Click "Copy SVG" atau "Download SVG"
5. Save as `geometric.svg` atau `stripes.svg`

### Pattern Monster:
1. Buka: https://pattern.monster/
2. Generate custom geometric pattern
3. Download SVG
4. Save ke folder `public/textures/`

### Jika Perlu Convert SVG ke PNG:
1. Online: https://cloudconvert.com/svg-to-png (set 1024x1024px)
2. Photoshop/GIMP: Import → Set canvas 1024x1024 → Export PNG

## Testing:

Setelah download dan simpan textures, refresh aplikasi dan test dengan prompt:

- "T-shirt hitam dengan motif geometric" → pakai geometric.png
- "Kaos putih dengan garis-garis" → pakai stripes.png
- "Hoodie dengan motif bunga" → pakai floral.png

## Fallback System:

Jika file texture tidak ditemukan, aplikasi akan:
1. Coba load dari `/textures/{pattern}.png`
2. Jika 404 error → fallback ke solid color (no texture)
3. TextureErrorBoundary akan catch error dan render plain color

---

**Status**: 🚧 Textures belum didownload - placeholder paths sudah ready di `aiService.ts`
