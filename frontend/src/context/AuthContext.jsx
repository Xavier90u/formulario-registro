import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getProfile();
        if (res.success) {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message);
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success) return res.data;
    throw new Error(res.message);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isCompanyAdmin = user?.role === 'company_admin';
  const isSuperAdmin = user?.role === 'superadmin';
  const isStaff = user?.role === 'company_staff';
  const isCustomer = user?.role === 'customer';
  const hasCompany = !!user?.companyId;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isCompanyAdmin, isSuperAdmin, isStaff, isCustomer, hasCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, loading: true, login: async () => {}, register: async () => {}, logout: () => {}, isCompanyAdmin: false, isSuperAdmin: false, isStaff: false, isCustomer: false, hasCompany: false };
  }
  return context;
}
