import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  LayoutDashboard,
  Users,
  Search,
  Download,
  Filter,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import StatCard from '../components/StatCard';
import AnalyticsCharts from '../components/AnalyticsCharts';
import LeadsTable from '../components/LeadsTable';
import LeadDetailsModal from '../components/LeadDetailsModal';
import DeleteModal from '../components/DeleteModal';
import NotificationBell from '../components/NotificationBell';
import AIChatbot from '../components/AIChatbot';
import { UserTableRowSkeleton, StatCardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && ['dashboard', 'leads', 'users'].includes(tabFromUrl)) {
      return tabFromUrl;
    }
    const storedTab = sessionStorage.getItem('leaddesk_admin_tab');
    if (storedTab && ['dashboard', 'leads', 'users'].includes(storedTab)) {
      return storedTab;
    }
    return 'dashboard';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Data states
  const [leads, setLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    summary: { totalLeads: 0, newLeads: 0, contactedLeads: 0, closedLeads: 0 },
    statusDistribution: [],
    monthlyLeads: [],
  });
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Modal states
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Switch tab with immediate skeleton feedback and URL & sessionStorage persistence
  const handleTabSelect = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    sessionStorage.setItem('leaddesk_admin_tab', tab);

    // Sync tab to browser URL search parameter without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState(null, '', url.pathname + url.search);

    if (tab === 'dashboard' || tab === 'leads') {
      setLoading(true);
      fetchLeads();
      fetchStats();
    } else if (tab === 'users') {
      setUsersLoading(true);
      fetchUsers();
    }
  };

  // Fetch Stats Metrics
  const fetchStats = useCallback(async () => {
    try {
      const res = await leadService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Fetch leads with pagination & filter
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads({
        page: currentPage,
        limit: pageSize,
        status: statusFilter,
        q: searchQuery,
        sortBy: sortBy,
      });

      if (response.success) {
        setLeads(response.data || []);
        setTotalLeads(response.total || 0);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads list');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, searchQuery, sortBy]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await authService.getUsers();
      if (data && data.success) {
        setRegisteredUsers(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchLeads();
    fetchUsers();
  }, [fetchStats, fetchLeads, fetchUsers]);

  // Handle status update
  const handleStatusChange = async (leadId, newStatus) => {
    const targetLead = leads.find((l) => l._id === leadId);
    const previousStatus = targetLead ? targetLead.status : 'New';
    if (previousStatus === newStatus) return;

    // Optimistically update status in local state
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead._id === leadId) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }

    try {
      const response = await leadService.updateLead(leadId, { status: newStatus });
      if (response.success) {
        toast.success(`Lead status updated to ${newStatus}`);
        fetchStats();
      } else {
        // Revert to previous status if failed
        setLeads((prev) =>
          prev.map((l) => (l._id === leadId ? { ...l, status: previousStatus } : l))
        );
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead((prev) => ({ ...prev, status: previousStatus }));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update lead status');
      // Revert to previous status on error
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: previousStatus } : l))
      );
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead((prev) => ({ ...prev, status: previousStatus }));
      }
    }
  };

  // Handle user role change with immediate skeleton / spinner loading
  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin';
    setUpdatingUserId(userId);
    try {
      const response = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('leaddesk_token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(`User role changed to ${newRole}`);
        setRegisteredUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      console.error('Role update error:', err);
      toast.error('Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle lead deletion
  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    try {
      const response = await leadService.deleteLead(leadToDelete._id);
      if (response.success) {
        toast.success('Lead deleted permanently');
        setLeads((prev) => prev.filter((l) => l._id !== leadToDelete._id));
        setTotalLeads((prev) => Math.max(0, prev - 1));
        setIsDeleteOpen(false);
        setLeadToDelete(null);
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No lead records to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Budget', 'Status', 'Message', 'Created At'];
    const csvRows = [
      headers.join(','),
      ...leads.map((l) =>
        [
          `"${l._id}"`,
          `"${l.name.replace(/"/g, '""')}"`,
          `"${l.email}"`,
          `"${l.budget}"`,
          `"${l.status}"`,
          `"${l.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${new Date(l.createdAt).toLocaleString()}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaddesk-leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Leads exported to CSV spreadsheet');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-navy-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      {/* Mobile / Tablet Sidebar Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-72 bg-navy-900 border-r border-navy-800 flex flex-col justify-between p-6 z-50 md:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-lg font-extrabold text-white tracking-tight">LeadDesk</span>
                      <span className="text-[10px] font-extrabold tracking-widest text-brand-400 uppercase bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20 block mt-0.5">
                        ADMIN PORTAL
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-gray-400 hover:text-white bg-navy-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => handleTabSelect('dashboard')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === 'dashboard'
                        ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Overview</span>
                    </div>
                    {activeTab === 'dashboard' && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
                  </button>

                  <button
                    onClick={() => handleTabSelect('leads')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === 'leads'
                        ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5" />
                      <span>Leads Registry</span>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-navy-800 text-brand-400 border border-navy-700">
                      {totalLeads}
                    </span>
                  </button>

                  <button
                    onClick={() => handleTabSelect('users')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                      activeTab === 'users'
                        ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5" />
                      <span>User Roles</span>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-navy-800 text-brand-400 border border-navy-700">
                      {registeredUsers.length}
                    </span>
                  </button>
                </nav>
              </div>

              <div className="pt-6 border-t border-navy-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 border border-brand-400/30 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                      {user?.name ? user.name[0].toUpperCase() : 'A'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-extrabold text-white truncate">{user?.name || 'LeadDesk Admin'}</div>
                      <div className="text-[10px] font-semibold text-brand-400 truncate">{user?.email || 'admin@example.com'}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-navy-800/90 hover:bg-red-950/50 text-gray-300 hover:text-red-400 text-xs font-bold border border-navy-700 transition-all shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop / Tablet Sidebar */}
      <aside className="w-64 h-full bg-navy-900 border-r border-navy-800 hidden md:flex flex-col justify-between p-6 shrink-0 shadow-2xl relative z-20">
        <div>
          {/* Brand Logo Header */}
          <Link to="/admin" className="flex items-center space-x-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight group-hover:text-brand-300 transition-colors">
                LeadDesk
              </span>
              <span className="text-[10px] font-extrabold tracking-widest text-brand-400 uppercase bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20 block mt-0.5">
                ADMIN PORTAL
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => handleTabSelect('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </div>
              {activeTab === 'dashboard' && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
            </button>

            <button
              onClick={() => handleTabSelect('leads')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'leads'
                  ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span>Leads Registry</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-navy-800 text-brand-400 border border-navy-700">
                {totalLeads}
              </span>
            </button>

            <button
              onClick={() => handleTabSelect('users')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === 'users'
                  ? 'text-white bg-gradient-to-r from-brand-600 to-blue-600 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="w-5 h-5" />
                <span>User Roles</span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-navy-800 text-brand-400 border border-navy-700">
                {registeredUsers.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="pt-6 border-t border-navy-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 border border-brand-400/30 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-extrabold text-white truncate">{user?.name || 'LeadDesk Admin'}</div>
                <div className="text-[10px] font-semibold text-brand-400 truncate">{user?.email || 'admin@example.com'}</div>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-navy-800/90 hover:bg-red-950/50 text-gray-300 hover:text-red-400 text-xs font-bold border border-navy-700 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-navy-800 text-gray-700 dark:text-gray-200 hover:text-brand-600 border border-gray-200 dark:border-navy-700 transition-colors"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <h1 className="text-base sm:text-xl font-extrabold text-navy-800 dark:text-white tracking-tight truncate">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'leads' && 'Leads Management Registry'}
              {activeTab === 'users' && 'User Access & Role Control'}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {totalLeads} Total Leads
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <NotificationBell leads={leads} />
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 rounded-xl border border-gray-200 dark:border-navy-700 transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Stat Metric Cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </div>
              ) : (
                <StatCard stats={stats.summary} />
              )}

              {/* Recharts Data Visualization */}
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
              ) : (
                <AnalyticsCharts
                  statusDistribution={stats.statusDistribution}
                  monthlyLeads={stats.monthlyLeads}
                />
              )}
            </>
          )}

          {(activeTab === 'dashboard' || activeTab === 'leads') && (
            <>
              {/* Leads Table */}
              <LeadsTable
                leads={leads}
                loading={loading}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(st) => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                sortBy={sortBy}
                onSortChange={(sb) => setSortBy(sb)}
                onStatusChange={handleStatusChange}
                onViewDetails={(lead) => {
                  setSelectedLead(lead);
                  setIsDetailsOpen(true);
                }}
                onDeleteLead={(lead) => {
                  setLeadToDelete(lead);
                  setIsDeleteOpen(true);
                }}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 rounded-2xl">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Showing Page <span className="text-navy-800 dark:text-white font-bold">{currentPage}</span> of{' '}
                    <span className="text-navy-800 dark:text-white font-bold">{totalPages}</span> ({totalLeads} total records)
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className="p-2 rounded-xl border border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className="p-2 rounded-xl border border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy-800 dark:text-white">User Roles Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-navy-800 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Current Role</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-navy-800 text-sm">
                    {usersLoading ? (
                      Array.from({ length: 4 }).map((_, i) => <UserTableRowSkeleton key={i} />)
                    ) : registeredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400 font-semibold text-xs">
                          No registered users found.
                        </td>
                      </tr>
                    ) : (
                      registeredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors">
                          <td className="py-3 px-4 font-bold text-navy-800 dark:text-white">{u.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              disabled={updatingUserId === u._id}
                              onClick={() => handleRoleToggle(u._id, u.role)}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800 disabled:opacity-50 transition-all"
                            >
                              <span>Switch to {u.role === 'admin' ? 'Client' : 'Admin'}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        lead={selectedLead}
        onStatusChange={handleStatusChange}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead Record"
        message={`Are you sure you want to permanently delete lead inquiry from ${leadToDelete?.name || 'this customer'}?`}
      />
      <AIChatbot onLeadCaptured={fetchLeads} />
    </div>
  );
};

export default AdminDashboard;
