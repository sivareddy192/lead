import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layers, LogOut, Plus, Clock, CheckCircle2, PhoneCall, Inbox, RefreshCw, Send, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import leadService from '../services/leadService';
import ThemeToggle from '../components/ThemeToggle';
import LeadForm from '../components/LeadForm';
import LeadDetailsModal from '../components/LeadDetailsModal';
import NotificationBell from '../components/NotificationBell';
import AIChatbot from '../components/AIChatbot';
import { BoxCardSkeleton } from '../components/SkeletonLoader';

export const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [myLeads, setMyLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchMyLeads = async () => {
    setLoading(true);
    try {
      const res = await leadService.getMyLeads();
      if (res.success) {
        setMyLeads(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch my leads:', error);
      toast.error('Failed to load your lead inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeads();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Contacted':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Closed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Top Client Portal Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-navy-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-navy-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold text-navy-800 dark:text-white tracking-tight">
            LeadDesk <span className="text-brand-600 dark:text-brand-400">Client Portal</span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-navy-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Role: Client</span>
          </div>
          <NotificationBell leads={myLeads} />
          <ThemeToggle />
          <button
            onClick={logout}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Client Portal</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Welcome, {user?.name || 'Valued Client'}!</h2>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Track the status of your submitted inquiries, communicate with our CRM team, and submit new project requests.
            </p>
          </div>
        </div>

        {/* Inquiries Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-navy-800 dark:text-white">Your Submitted Inquiries</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Track lifecycle stage: New → Contacted → Closed</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchMyLeads}
              className="p-2.5 rounded-xl bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-colors"
              title="Refresh Inquiries"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFormModal(!showFormModal)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Inquiry</span>
            </button>
          </div>
        </div>

        {/* Modal / Collapsible Form */}
        {showFormModal && (
          <div className="p-6 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-navy-800 dark:text-white">New Lead Request</h4>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <LeadForm />
          </div>
        )}

        {/* Inquiries Cards List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BoxCardSkeleton />
            <BoxCardSkeleton />
            <BoxCardSkeleton />
            <BoxCardSkeleton />
          </div>
        ) : myLeads.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-navy-800 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-navy-800 dark:text-white">No Inquiries Found</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
              You haven't submitted any lead requests under your account email ({user?.email}) yet.
            </p>
            <button
              onClick={() => setShowFormModal(true)}
              className="mt-4 px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Submit First Inquiry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {myLeads.map((lead) => (
              <div
                key={lead._id}
                onClick={() => {
                  setSelectedLead(lead);
                  setIsDetailsOpen(true);
                }}
                className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-md hover:border-brand-500/40 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-navy-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{lead.budget}</span>
                    <h4 className="text-base font-bold text-navy-800 dark:text-white group-hover:text-brand-600 transition-colors">
                      {lead.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(lead.status)}`}>
                      ● {lead.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                        setIsDetailsOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-gray-100 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-700 transition-all"
                      title="View Lead Details"
                    >
                      <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{lead.message}"
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Popup Modal */}
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        readOnly={true}
      />
      <AIChatbot onLeadCaptured={fetchMyLeads} />
    </div>
  );
};

export default ClientDashboard;
