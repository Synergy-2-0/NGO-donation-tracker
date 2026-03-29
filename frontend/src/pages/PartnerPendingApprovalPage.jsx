import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PartnerPendingApprovalPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
       <div className="absolute top-0 left-0 w-full h-96 bg-brand-red/10 rounded-b-[100px] -z-10"></div>
       
       <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col relative z-10 text-center p-12">
          <div className="mx-auto bg-brand-orange/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">⏳</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">Application Under Review</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for completing the onboarding process. Your partnership application is currently being vetted by our NGO admin team. You will be notified once your organization is verified and approved.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">What happens next?</h4>
            <ul className="text-sm text-slate-600 space-y-3 text-left max-w-md mx-auto">
              <li className="flex gap-3 items-start">
                <span className="text-brand-red font-bold">1</span>
                <span>Our compliance team reviews your submitted verification documents.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand-red font-bold">2</span>
                <span>An admin evaluates your CSR focus and budget capacity logically.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand-red font-bold">3</span>
                <span>Once approved, you gain full access to the Finance & Funding dashboard.</span>
              </li>
            </ul>
          </div>

          <div>
             <button onClick={handleLogout} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg text-sm">
                 Return to Login
             </button>
          </div>
       </div>
    </div>
  );
}
