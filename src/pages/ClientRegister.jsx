import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Mail, Lock, User, UserPlus, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export const ClientRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await registerAuth({ name, email, password });
      if (res && res.success) {
        toast.success('Account created! Welcome to LeadDesk Mini');
        navigate('/client/dashboard');
      } else {
        toast.error(res?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-950 p-4 transition-colors duration-300 relative overflow-hidden">
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-brand-600/25">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-800 dark:text-white tracking-tight">Create Client Account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Register to submit and track your lead inquiries</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

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
                placeholder="sarah@example.com"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Client Account</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-xs font-bold text-brand-600 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ClientRegister;
