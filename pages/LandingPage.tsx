import React from 'react';
import { Link } from '../components/Navbar';
import { Sparkles, Layers, Zap, Box, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-6 sm:mt-10 md:mt-12 lg:mt-20 xl:mt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-gray-900">
                  <span className="block xl:inline">AI-Powered</span>{' '}
                  <span className="block text-slate-600 xl:inline">3D Fashion Canvas</span>
                </h1>
                <p className="mt-3 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto lg:mx-0 leading-relaxed">
                  Clo Vsual membantu desainer dan UMKM mengubah ide menjadi realitas. Ketik deskripsi desain, upload sketsa, dan lihat hasilnya secara instan pada model 3D.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-3">
                  <div className="rounded-md shadow">
                    <Link to="/projects" className="w-full flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 md:py-4 md:text-lg">
                      Coba Desain Sekarang
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Link to="/projects" className="w-full flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-sm sm:text-base font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 md:py-4 md:text-lg">
                      Lihat Demo
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full opacity-90"
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Fashion Designer working"
          />
          <div className="absolute inset-0 bg-slate-600 mix-blend-multiply opacity-20"></div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="bg-slate-700 py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">Desainer Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">10K+</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">Desain Dibuat</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">98%</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">Kepuasan User</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">50%</div>
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-300">Hemat Waktu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold tracking-wide uppercase">Untuk Siapa?</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Solusi Digital untuk Ekosistem Fashion
            </p>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {[
                { title: 'Desainer Independen', desc: 'Visualisasikan koleksi tanpa menjahit sampel fisik.' },
                { title: 'UMKM Fashion', desc: 'Hemat biaya R&D dan percepat time-to-market.' },
                { title: 'Pabrik Garmen', desc: 'Komunikasi visual yang lebih jelas dengan klien.' },
                { title: 'Sekolah Mode', desc: 'Media pembelajaran modern untuk siswa tata busana.' },
              ].map((item) => (
                <div key={item.title} className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold tracking-wide uppercase">Fitur Utama</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Teknologi di Ujung Jari Anda
            </p>
          </div>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <dl className="space-y-6 sm:space-y-8 md:space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8 lg:gap-x-8 lg:gap-y-10">
              {[
                {
                  name: 'Text-to-Design AI',
                  description: 'Cukup ketik "batik modern warna pastel" dan AI akan membuatkan pola dan variasi desain untuk Anda.',
                  icon: Sparkles,
                },
                {
                  name: 'Sketch to 3D',
                  description: 'Upload foto sketsa tangan kasar, dan biarkan sistem memetakan tekstur ke model 3D.',
                  icon: Layers,
                },
                {
                  name: '3D Viewer Interaktif',
                  description: 'Putar, zoom, dan lihat detail pakaian dari segala sisi sebelum masuk ke produksi.',
                  icon: Box,
                },
                {
                  name: 'Ekspor Instan',
                  description: 'Simpan hasil desain sebagai gambar (PNG) untuk moodboard atau file 3D untuk pengembangan lanjut.',
                  icon: Zap,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-slate-600 text-white">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-12 sm:ml-16 text-base sm:text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-12 sm:ml-16 text-xs sm:text-sm md:text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold tracking-wide uppercase">Cara Kerja</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Dari Ide ke Desain 3D dalam 3 Langkah
            </p>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="relative text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-slate-600 text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Input Ide Anda</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Ketik deskripsi desain atau upload foto sketsa tangan Anda
                </p>
              </div>
              
              <div className="relative text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-slate-600 text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">AI Memproses</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Sistem AI kami menganalisis dan menghasilkan desain 3D
                </p>
              </div>
              
              <div className="relative text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full bg-slate-600 text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Preview &amp; Ekspor</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Putar 360°, edit warna, dan ekspor sebagai PNG atau file 3D
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            <Link to="/projects" className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all">
              Mulai Desain Gratis <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-8 sm:py-10 md:py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm italic text-sm sm:text-base text-gray-600">
              &quot;Clo Vsual memangkas waktu sampling saya hingga 50%. Luar biasa untuk presentasi ke klien.&quot;
              <div className="mt-3 sm:mt-4 font-bold text-gray-900 not-italic text-sm sm:text-base">— Sarah, Desainer Muda</div>
            </div>
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm italic text-sm sm:text-base text-gray-600">
              &quot;Sangat membantu UMKM seperti kami yang punya budget terbatas untuk photoshoot.&quot;
              <div className="mt-3 sm:mt-4 font-bold text-gray-900 not-italic text-sm sm:text-base">— Budi, Pemilik Brand Lokal</div>
            </div>
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm italic text-sm sm:text-base text-gray-600">
              &quot;Alat yang bagus untuk mengajarkan konsep desain digital kepada mahasiswa.&quot;
              <div className="mt-3 sm:mt-4 font-bold text-gray-900 not-italic text-sm sm:text-base">— Ibu Ratna, Dosen Mode</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xs sm:text-sm md:text-base text-slate-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Pertanyaan yang Sering Diajukan
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-start">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 mr-2 mt-1 shrink-0" />
                Apakah saya perlu skill 3D modeling?
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 ml-6 sm:ml-7">
                Tidak sama sekali! Cukup jelaskan ide Anda dengan kata-kata atau sketsa sederhana, AI akan handle sisanya.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-slate-600 mr-2 mt-1 shrink-0" />
                Berapa lama proses generate desain?
              </h3>
              <p className="text-gray-600 ml-7">
                Rata-rata 10-30 detik untuk text-to-design dan 20-60 detik untuk sketch-to-3D.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-slate-600 mr-2 mt-1 shrink-0" />
                Apakah hasil desain bisa diedit manual?
              </h3>
              <p className="text-gray-600 ml-7">
                Ya! Anda bisa ekspor file 3D (.obj) dan edit di software seperti Blender atau CLO 3D.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-slate-600 mr-2 mt-1 shrink-0" />
                Apakah ada paket gratis?
              </h3>
              <p className="text-gray-600 ml-7">
                Ya! Paket Free memberikan 10 desain per bulan. Cocok untuk mahasiswa atau UMKM pemula.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-slate-600 mr-2 mt-1 shrink-0" />
                Apakah desain saya aman dan privat?
              </h3>
              <p className="text-gray-600 ml-7">
                Tentu! Semua desain disimpan private di akun Anda. Kami tidak membagikan atau menggunakan desain untuk keperluan lain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-slate-700 py-10 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Siap Wujudkan Desain Impian Anda?
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-300">
            Bergabunglah dengan ratusan desainer dan UMKM yang sudah mempercepat proses kreatif mereka
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link to="/projects" className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-slate-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all">
              Mulai Gratis Sekarang <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-sm sm:text-base font-medium rounded-md text-white hover:bg-slate-600 transition-all">
              Lihat Paket Harga
            </Link>
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-slate-400">
            ✨ Tidak perlu kartu kredit • 10 desain gratis • Batalkan kapan saja
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
