import React, { Suspense, lazy } from 'react';
import Navbar, { HashRouter as Router, Routes, Route, useLocation } from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages untuk memecah bundle besar
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DesignerPage = lazy(() => import('./pages/DesignerPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

// Simple Footer Component
const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
      <div className="flex justify-center space-x-6 md:order-2">
        <a href="#" className="text-gray-400 hover:text-gray-500">Privacy</a>
        <a href="#" className="text-gray-400 hover:text-gray-500">Terms</a>
        <a href="#" className="text-gray-400 hover:text-gray-500">Contact</a>
      </div>
      <div className="mt-8 md:mt-0 md:order-1">
        <p className="text-center text-base text-gray-400">
          &copy; 2025 Clo Visual. University Startup Prototype for Sistem Kecerdasan Buatan
        </p>
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