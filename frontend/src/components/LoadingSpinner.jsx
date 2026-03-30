import { FiActivity } from 'react-icons/fi';

export default function LoadingSpinner({ message = 'Synchronizing Ledger...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 animate-fadeIn">
      <div className="relative">
        {/* Main core circle */}
        <div className={`${sizeClasses[size]} border-4 border-slate-100 rounded-full`} />
        
        {/* Spinning accent border */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-t-4 border-brand-red rounded-full animate-spin shadow-[0_0_15px_rgba(220,38,38,0.2)]`} />

        {/* Pulsing center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-900 drop-shadow-sm">
            <div className={`w-2 h-2 rounded-full bg-brand-red animate-ping opacity-75`} />
        </div>

        {/* Ambient glow pulses */}
        <div className="absolute inset-0 rounded-full bg-brand-red/5 blur-2xl animate-pulse -z-10" />
      </div>

      {/* Industrial loading text */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400">
          {message}
        </p>
        <div className="flex gap-2">
           <span className="w-1 h-1 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '0ms' }} />
           <span className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
           <span className="w-1 h-1 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
