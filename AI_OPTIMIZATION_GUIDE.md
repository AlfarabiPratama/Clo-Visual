# 🎯 Panduan Memaksimalkan AI untuk Hasil 3D Realistis

## Overview
Clo Visual menggunakan AI (Google Gemini) dan rendering 3D (Three.js) untuk membuat mockup garment yang realistis. Untuk mendapatkan hasil terbaik, ikuti panduan ini.

---

## 1. Prompt Engineering untuk AI

### Format Prompt Optimal ###
```
[Jenis Garment] + [Material/Kain] + [Warna Detail] + [Style Pattern]
```

### ✅ Contoh Prompt BAGUS (Detail & Spesifik)

**T-Shirts:**
- "T-shirt jersey cotton putih dengan pattern geometric minimalis hitam"
- "T-shirt pique polo navy blue dengan collar ribbed"
- "T-shirt vintage wash grey dengan print band rock retro"

**Hoodies:**
- "Hoodie fleece navy blue dengan print batik modern gold metallic"
- "Hoodie oversized charcoal grey dengan embroidered logo minimalis"
- "Hoodie athletic polyester black dengan reflective strips"

**Dresses:**
- "Dress linen soft pink dengan motif floral vintage small-scale"
- "Dress jersey A-line burgundy dengan belt waist detail"
- "Dress maxi chiffon dusty rose dengan bohemian pattern"

### ❌ Contoh Prompt KURANG OPTIMAL

- "Baju bagus" → Terlalu umum, tidak ada detail
- "Merah" → Tidak ada konteks material atau style
- "Batik" → Terlalu vague, tidak ada warna atau skala
- "T-shirt keren" → Subjektif, AI tidak tahu definisi "keren"

---

## 2. Pengaturan Visual untuk Realism

### A. Texture Scale (Skala Motif)
- **1-2x**: Pattern sangat besar (abstract art, oversized graphics)
- **2-4x**: ⭐ OPTIMAL - Pattern natural dan realistis
- **5-7x**: Pattern medium-small (detail halus)
- **8-10x**: Pattern sangat kecil (micro-texture)

**Tips**: Untuk kebanyakan design, gunakan **3x** sebagai starting point.

### B. Fit Selection
- **Slim Fit**: Modern, fitted, cocok untuk T-shirt casual premium
- **Regular Fit**: ⭐ DEFAULT - Standard sizing, paling natural
- **Oversized**: Streetwear, relaxed style, trendy look

### C. Color Selection
Gunakan warna dengan nama spesifik atau hex code:
- ✅ "Navy blue (#1e3a8a)", "Soft pink (#ffc0cb)", "Charcoal grey (#333333)"
- ❌ "Biru", "Pink", "Abu"

---

## 3. Teknologi Rendering yang Digunakan

### PBR Materials (Physically Based Rendering)
- **Roughness**: 0.85-0.95 untuk fabric realism
- **Sheen**: 0.7-0.85 untuk efek kain cotton/jersey
- **Clearcoat**: 0.05-0.08 untuk subtle fabric gloss
- **Metalness**: 0.0 untuk non-metallic fabrics

### Studio Lighting Setup
Aplikasi menggunakan 7+ light sources:
1. **Key Light** - Main illumination dari atas kanan
2. **Fill Light** - Soften shadows dari kiri
3. **Rim Light** - Edge definition dari belakang
4. **Hemisphere Light** - Natural ambient
5. **Accent Point Lights** - Fabric highlights
6. **Ground Light** - Bottom illumination untuk realism

### Shadow Quality
- **Soft Shadows** dengan 2048x2048 shadow maps
- **Contact Shadows** di ground untuk depth realism
- **Shadow Bias** optimal untuk menghindari artifacts

---

## 4. Workflow Optimal

### Step-by-Step untuk Hasil Maksimal:

1. **Mulai dengan Prompt Detail**
   - Tulis prompt dengan 4 komponen: garment, material, warna, pattern
   - Gunakan contoh di atas sebagai template

2. **Generate & Review**
   - Klik "Generate Design"
   - Tunggu AI menganalisis (1-3 detik)
   - Review warna dan deskripsi yang dihasilkan

3. **Fine-Tune Settings**
   - Adjust texture scale (start di 3x)
   - Pilih fit yang sesuai
   - Tweak warna manual jika perlu

4. **Export**
   - Rotate 3D model untuk angle terbaik
   - Export sebagai PNG untuk mockup final

---

## 5. Advanced Tips

### Untuk Designer Profesional:

**Upload Custom 3D Models:**
- Format: `.glb` atau `.gltf`
- AI akan apply material & texture ke model Anda
- Pastikan model memiliki proper UV mapping

**Combine dengan Image Reference:**
- Upload foto fabric atau design reference
- AI akan analyze warna dan style
- Gunakan bersama text prompt untuk hasil terbaik

**Gunakan Chat Assistant:**
- Tanya AI tentang trend warna seasonal
- Minta saran fabric pairing
- Diskusi style direction

---

## 6. Troubleshooting

### Pattern terlihat tidak natural?
→ Turunkan texture scale ke 2-4x

### Warna terlalu terang/gelap?
→ Adjust manual dengan color picker, atau tambahkan detail warna di prompt

### Model terlihat "plastik"?
→ Material sudah optimal dengan PBR. Mungkin lighting di browser Anda. Coba refresh.

### AI generate design aneh?
→ Prompt terlalu vague. Tambahkan detail material dan warna spesifik.

---

## 7. Contoh Use Cases

### Fashion Brand Mockup
```
Prompt: "T-shirt premium jersey cotton white dengan embroidered logo minimalis navy blue di chest"
Settings: Regular Fit, Texture Scale 3x
Export: PNG untuk product listing
```

### Streetwear Design
```
Prompt: "Hoodie oversized heavy fleece black dengan graffiti print colorful abstract di back"
Settings: Oversized Fit, Texture Scale 4x
Export: PNG untuk social media
```

### Boutique Collection
```
Prompt: "Dress linen blend dusty rose dengan hand-drawn floral pattern vintage cream color"
Settings: Regular Fit, Texture Scale 3x
Export: PNG untuk catalog
```

---

## Resources

- **Three.js Documentation**: https://threejs.org/docs
- **PBR Material Guide**: https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
- **Google Gemini API**: https://ai.google.dev/docs

---

**Pro Tip**: Semakin spesifik prompt Anda, semakin realistis hasil 3D mockup. Eksperimen dengan berbagai kombinasi material, warna, dan pattern untuk menemukan style yang perfect! 🎨✨
