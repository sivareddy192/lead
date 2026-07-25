import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, CheckCircle, User, Mail, Phone, DollarSign, MessageSquare } from 'lucide-react';
import leadService from '../services/leadService';

export const LeadForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      budget: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await leadService.createLead(data);
      if (response.success) {
        toast.success('Lead submitted successfully!');
        setSubmittedSuccess(true);
        reset();
        setTimeout(() => setSubmittedSuccess(false), 5000);
      } else {
        toast.error(response.message || 'Failed to submit lead');
      }
    } catch (error) {
      console.error('Lead Submission Error:', error);
      const errMsg = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            Contact Us & Inquiry
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-800 dark:text-white mt-2 tracking-tight">
            Ready to Accelerate Your Business?
          </h2>
          <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
            Submit your details below and our team will get back to you promptly.
          </p>
        </div>

        <div className="relative rounded-3xl p-6 sm:p-10 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 shadow-2xl backdrop-blur-xl">
          {submittedSuccess && (
            <div className="mb-8 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-emerald-800 dark:text-emerald-300">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Submission Received!</h4>
                <p className="text-xs mt-0.5">Thank you! Your lead inquiry has been stored securely in LeadDesk Mini.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register('name', {
                      required: 'Full Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-gray-200 dark:border-navy-700 focus:border-brand-500 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register('email', {
                      required: 'Email Address is required',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Please enter a valid email address',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border text-sm transition-all focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/30'
                        : 'border-gray-200 dark:border-navy-700 focus:border-brand-500 focus:ring-brand-500/20'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-sm transition-all focus:outline-none focus:ring-2 focus:border-brand-500 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Budget Range Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget Range <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <select
                  {...register('budget', {
                    required: 'Please select a budget range',
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.budget
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-navy-700 focus:border-brand-500 focus:ring-brand-500/20'
                  }`}
                >
                  <option value="">Choose Budget</option>
                  <option value="< $1000">&lt; $1000</option>
                  <option value="$1000-$5000">$1000-$5000</option>
                  <option value="$5000-$10000">$5000-$10000</option>
                  <option value="> $10000">&gt; $10000</option>
                </select>
              </div>
              {errors.budget && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.budget.message}</p>
              )}
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-gray-400 pointer-events-none">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project requirements or questions..."
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters long',
                    },
                  })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500/30'
                      : 'border-gray-200 dark:border-navy-700 focus:border-brand-500 focus:ring-brand-500/20'
                  }`}
                ></textarea>
              </div>
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.message.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-600/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>Submitting Lead...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Lead</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
