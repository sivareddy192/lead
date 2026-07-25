import React, { useState, useEffect } from 'react';
import { X, Calendar, Mail, User, Phone, DollarSign, MessageSquare, Tag, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';

export const LeadDetailsModal = ({ lead, isOpen, onClose, onUpdateSuccess, onStatusChange, readOnly = false }) => {
  if (!isOpen || !lead) return null;

  const [currentStatus, setCurrentStatus] = useState(lead.status || 'New');
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState(lead.notes || []);
  const [newNoteText, setNewNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (lead) {
      setCurrentStatus(lead.status || 'New');
      setNotes(lead.notes || []);
    }
  }, [lead]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);

    // If parent handler exists, delegate to parent to avoid duplicate API calls
    if (onStatusChange) {
      onStatusChange(lead._id, newStatus);
      return;
    }

    setUpdating(true);
    try {
      const response = await leadService.updateLead(lead._id, { status: newStatus });
      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        if (onUpdateSuccess) {
          onUpdateSuccess(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
      setCurrentStatus(lead.status);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Contacted':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Closed':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-navy-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              {lead.name ? lead.name.charAt(0).toUpperCase() : 'L'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-800 dark:text-white">Lead Details</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">ID: {lead._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Status Selector Header */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-navy-800/80 border border-gray-200/80 dark:border-navy-700/80">
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <Tag className="w-4 h-4 text-brand-500" />
              <span>Current Lifecycle Stage:</span>
            </div>
            <div className="relative flex items-center space-x-2">
              {readOnly ? (
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusBadge(currentStatus)}`}>
                  ● {currentStatus}
                </span>
              ) : (
                <select
                  value={currentStatus}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer ${getStatusBadge(
                    currentStatus
                  )}`}
                >
                  <option
                    value="New"
                    disabled={currentStatus === 'Contacted' || currentStatus === 'Closed'}
                    className={(currentStatus === 'Contacted' || currentStatus === 'Closed') ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 dark:bg-navy-800 dark:text-gray-500' : ''}
                  >
                    New {(currentStatus === 'Contacted' || currentStatus === 'Closed') ? '(Blocked)' : ''}
                  </option>
                  <option
                    value="Contacted"
                    disabled={currentStatus === 'Closed'}
                    className={currentStatus === 'Closed' ? 'cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 dark:bg-navy-800 dark:text-gray-500' : ''}
                  >
                    Contacted {currentStatus === 'Closed' ? '(Blocked)' : ''}
                  </option>
                  <option value="Closed">Closed</option>
                </select>
              )}
            </div>
          </div>

          {/* Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-800">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-semibold text-navy-800 dark:text-white">{lead.name}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-800">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Mail className="w-3.5 h-3.5 text-brand-500" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-semibold text-navy-800 dark:text-white truncate">{lead.email}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-800">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Phone className="w-3.5 h-3.5 text-brand-500" />
                <span>Phone Number</span>
              </div>
              <p className="text-sm font-semibold text-navy-800 dark:text-white truncate">{lead.phone || 'N/A'}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-800">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                <span>Budget Range</span>
              </div>
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{lead.budget}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50/60 dark:bg-navy-800/40 border border-gray-100 dark:border-navy-800">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                <span>Submitted Date</span>
              </div>
              <p className="text-sm font-semibold text-navy-800 dark:text-white">
                {new Date(lead.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Message Text */}
          <div className="p-4 rounded-xl bg-gray-50/80 dark:bg-navy-800/60 border border-gray-100 dark:border-navy-800">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-brand-500" />
              <span>Customer Message</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {lead.message}
            </p>
          </div>

          {/* Internal Notes & Timeline Section */}
          {!readOnly && (
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-navy-800/80 border border-gray-200/80 dark:border-navy-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-800 dark:text-white">
                  <Tag className="w-4 h-4 text-brand-500" />
                  <span>Internal Admin Notes ({notes.length})</span>
                </div>
              </div>

              {/* Existing Notes List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No internal notes added yet.</p>
                ) : (
                  notes.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-bold text-brand-600 dark:text-brand-400">{n.author || 'Admin'}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newNoteText.trim() || submittingNote) return;
                  setSubmittingNote(true);
                  try {
                    const res = await leadService.addNote(lead._id, { text: newNoteText.trim() });
                    if (res.success) {
                      toast.success('Internal note added');
                      setNotes((prev) => [...prev, { text: newNoteText.trim(), author: 'Admin', createdAt: new Date() }]);
                      setNewNoteText('');
                    }
                  } catch (err) {
                    toast.error('Failed to add note');
                  } finally {
                    setSubmittingNote(false);
                  }
                }}
                className="flex items-center space-x-2 pt-2"
              >
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add internal note (e.g. Called client, scheduled demo)..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim() || submittingNote}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/50 dark:bg-navy-950/40 border-t border-gray-100 dark:border-navy-800 flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-200 dark:bg-navy-800 hover:bg-gray-300 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
