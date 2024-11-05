import React from 'react';

export const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, type = 'task' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">
          {type === 'task' ? 'Delete Task' : 'Delete Completed Tasks'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {type === 'task' 
            ? 'Are you sure you want to delete this task? This action cannot be undone.'
            : 'Are you sure you want to delete all completed tasks? This action cannot be undone.'}
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};