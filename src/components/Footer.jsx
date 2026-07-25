import React from 'react';
import { Layers, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-navy-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              LeadDesk <span className="text-brand-600 dark:text-brand-500">Mini</span>
            </span>
          </div>

          {/* Exact Required Credit Line */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
            Built for{' '}
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline transition-colors"
            >
              Digital Heroes
            </a>{' '}
            Training Task
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} LeadDesk Mini. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
