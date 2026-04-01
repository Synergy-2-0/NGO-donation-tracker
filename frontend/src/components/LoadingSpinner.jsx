import { motion } from 'framer-motion';

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: { box: 'w-12 h-12', circle: 'w-6 h-6' },
    md: { box: 'w-24 h-24', circle: 'w-10 h-10' },
    lg: { box: 'w-40 h-40', circle: 'w-20 h-20' }
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-soft">
      <div className={`relative ${selectedSize.box} flex items-center justify-center`}>
        {/* Ambient Outer Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-tf-primary rounded-full blur-2xl -z-10"
        />

        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className={`absolute ${selectedSize.circle} border-2 border-slate-100 rounded-full`}
        />

        {/* Spinning Accent Segment */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute ${selectedSize.circle} border-t-2 border-tf-primary rounded-full shadow-[0_0_15px_rgba(255,138,0,0.3)]`}
        />

        {/* Inner Morphing Shape */}
        <motion.div 
          animate={{ 
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 20% 80% / 25% 80% 20% 75%", "30% 70% 70% 30% / 30% 30% 70% 70%"],
            rotate: [0, 90, 0],
            scale: [0.8, 1, 0.8]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 bg-slate-900 border border-slate-800 shadow-xl opacity-90"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 italic translate-x-[0.25em]">
             {message}
           </p>
           <div className="w-12 h-0.5 bg-slate-100 mt-2 relative overflow-hidden rounded-full">
              <motion.div 
                animate={{ x: [-48, 48] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-y-0 w-8 bg-tf-primary rounded-full"
              />
           </div>
        </div>
        
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic opacity-50">
          Community Infrastructure Sync Hub
        </p>
      </div>
    </div>
  );
}
