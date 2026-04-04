import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger' }) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            iconBg: 'bg-rose-50',
            iconText: 'text-rose-500',
            button: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
        },
        warning: {
            iconBg: 'bg-amber-50',
            iconText: 'text-amber-500',
            button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
        }
    };

    const config = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-scaleUp">
                <div className="p-8 text-center space-y-6">
                    <div className={`w-20 h-20 ${config.iconBg} rounded-[28px] flex items-center justify-center mx-auto mb-2`}>
                        <FiAlertTriangle className={`text-4xl ${config.iconText}`} />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                        >
                            Back To safety
                        </button>
                        <button 
                            onClick={onConfirm}
                            className={`flex-1 px-6 py-4 text-white rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${config.button}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
