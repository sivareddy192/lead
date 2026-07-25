import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, LayoutDashboard, LogIn, Menu, X, LogOut, UserCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-navy-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-navy-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-navy-800 dark:text-white tracking-tight">
              LeadDesk <span className="text-brand-600 dark:text-brand-400">Mini</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Desktop Right Action Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/client/dashboard'}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {user?.role === 'admin' ? (
                    <>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Client Portal</span>
                    </>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-navy-700"
                >
                  <LogIn className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-navy-800 bg-white dark:bg-navy-900 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left text-base font-medium text-gray-700 dark:text-gray-200 py-2 hover:text-brand-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-base font-medium text-gray-700 dark:text-gray-200 py-2 hover:text-brand-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              className="text-left text-base font-medium text-gray-700 dark:text-gray-200 py-2 hover:text-brand-600"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left text-base font-medium text-gray-700 dark:text-gray-200 py-2 hover:text-brand-600"
            >
              Contact
            </button>

            {isAuthenticated ? (
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/client/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl"
                >
                  <span>{user?.role === 'admin' ? 'Go to Dashboard' : 'Client Portal'}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-navy-800 rounded-xl"
              >
                <LogIn className="w-4 h-4 text-brand-600" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
