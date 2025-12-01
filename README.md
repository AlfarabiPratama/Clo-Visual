<div align="center">
   <h1>Clo Visual – AI Powered 3D Fashion Canvas</h1>
   <p><strong>Generate realistic apparel designs (text/image) and visualize them instantly on interactive 3D garments.</strong></p>
   <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Banner" />
   <p>
      <a href="https://github.com/AlfarabiPratama/Clo-Visual">Repo</a> ·
      <a href="#features">Features</a> ·
      <a href="#quick-start">Quick Start</a> ·
      <a href="#contributing">Contributing</a>
   </p>
</div>

---

## ✨ Overview
Clo Visual membantu desainer fashion, UMKM, dan edukator untuk memotong waktu pembuatan sampel fisik. Masukkan prompt tekstual atau gambar referensi – sistem menghasilkan warna, tekstur, dan pattern lalu menampilkannya pada model 3D (T-shirt, Hoodie, Dress). Cocok untuk presentasi konsep, eksplorasi varian desain, dan pre-production.

## 🚀 Features
- Text-to-Design AI (Gemini Flash) dengan prompt engineering khusus fashion
- Image-to-Design (analisa sketsa / foto referensi)
- 3D PBR Viewer (Three.js + React Three Fiber) dengan auto-rotate & lighting studio
- Template Library (>30 preset netral & kategori fashion)
- Undo/Redo state history
- Custom model (.glb) upload
- Progressive AI status messaging untuk presentasi demo
- Quick action toolbar (rotate toggle, camera reset)
- Export screenshot (PNG) & stub siap untuk GLB export

## 🧱 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite |
| 3D Engine | Three.js + @react-three/fiber + @react-three/drei |
| AI | Google Gemini (gemini-2.5-flash) |
| Styling | Tailwind CSS (CDN dev, recommended PostCSS for production) |
| State | React hooks + custom history stack |

## 📦 Project Structure (simplified)
```
components/ThreeDViewer.tsx   # 3D viewer & garment generation
components/TemplateBrowser.tsx # Modal untuk pilih template design
pages/DesignerPage.tsx        # Halaman utama design workspace
data/templateLibrary.ts       # Template preset (warna, pattern, fit)
services/aiService.ts         # Integrasi Gemini API
types.ts                      # Shared TypeScript interfaces/enums
```

## ⚡ Quick Start <a id="quick-start"></a>
Prerequisites: Node.js 18+

```bash
git clone https://github.com/AlfarabiPratama/Clo-Visual.git
cd Clo-Visual
npm install
```

Tambahkan API key Gemini (opsional – tanpa ini akan pakai mock):
```
setx GEMINI_API_KEY "YOUR_KEY"   # Windows (PowerShell)
```
Jalankan dev server:
```bash
npm run dev
```

## 🧪 Sample Prompts
```
T-shirt jersey cotton putih dengan pattern geometric minimalis hitam
Hoodie fleece navy blue dengan print batik modern emas
Dress linen beige dengan motif floral vintage halus
```

## 🎨 3D Viewer Features
- ACES Filmic tone mapping & soft shadows
- Multi-light rig (key, fill, rim, hemisphere, accent)
- Procedural garment geometry (t-shirt, hoodie, dress)
- Auto-rotate toggle + camera damping
- Loading overlay & status badges

## 🔐 Environment Variables
| Name | Purpose |
|------|---------|
| GEMINI_API_KEY | Mengakses model Gemini (opsional untuk demo) |

## 🛠 Roadmap (Next)
- GLB export full implementation (GLTFExporter)
- Multi-angle batch render (front/back/side)
- Collaborative comments & share link
- Texture library (denim, knit, silk presets)
- Mobile optimized layout

## 🤝 Contributing <a id="contributing"></a>
Pull request welcome!:
1. Fork repo
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit: `git commit -m "feat: tambah X"`
4. Push: `git push origin feat/nama-fitur`
5. Buka PR jelaskan perubahan & screenshot

Issue Guidelines:
- Sertakan langkah reproduce
- Cantumkan browser & OS
- Lampirkan screenshot / log error

## 🧪 Quality / Dev Tips
- Jalankan `npm run dev` untuk HMR
- Gunakan sample prompt untuk demo cepat
- Pastikan autopreserveDrawingBuffer tetap aktif untuk screenshot

## 📄 License
MIT – lihat file `LICENSE`.

## 🙌 Acknowledgements
- Three.js & React Three Fiber komunitas
- Google Gemini untuk generative design suggestions
- Tailwind CSS untuk styling cepat

---
Selamat berkreasi! ✨

