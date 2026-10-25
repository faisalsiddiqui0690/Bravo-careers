import { useEffect } from 'react';

const config = {
  success: {
    icon: '✓',
    bar: 'bg-green-500',
    iconBg: 'bg-green-500/20 text-green-300',
    border: 'border-green-500/20',
  },
  error: {
    icon: '✕',
    bar: 'bg-red-500',
    iconBg: 'bg-red-500/20 text-red-300',
    border: 'border-red-500/20',
  },
  info: {
    icon: 'ℹ',
    bar: 'bg-blue-500',
    iconBg: 'bg-blue-500/20 text-blue-300',
    border: 'border-blue-500/20',
  },
};

const AdminToast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const { icon, bar, iconBg, border } = config[type] || config.info;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .toast-slide { animation: toastIn 0.3s ease-out forwards; }
      `}</style>

      <div
        className={`toast-slide fixed top-20 right-6 z-[3000] flex items-start gap-3 bg-[#181c26] border ${border} rounded-xl px-4 py-3 shadow-2xl max-w-xs w-full`}
      >
        {/* Colored left bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${bar}`} />

        {/* Icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>

        {/* Message */}
        <p className="flex-1 text-sm text-slate-200 font-medium leading-snug pt-0.5">
          {message}
        </p>

        {/* Close */}
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white transition-colors text-lg leading-none flex-shrink-0 mt-0.5"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </>
  );
};

export default AdminToast;