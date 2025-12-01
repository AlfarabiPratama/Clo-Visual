import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize demo user on first load
  useEffect(() => {
    const storedUsers = localStorage.getItem('clo_visual_users');
    if (!storedUsers) {
      // Create demo user for presentation
      const demoUsers = [
        {
          email: 'demo@clovisual.com',
          password: 'demo123',
          name: 'Demo User',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Demo User',
        },
      ];
      localStorage.setItem('clo_visual_users', JSON.stringify(demoUsers));
    }
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('clo_visual_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('clo_visual_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get stored users from localStorage
    const storedUsers = localStorage.getItem('clo_visual_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Find user
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
        avatar: foundUser.avatar,
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('clo_visual_user', JSON.stringify(userData));
      return true;
    }

    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get stored users from localStorage
    const storedUsers = localStorage.getItem('clo_visual_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return false; // Email already exists
    }

    // Add new user
    const newUser = {
      email,
      password, // In real app, this should be hashed!
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
    };
    users.push(newUser);
    localStorage.setItem('clo_visual_users', JSON.stringify(users));

    // Auto login after registration
    const userData: User = {
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('clo_visual_user', JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('clo_visual_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
