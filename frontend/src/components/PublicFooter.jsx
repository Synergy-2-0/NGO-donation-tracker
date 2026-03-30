import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="bg-tf-dark text-white py-24 px-8 lg:px-24">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-20">
        {/* Brand & Mission */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-4 group">
             <img 
               src="/heart-logo c.png" 
               alt="TransFund Logo" 
               className="h-10 w-auto object-contain" 
             />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
            Empowering humanity through transparent, direct, and verifiable aid. TransFund connects global patrons with local impact nodes for absolute integrity in every donation.
          </p>
          <div className="flex gap-4">
            {['twitter', 'facebook', 'linkedin', 'instagram'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 bg-white/5 hover:bg-tf-primary transition-all rounded-full flex items-center justify-center group border border-white/5">
                 <img src={`https://cdn.simpleicons.org/${social}/ffffff`} alt={social} className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-8">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-tf-primary">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About TransFund</Link></li>
            <li><Link to="/causes" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Browse Causes</Link></li>
            <li><Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Our System</Link></li>
            <li><Link to="/impact" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Success Stories</Link></li>
            <li><Link to="/partners/list" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Global Partners</Link></li>
          </ul>
        </div>

        {/* Register */}
        <div className="space-y-8">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-tf-primary">Take Action</h4>
          <ul className="space-y-4">
            <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Donate Now</Link></li>
            <li><Link to="/login?tab=signup" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Create a Campaign</Link></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Help Center</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Terms of Use</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-tf-primary">Impact Hub</h4>
          <ul className="space-y-5 text-sm text-slate-400">
            <li className="flex gap-4">
              <svg className="w-5 h-5 shrink-0 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-medium leading-relaxed">Central Hub: 78/A Lotus Road, Colombo 01, Sri Lanka</span>
            </li>
            <li className="flex gap-4">
              <svg className="w-5 h-5 shrink-0 text-tf-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="font-medium">support@transfund.org</span>
            </li>
          </ul>
          <div className="pt-6 space-y-3 border-t border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Registered NGO Node Registration</p>
            <p className="text-xs text-tf-primary font-bold italic tracking-tighter">TF-SL-810-24X</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <p className="text-xs text-slate-500 font-medium tracking-wide italic">
          &copy; 2026 TransFund Humanitarian Protocol. all human node audited.
        </p>
        <div className="flex gap-10 text-[10px] font-black italic uppercase tracking-[0.4em] text-slate-500">
           <span className="hover:text-tf-primary cursor-crosshair transition-all">Verified Node Secure</span>
           <span className="hover:text-tf-primary cursor-crosshair transition-all">Audit Lock: Enabled</span>
        </div>
      </div>
    </footer>
  );
}
