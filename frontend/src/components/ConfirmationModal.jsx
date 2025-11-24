import React from 'react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
  isLoading = false
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-purple-500/20 p-8 max-w-md w-full mx-4 transform transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {title}
          </h2>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${confirmButtonClass}`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}