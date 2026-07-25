import React from 'react';
import { motion } from 'framer-motion';
import { Send, Database, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Submit Inquiry',
    description: 'Prospective clients enter their name, email, budget range, and project requirements on the public lead capture form.',
    icon: Send,
    color: 'from-blue-500 to-brand-600',
  },
  {
    step: '02',
    title: 'Secure MongoDB Storage',
    description: 'The Express API validates input, hashes security metadata, and stores the lead inquiry under the "New" lifecycle stage.',
    icon: Database,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    step: '03',
    title: 'Track & Convert',
    description: 'Admins manage inquiries via live search, status updates (New → Contacted → Closed), analytics charts, and CSV exports.',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-600',
  },
];

export const HowItWorks = () => {
  return (
    <section id="workflow" className="py-20 bg-white dark:bg-navy-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Seamless CRM Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 dark:text-white mt-2 tracking-tight">
            How LeadDesk Mini Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            From lead capture to final conversion in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative p-8 rounded-3xl bg-gray-50 dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black bg-gradient-to-r from-brand-600 to-blue-400 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-navy-800 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
