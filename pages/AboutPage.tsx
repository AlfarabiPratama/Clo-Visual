import React from 'react';
import { Users, Target, Lightbulb, Award, Code, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-600 to-slate-800 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6">
            Tentang Clo Visual
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Platform AI Fashion Design berbasis web yang membantu desainer dan UMKM mengubah ide menjadi visualisasi 3D secara instan
          </p>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Masalah yang Kami Pecahkan</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                <p>
                  <strong className="text-gray-900">Biaya Prototyping Tinggi:</strong> Desainer dan UMKM fashion sering kali membutuhkan biaya besar untuk membuat sample fisik sebelum produksi massal.
                </p>
                <p>
                  <strong className="text-gray-900">Waktu Produksi Lama:</strong> Proses dari sketsa hingga sample bisa memakan waktu berminggu-minggu.
                </p>
                <p>
                  <strong className="text-gray-900">Keterbatasan Visualisasi:</strong> Sulit menjelaskan konsep desain kepada klien atau investor hanya dengan sketsa 2D.
                </p>
                <p>
                  <strong className="text-gray-900">Gap Teknologi:</strong> Tidak semua desainer memiliki akses atau skill menggunakan software 3D modeling profesional seperti CLO 3D atau Marvelous Designer.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Solusi Kami</h2>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600">
                <p>
                  <strong className="text-gray-900">Text-to-Design AI:</strong> Cukup ketik deskripsi desain (misalnya "dress batik modern warna pastel"), dan AI kami akan menghasilkan pola serta visualisasi 3D dalam hitungan detik.
                </p>
                <p>
                  <strong className="text-gray-900">Sketch-to-3D Conversion:</strong> Upload foto sketsa tangan, dan sistem akan memetakan tekstur ke model 3D secara otomatis.
                </p>
                <p>
                  <strong className="text-gray-900">3D Viewer Interaktif:</strong> Preview pakaian dari segala sisi dengan kontrol rotasi 360°, zoom, dan edit warna real-time.
                </p>
                <p>
                  <strong className="text-gray-900">Multi-Format Export:</strong> Ekspor hasil sebagai gambar (PNG) untuk moodboard atau file 3D (.obj) untuk pengembangan lanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            <div className="bg-slate-50 p-5 sm:p-6 md:p-8 rounded-xl border border-slate-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Visi</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Menjadi platform AI terdepan dalam industri fashion digital di Indonesia, yang memberdayakan desainer lokal dan UMKM untuk bersaing di pasar global dengan teknologi visualization 3D yang affordable dan mudah digunakan.
              </p>
            </div>

            <div className="bg-slate-50 p-5 sm:p-6 md:p-8 rounded-xl border border-slate-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Misi</h2>
              </div>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 mt-1">•</span>
                  Menyediakan tool AI yang mudah digunakan tanpa memerlukan skill 3D modeling
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 mt-1">•</span>
                  Mempercepat proses design-to-production dari minggu menjadi jam
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 mt-1">•</span>
                  Menurunkan biaya R&D untuk UMKM fashion hingga 50%
                </li>
                <li className="flex items-start">
                  <span className="text-slate-600 mr-2 mt-1">•</span>
                  Meningkatkan kualitas visual presentation untuk mendapatkan funding/investor
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Teknologi yang Kami Gunakan</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Dibangun dengan teknologi modern dan AI terdepan untuk memberikan pengalaman terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <Code className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Frontend</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• React + TypeScript</li>
                <li>• Vite (Build Tool)</li>
                <li>• Tailwind CSS</li>
                <li>• Three.js (3D Rendering)</li>
              </ul>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Models</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Google Gemini 2.0 Flash</li>
                <li>• OpenAI GPT-4o-mini</li>
                <li>• DeepSeek Chat</li>
                <li>• Multi-provider Fallback</li>
              </ul>
            </div>

            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-200">
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-slate-600 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Deployment</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• GitHub Pages</li>
                <li>• CI/CD Automation</li>
                <li>• Progressive Web App</li>
                <li>• Cloud Storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Tim Kami</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Mahasiswa Universitas Indonesia yang passionate dalam teknologi dan fashion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                AF
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Alfarabi Pratama</h3>
              <p className="text-slate-600 font-medium mb-2 text-sm sm:text-base">Founder & Lead Developer</p>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                Mahasiswa Teknik Informatika UI yang fokus pada AI dan Web Development
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                XX
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Team Member</h3>
              <p className="text-slate-600 font-medium mb-2 text-sm sm:text-base">UI/UX Designer</p>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                Merancang user experience yang intuitif dan menarik
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                YY
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Team Member</h3>
              <p className="text-slate-600 font-medium mb-2 text-sm sm:text-base">Business Development</p>
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                Mengelola strategi bisnis dan partnership
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Background */}
      <section className="py-8 sm:py-12 md:py-16 bg-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 mx-auto mb-4 sm:mb-6 text-slate-300" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Project Background</h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed mb-4 sm:mb-6">
            Clo Visual adalah startup prototype yang dikembangkan sebagai bagian dari mata kuliah Bisnis Digital di Universitas Indonesia. 
            Project ini lahir dari observasi terhadap tantangan yang dihadapi oleh desainer fashion lokal dan UMKM dalam memvisualisasikan 
            ide desain mereka dengan biaya terjangkau.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
            Dengan memanfaatkan teknologi AI terkini dari Google Gemini, OpenAI, dan DeepSeek, kami berhasil menciptakan platform yang 
            dapat mengubah deskripsi teks atau sketsa tangan menjadi model 3D fashion dalam hitungan detik. Target market kami adalah 
            desainer independen, UMKM fashion, sekolah mode, dan pabrik garmen yang ingin mempercepat proses R&D mereka.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Mulai transformasi digital fashion journey Anda hari ini
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="#/projects"
              className="px-6 sm:px-8 py-3 bg-slate-600 text-white rounded-md font-medium hover:bg-slate-700 transition-colors text-sm sm:text-base"
            >
              Coba Gratis Sekarang
            </a>
            <a
              href="#/pricing"
              className="px-6 sm:px-8 py-3 border-2 border-slate-600 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors text-sm sm:text-base"
            >
              Lihat Paket Harga
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
