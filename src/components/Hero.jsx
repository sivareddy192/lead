import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export const Hero = () => {
  const scrollToForm = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-brand-600/15 via-blue-500/10 to-indigo-600/15 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 mb-6"
          >
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-pulse" />
            <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 tracking-wide uppercase">
              Next-Gen MERN Lead Management CRM
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-800 dark:text-white leading-[1.15]"
          >
            Grow Your Business With{' '}
            <span className="bg-gradient-to-r from-brand-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              LeadDesk Mini
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-2xl text-gray-600 dark:text-gray-300 font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Capture leads effortlessly and manage them from one secure dashboard.
          </motion.p>

          {/* Action Buttons: Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-2xl shadow-lg shadow-brand-600/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real-time Lead Capture</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>JWT Admin Auth</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Lifecycle Tracking</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Product Mock Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 max-w-5xl mx-auto relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-gray-200/60 to-gray-300/30 dark:from-navy-800/80 dark:to-navy-900/60 border border-gray-200 dark:border-navy-700 shadow-2xl backdrop-blur-xl"
        >
          <div className="rounded-2xl bg-white dark:bg-navy-900 p-4 sm:p-6 shadow-inner overflow-hidden border border-gray-100 dark:border-navy-800">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-800 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-gray-400 dark:text-gray-500 hidden sm:inline">leaddesk-mini-crm.app</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  ● MERN Stack Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-700/60">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Inquiries</div>
                <div className="text-2xl font-bold text-navy-800 dark:text-white mt-1">128</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">↑ +24% this week</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-700/60">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Leads</div>
                <div className="text-2xl font-bold text-navy-800 dark:text-white mt-1">42</div>
                <div className="text-xs text-brand-600 font-semibold mt-1">Needs attention</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-700/60">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Conversion Rate</div>
                <div className="text-2xl font-bold text-navy-800 dark:text-white mt-1">68.4%</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">Closed successfully</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
