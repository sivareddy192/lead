import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { TableRowSkeleton } from './SkeletonLoader';
import leadService from '../services/leadService';

export const LeadsTable = ({
  leads = [],
  loading = false,
  total = 0,
  page = 1,
  pages = 1,
  searchQuery = '',
  onSearchChange,
  statusFilter = 'All',
  onStatusFilterChange,
  sortBy = 'newest',
  onSortChange,
  dateRange = 'all',
  onDateRangeChange,
  onPageChange,
  onRowClick,
  onViewDetails,
  onStatusUpdate,
  onStatusChange,
  onDeleteClick,
  onDeleteLead,
}) => {
  const [updatingId, setUpdatingId] = useState(null);

  // Status Change directly from inline table dropdown
  const handleInlineStatusChange = async (e, lead) => {
    e.stopPropagation();
    if (updatingId === lead._id) return;
    const newStatus = e.target.value;
    const previousStatus = lead.status || 'New';
    if (newStatus === previousStatus) return;

    // Block backward progression (e.g. Contacted -> New or Closed -> Contacted/New)
    if (
      (previousStatus === 'Contacted' && newStatus === 'New') ||
      (previousStatus === 'Closed' && (newStatus === 'New' || newStatus === 'Contacted'))
    ) {
      toast.error(`Cannot revert status from ${previousStatus} back to ${newStatus} (Stage Blocked)`);
      e.target.value = previousStatus;
      return;
    }

    // If parent handler exists, delegate to parent to avoid duplicate API calls
    if (onStatusChange) {
      onStatusChange(lead._id, newStatus);
      return;
    }

    setUpdatingId(lead._id);
    try {
      const res = await leadService.updateLead(lead._id, { status: newStatus });
      if (res.success) {
        toast.success(`Updated status for ${lead.name} to ${newStatus}`);
        if (onStatusUpdate) {
          onStatusUpdate(res.data);
        }
      } else {
        e.target.value = previousStatus;
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update status');
      e.target.value = previousStatus;
    } finally {
      setUpdatingId(null);
    }
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (!leads || leads.length === 0) {
      toast.error('No leads available to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Budget', 'Message', 'Status', 'Submitted Date'];
    const csvRows = [headers.join(',')];

    leads.forEach((l) => {
      const row = [
        `"${l._id}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.budget || '').replace(/"/g, '""')}"`,
        `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${l.status || 'New'}"`,
        `"${new Date(l.createdAt).toLocaleString()}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadDesk_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV Export downloaded successfully');
  };

  const getStatusBadgeStyle = (status) => {
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
    <div className="bg-white dark:bg-navy-900 rounded-3xl border border-gray-200/80 dark:border-navy-800 shadow-xl overflow-hidden transition-colors duration-300">
      {/* Controls Bar: Search, Filter, Sort, CSV */}
      <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, budget, message..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white border border-gray-200 dark:border-navy-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Filter, Sort & Export Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Dropdown */}
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange && onStatusFilterChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Date Range Dropdown */}
          <div className="flex items-center space-x-1 bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl px-3 py-1.5">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
          </div>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all border border-gray-200 dark:border-navy-700"
            title="Export filtered leads to CSV"
          >
            <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-navy-800 text-xs font-extrabold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-navy-950/40">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Phone</th>
              <th className="py-4 px-6">Budget</th>
              <th className="py-4 px-6">Message</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-navy-800/60 text-xs font-medium">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-navy-800 dark:text-white">No Leads Found</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      No customer leads match your current filter or search criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const isContacted = lead.status === 'Contacted';
                const isClosed = lead.status === 'Closed';
                return (
                  <tr
                    key={lead._id}
                    onClick={() => {
                      const handler = onViewDetails || onRowClick;
                      if (handler) handler(lead);
                    }}
                    className="hover:bg-gray-50/80 dark:hover:bg-navy-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-navy-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {lead.name}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-medium text-gray-600 dark:text-gray-300">
                      {lead.email}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-medium text-gray-600 dark:text-gray-300">
                      {lead.phone || '-'}
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-6 font-semibold text-brand-600 dark:text-brand-400">
                      {lead.budget}
                    </td>

                    {/* Message snippet */}
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {lead.message}
                    </td>

                    {/* Status Toggle Dropdown */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-flex items-center space-x-1">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleInlineStatusChange(e, lead)}
                          disabled={updatingId === lead._id}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border transition-all focus:outline-none cursor-pointer ${getStatusBadgeStyle(
                            lead.status
                          )}`}
                        >
                          <option
                            value="New"
                            disabled={isContacted || isClosed}
                            className={isContacted || isClosed ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 dark:bg-navy-800 dark:text-gray-500' : ''}
                          >
                            New {(isContacted || isClosed) ? '(Blocked)' : ''}
                          </option>
                          <option
                            value="Contacted"
                            disabled={isClosed}
                            className={isClosed ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 dark:bg-navy-800 dark:text-gray-500' : ''}
                          >
                            Contacted {isClosed ? '(Blocked)' : ''}
                          </option>
                          <option value="Closed">
                            Closed
                          </option>
                        </select>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            const handler = onViewDetails || onRowClick;
                            if (handler) handler(lead);
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-700 transition-all hover:scale-105"
                          title="View Full Lead Details"
                        >
                          <Eye className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </button>
                        <button
                          onClick={() => {
                            const handler = onDeleteLead || onDeleteClick;
                            if (handler) handler(lead);
                          }}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-navy-800 border border-gray-200 dark:border-navy-700 transition-all hover:scale-105"
                          title="Delete lead"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pages > 1 && (
        <div className="p-4 border-t border-gray-100 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="font-bold text-navy-800 dark:text-white">{leads.length}</span> of{' '}
            <span className="font-bold text-navy-800 dark:text-white">{total}</span> total leads
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(page - 1)}
              disabled={page <= 1 || loading}
              className="p-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-gray-600 dark:text-gray-300 font-bold px-2">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(page + 1)}
              disabled={page >= pages || loading}
              className="p-2 rounded-xl border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
