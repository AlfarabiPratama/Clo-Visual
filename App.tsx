import React, { Suspense, lazy } from 'react';
import Navbar, { HashRouter as Router, Routes, Route, useLocation } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Instagram, MessageCircle, Mail, Phone } from 'lucide-react';

// Lazy load pages untuk memecah bundle besar
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DesignerPage = lazy(() => import('./pages/DesignerPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Enhanced Footer Component
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1">
          <div className="flex items-center mb-4">
            <div className="bg-slate-600 text-white px-2 py-1 rounded font-bold text-sm">CLO</div>
            <span className="ml-2 font-bold text-white">Clo Visual</span>
          </div>
          <p className="text-sm text-gray-400">
            Platform AI untuk desain fashion 3D yang cepat dan mudah.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#/" className="hover:text-white transition-colors">Beranda</a></li>
            <li><a href="#/projects" className="hover:text-white transition-colors">Desain Saya</a></li>
            <li><a href="#/pricing" className="hover:text-white transition-colors">Harga</a></li>
            <li><a href="#/designer" className="hover:text-white transition-colors">AI Designer</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Bantuan</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Dokumentasi</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Tutorial</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
          <div className="space-y-3 text-sm">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp CS
            </a>
            <a href="mailto:support@clovisual.com" className="flex items-center hover:text-white transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              support@clovisual.com
            </a>
            <a href="tel:+6281234567890" className="flex items-center hover:text-white transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              +62 812-3456-7890
            </a>
          </div>
          
          {/* Social Media */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3 text-sm">Ikuti Kami</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/clovisual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="mailto:hello@clovisual.com" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          &copy; 2025 Clo Visual. University Startup Prototype - Bisnis Digital
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Terms</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Privacy</a>
          <a href="#" className="text-sm text-gray-500 hover:text-gray-400">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

const AppContent: React.FC = () => {
  const location = useLocation();
  // Don't show navbar and footer on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  // Don't show footer on the designer page to maximize workspace
  const showFooter = location.pathname !== '/designer' && !isAuthPage;

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<div className="p-10 text-center text-sm text-gray-500">Memuat halaman...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/designer" 
              element={
                <ProtectedRoute>
                  <DesignerPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;