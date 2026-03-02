import React from 'react';
import { useStore } from '../context/Store';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastContainer = () => {
  const { notifications, removeNotification } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border transition-all animate-slide-in ${
            notification.type === 'info' ? 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900' :
            notification.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900' :
            notification.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
            'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {notification.type === 'info' && <Info className="text-blue-500" size={20} />}
            {notification.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
            {notification.type === 'warning' && <AlertTriangle className="text-yellow-500" size={20} />}
            {notification.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
          </div>
          
          <div className="flex-1">
            <p className={`text-sm font-medium ${
                notification.type === 'info' ? 'text-gray-900 dark:text-white' :
                notification.type === 'success' ? 'text-gray-900 dark:text-white' :
                notification.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                'text-red-800 dark:text-red-200'
            }`}>
              {notification.message}
            </p>
          </div>

          <button 
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
