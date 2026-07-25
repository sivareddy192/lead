import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-navy-950 p-4 transition-colors duration-300">
      <div className="text-center max-w-md bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-navy-800 dark:text-white">404</h1>
        <h2 className="text-xl font-bold text-navy-800 dark:text-white mt-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-600/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to LeadDesk Mini</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
