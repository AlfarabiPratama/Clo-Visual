import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Link } from '../components/Navbar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-extrabold text-slate-200 mb-4">404</div>
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center animate-bounce">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Halaman Tidak Ditemukan
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sepertinya halaman yang Anda cari sedang dalam proses design. Mungkin desainnya terlalu avant-garde sampai belum jadi! 👗✨
        </p>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yang Bisa Anda Lakukan:</h2>
          <ul className="space-y-3 text-left text-gray-600">
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
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-600 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali
          </button>
          
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-600 text-white rounded-md font-medium hover:bg-slate-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
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
