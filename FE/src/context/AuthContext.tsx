import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { deleteAdmin as deleteAdminAPI, getMe, logoutAdmin, signinAdmin } from '../api/auth';

type Admin = {
  id: number;
  name: string | null;
  email: string;
  role: string;
};

interface AuthContextType {
  user: Admin | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getMe();
        setUser(response);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    const response = await signinAdmin({ email, password });
    setUser(response);
  };

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const response = await getMe();
      setUser(response);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const deleteAdmin = async (id: number) => {
    await deleteAdminAPI(id);
    // If deleted user is the current user, clear state
    if (user?.id === id) {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signin,
    logout,
    getCurrentUser,
    deleteAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
