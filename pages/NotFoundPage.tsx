import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Link } from '../components/Navbar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-6 sm:mb-8">
          <div className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-slate-200 mb-4">404</div>
          <div className="flex justify-center items-center space-x-4 mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center animate-bounce">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
          Oops! Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
          Sepertinya halaman yang Anda cari sedang dalam proses design. Mungkin desainnya terlalu avant-garde sampai belum jadi! 👗✨
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Yang Bisa Anda Lakukan:</h2>
          <ul className="space-y-2 sm:space-y-3 text-left text-gray-600 text-xs sm:text-sm md:text-base">
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-1">•</span>
              Cek kembali URL yang Anda ketik
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-1">•</span>
              Kembali ke halaman sebelumnya
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-1">•</span>
              Mulai desain baru di dashboard
            </li>
            <li className="flex items-start">
              <span className="text-slate-600 mr-2 mt-1">•</span>
              Hubungi support jika masalah berlanjut
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-600 text-slate-700 rounded-md font-medium text-sm sm:text-base hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Kembali
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-slate-600 text-white rounded-md font-medium text-sm sm:text-base hover:bg-slate-700 transition-colors"
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Ke Halaman Utama
          </Link>
          
          <Link
            to="/projects"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-md font-medium hover:from-slate-700 hover:to-slate-800 transition-colors shadow-lg"
          >
            Mulai Desain Baru
          </Link>
        </div>

        {/* Fun Quote */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 italic">
            "In fashion, there are no mistakes—only happy accidents. But this 404 is definitely a mistake." 😄
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
