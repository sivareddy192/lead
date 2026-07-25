import React from 'react';
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, deleting, leadName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-navy-800 dark:text-white">Delete Lead Permanently?</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
          Are you sure you want to delete lead <strong className="text-navy-800 dark:text-white">{leadName}</strong>? This action cannot be undone and will erase all inquiry record history.
        </p>

        <div className="mt-8 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/20 transition-all duration-200 disabled:opacity-75"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Lead</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
