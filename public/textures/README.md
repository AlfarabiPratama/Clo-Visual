# Texture Files untuk AI Pattern Generation

Folder ini berisi seamless pattern textures untuk aplikasi Clo Visual.

## File yang Diperlukan:

Download seamless patterns (512x512px atau 1024x1024px, PNG format) dan simpan di folder ini:

### Required Textures:
- `geometric.png` - Pola geometris (shapes, triangles, hexagons)
- `stripes.png` - Garis-garis horizontal/vertical
- `floral.png` - Pola bunga/botanical
- `batik.png` - Motif batik Indonesia
- `denim.png` - Tekstur kain denim/jeans
- `knit.png` - Tekstur rajutan/jersey knit
- `cotton.png` - Tekstur kain katun

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

✅ **Resolution**: 512x512px minimal (1024x1024px optimal)
✅ **Format**: PNG dengan transparency (bila perlu)
✅ **Seamless**: Pastikan pattern bisa repeat tanpa sambungan terlihat
✅ **Color**: Grayscale atau color (warna akan di-tint oleh material Three.js)

## Tips Memilih Pattern:

1. **Geometric**: Pilih pola yang tidak terlalu ramai, bentuk sederhana
2. **Stripes**: Garis tegas, bisa diagonal/horizontal
3. **Floral**: Bunga kecil-kecil, tidak terlalu detail
4. **Batik**: Traditional Indonesian pattern, medium complexity
5. **Denim**: Close-up tekstur kain denim dengan weave visible
6. **Knit**: Jersey knit texture, subtle
7. **Cotton**: Plain weave texture, very subtle

## Cara Convert SVG ke PNG:

Jika download SVG dari Hero Patterns:

### Online Tool:
1. Buka: https://cloudconvert.com/svg-to-png
2. Upload SVG
3. Set size: 1024x1024px
4. Convert & download

### Photoshop/GIMP:
1. Open SVG
2. Set canvas size: 1024x1024px
3. Export as PNG

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
