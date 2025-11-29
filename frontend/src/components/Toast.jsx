import React, { useEffect } from 'react';

export default function Toast({ id, type = 'info', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          border: 'border-green-500 dark:border-green-600',
          text: 'text-green-900 dark:text-green-100',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          border: 'border-red-500 dark:border-red-600',
          text: 'text-red-900 dark:text-red-100',
          icon: '✗'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          border: 'border-yellow-500 dark:border-yellow-600',
          text: 'text-yellow-900 dark:text-yellow-100',
          icon: '⚠'
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          border: 'border-blue-500 dark:border-blue-600',
          text: 'text-blue-900 dark:text-blue-100',
          icon: 'ℹ'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} border-2 rounded-xl p-4 shadow-lg dark:shadow-purple-500/20 backdrop-blur-lg transition-all duration-300 transform animate-slide-in-right min-w-[300px] max-w-md`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold text-lg">
          {styles.icon}
        </div>
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity duration-200"
        >
          ×
        </button>
      </div>
    </div>
  );
}