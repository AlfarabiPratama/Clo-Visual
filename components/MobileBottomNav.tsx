import React from 'react';
import { Home, Box, DollarSign, User, Info } from 'lucide-react';
import { Link, useLocation } from './Navbar';
import { useAuth } from '../contexts/AuthContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const currentPath = location.pathname;

  // Don't show bottom nav on designer page (needs full screen)
  if (currentPath === '/designer' || currentPath === '/login' || currentPath === '/register') {
    return null;
  }

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
      show: true
    },
    {
      path: '/projects',
      icon: Box,
      label: 'Projects',
      show: true
    },
    {
      path: '/pricing',
      icon: DollarSign,
      label: 'Pricing',
      show: true
    },
    {
      path: '/about',
      icon: Info,
      label: 'About',
      show: true
    },
    {
      path: isAuthenticated ? '/settings' : '/login',
      icon: User,
      label: isAuthenticated ? 'Profile' : 'Login',
      show: true
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          if (!item.show) return null;
          
          const isActive = currentPath === item.path || 
                          (item.path === '/' && currentPath === '/') ||
                          (item.path === '/projects' && currentPath.startsWith('/projects'));
          
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center gap-1 transition-colors
                ${isActive 
                  ? 'text-slate-600 bg-slate-50' 
                  : 'text-gray-500 hover:text-slate-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
