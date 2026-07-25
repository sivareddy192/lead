import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <LeadForm />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default LandingPage;
