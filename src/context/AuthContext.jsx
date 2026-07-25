import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { PageSkeleton } from '../components/SkeletonLoader';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('leaddesk_token');
      const cachedUser = authService.getCurrentUser();

      if (token && cachedUser) {
        setUser(cachedUser);
        try {
          const profileRes = await authService.fetchProfile();
          if (profileRes && profileRes.success && profileRes.data) {
            const updatedUser = { ...cachedUser, ...profileRes.data };
            setUser(updatedUser);
            localStorage.setItem('leaddesk_user', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.log('[AuthContext] Profile verification notice:', error.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {loading ? <PageSkeleton /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
