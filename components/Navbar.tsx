import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shirt, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CloLogo from './CloLogo';

// --- Minimal Router Implementation (Polyfill for react-router-dom) ---
interface RouterContextType {
  currentPath: string;
  navigate: (to: string, options?: { state?: any }) => void;
  state: any;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  state: null,
});

export const HashRouter: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string, options?: { state?: any }) => {
    if (options?.state) {
      setState(options.state);
    }
    window.location.hash = to;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, state }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes: React.FC<{children: ReactNode}> = ({ children }) => {
  const { currentPath } = useContext(RouterContext);
  let matchedChild: ReactNode = null;
  
  React.Children.forEach(children, (child) => {
    if (matchedChild) return;
    if (React.isValidElement(child)) {
      const props = child.props as any;
      if (props.path === currentPath) {
        matchedChild = child;
      }
    }
  });
  
  return <>{matchedChild}</>;
};

export const Route: React.FC<{path: string, element: ReactNode}> = ({ element }) => {
  return <>{element}</>;
};

export const Link: React.FC<{to: string, className?: string, children: ReactNode, onClick?: () => void, state?: any}> = ({ to, className, children, onClick, state }) => {
  const { navigate } = useContext(RouterContext);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to, { state });
  };
  
  const href = to.startsWith('/') ? '#' + to : '#' + '/' + to;

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export const useLocation = () => {
  const { currentPath, state } = useContext(RouterContext);
  return { pathname: currentPath, state };
};

export const useNavigate = () => {
  const { navigate } = useContext(RouterContext);
  return navigate;
};
// --- End Router Implementation ---

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const isActive = (path: string) => location.pathname === path ? 'text-slate-600 font-semibold' : 'text-gray-600 hover:text-slate-600';

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <CloLogo size={36} />
              <span className="font-bold text-xl tracking-tight text-gray-900">Clo Visual</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/projects" className={isActive('/projects')}>Projects</Link>
            <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <div className="text-gray-400">|</div>
            
            {isAuthenticated && user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-slate-600 text-sm font-medium">
                  Masuk
                </Link>
                <Link to="/register" className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50">Home</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50">Projects</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50">Pricing</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50">About</Link>
            
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 border-t border-gray-100 mt-2">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link 
                  to="/settings" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-slate-600 hover:bg-gray-50">Masuk</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-slate-600 text-white hover:bg-slate-700">Daftar Gratis</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;