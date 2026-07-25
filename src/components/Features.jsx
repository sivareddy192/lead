import React from 'react';
import { motion } from 'framer-motion';
import { Database, LayoutDashboard, Search, Activity } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Lead Capture',
    description: 'Store customer inquiries securely.',
    badge: 'Real-time Storage',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Manage every lead in one place.',
    badge: 'Unified CRM',
    color: 'from-brand-600 to-blue-400',
  },
  {
    icon: Search,
    title: 'Search',
    description: 'Quickly find any customer.',
    badge: 'Instant Debounce',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Activity,
    title: 'Status Tracking',
    description: 'Track New, Contacted, Closed.',
    badge: 'Lifecycle Control',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-100/60 dark:bg-navy-900/40 border-y border-gray-200/80 dark:border-navy-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Capabilities & Power
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 dark:text-white mt-2 tracking-tight">
            Designed for Speed, Simplicity & Impact
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Everything your team needs to capture, analyze, and convert incoming leads efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-navy-800/90 border border-gray-200/80 dark:border-navy-700/80 shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-navy-800 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
