import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Mail, Lock, LogIn, Loader2, ArrowLeft, Shield, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/client/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      if (res.success && res.data) {
        const userRole = res.data.role;
        toast.success(`Welcome back, ${res.data.name}!`);

        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/client/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@example.com');
    setPassword('Admin@123');
    toast('Demo Admin credentials filled (admin@example.com)', { icon: '🛡️' });
  };

  const fillClientCredentials = () => {
    setEmail('client@example.com');
    setPassword('client123');
    toast('Demo Client credentials filled', { icon: '👤' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-950 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-600/25">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-800 dark:text-white tracking-tight">Sign In</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Access your LeadDesk Mini CRM account</p>
        </div>

        {/* Fast Demo Autofill */}
        <div className="mb-6 p-3 rounded-2xl bg-gray-50 dark:bg-navy-800/80 border border-gray-200/80 dark:border-navy-700 space-y-2">
          <div className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 text-center">Fast Demo Testing Autofill:</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex-1 py-1.5 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center space-x-1 hover:bg-brand-100 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Demo Admin</span>
            </button>
            <button
              type="button"
              onClick={fillClientCredentials}
              className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1 hover:bg-emerald-100 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Demo Client</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">Need a Client account? </span>
            <Link to="/register" className="text-xs font-bold text-brand-600 hover:underline">
              Register Here
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
