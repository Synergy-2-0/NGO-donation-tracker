import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import { 
  FiUser, FiShield, FiBell, FiZap, 
  FiArrowRight, FiCheckCircle, FiLock, FiGlobe, 
  FiMail, FiSmartphone, FiMoon, FiSun, FiActivity
} from 'react-icons/fi';

export default function SettingsPage() {
  const { user, updateProfile, updatePassword, loading } = useAuth();
  const isDonor = user?.role === 'donor';

  const TABS = [
    { id: 'profile', label: 'Account Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security & Access', icon: <FiShield /> },
    { id: 'notifications', label: 'Alert Center', icon: <FiBell /> },
    ...(!isDonor ? [{ id: 'system', label: 'System Preferences', icon: <FiZap /> }] : []),
  ];

  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password Form State
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await updateProfile(profileForm);
      setSuccess('Profile information synchronized successfully HUB.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
       return setError('New strategic keys do not match HUB.');
    }
    try {
      await updatePassword(pwdForm.currentPassword, pwdForm.newPassword);
      setSuccess('Strategic access key rotated successfully HUB.');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 pb-40 font-sans selection:bg-tf-primary selection:text-white pt-8">
      
      {/* Header Section */}
      <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 md:p-14 shadow-2xl group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tf-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4 flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-tf-primary text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md ">
               <FiActivity className="animate-pulse" /> Operational Configuration HUB
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight ">
               Member <span className="text-tf-primary text-glow-orange">HUB Settings</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl  text-left">
               Secure and personalized environment management for verified TransFund members Hub.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-4">
             <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-tf-primary text-2xl shadow-inner backdrop-blur-xl">
                <FiZap />
             </div>
          </div>
        </div>
      </section>

      {(error || success) && (
         <div className="max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
               {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ErrorAlert message={error} /></motion.div>}
               {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-extrabold uppercase tracking-widest  flex items-center gap-3">
                     <FiCheckCircle className="text-lg" /> {success}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-2">
                 {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all duration-500 relative group/btn ${
                        activeTab === tab.id 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2' 
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                       <span className={`text-lg transition-transform duration-500 ${activeTab === tab.id ? 'scale-110' : 'group-hover/btn:rotate-12'}`}>
                          {tab.icon}
                       </span>
                       {tab.label}
                       {activeTab === tab.id && (
                          <motion.div layoutId="tab-pill" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-tf-primary" />
                       )}
                    </button>
                 ))}
              </div>
           </div>

           <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group/card shadow-2xl">
              <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 space-y-6 text-left">
                 <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-[0.3em]  leading-none">Security Registry</p>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                    <p className="text-[9px] font-extrabold text-white/30 uppercase tracking-widest  leading-none mb-1">Authenticated ID</p>
                    <p className="text-sm font-bold truncate ">{user?.email}</p>
                 </div>
                 <p className="text-xs font-medium text-white/40 leading-relaxed ">Synchronized at: {new Date().toLocaleDateString()} HUB</p>
              </div>
           </div>
        </aside>

        {/* Dynamic Settings View */}
        <main className="lg:col-span-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 md:p-14 relative overflow-hidden group/main"
              >
                 <div className="absolute top-0 right-0 w-96 h-96 bg-tf-primary/5 blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover/main:opacity-100 transition-opacity opacity-0" />
                 
                 <div className="relative z-10 space-y-12">
                    <div className="space-y-4 border-b border-slate-50 pb-8 text-left">
                       <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight  uppercase leading-none">
                          {TABS.find(t => t.id === activeTab).label}
                       </h3>
                       <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-[.4em]  leading-none">
                          Identity Protocol Management HUB
                       </p>
                    </div>

                    <form className="space-y-10" onSubmit={activeTab === 'profile' ? handleProfileUpdate : activeTab === 'security' ? handlePasswordUpdate : (e) => e.preventDefault()}>
                       {activeTab === 'profile' && (
                          <div className="space-y-8 text-left">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput 
                                  label="Full Name Registry" 
                                  value={profileForm.name} 
                                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                  placeholder="Your Official Name Hub" 
                                  icon={<FiUser />} 
                                />
                                <FormInput 
                                  label="Strategic Email Gateway" 
                                  value={profileForm.email} 
                                  readOnly
                                  placeholder="Email Address Hub" 
                                  icon={<FiMail />} 
                                />
                             </div>
                             <FormInput 
                                label="Contact Node (Phone)" 
                                value={profileForm.phone} 
                                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                placeholder="+94 XX XXX XXXX" 
                                icon={<FiSmartphone />} 
                             />
                             <div className="space-y-4">
                                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  text-left">Internal Registry Profile HUB</h4>
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-xs font-bold text-slate-400 ">
                                   Role: <span className="text-tf-primary uppercase ml-2">{user?.role} Access HUB</span>
                                </div>
                             </div>
                          </div>
                       )}

                       {activeTab === 'security' && (
                          <div className="space-y-10 text-left">
                             <div className="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                <h4 className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-3 ">
                                   <FiLock className="text-tf-primary" /> Key Rotation Protocol
                                </h4>
                                <div className="space-y-6">
                                   <FormInput 
                                     label="Current Access Key" 
                                     type="password" 
                                     value={pwdForm.currentPassword}
                                     onChange={(e) => setPwdForm({...pwdForm, currentPassword: e.target.value})}
                                   />
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <FormInput 
                                        label="New Strategic Key" 
                                        type="password" 
                                        value={pwdForm.newPassword}
                                        onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})}
                                      />
                                      <FormInput 
                                        label="Confirm Registry Rotation" 
                                        type="password" 
                                        value={pwdForm.confirmPassword}
                                        onChange={(e) => setPwdForm({...pwdForm, confirmPassword: e.target.value})}
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>
                       )}

                        {activeTab === 'notifications' && (
                          <div className="space-y-6 text-left">
                             {(isDonor 
                                ? [
                                    { t: 'Payment Confirmations', d: 'Get instant receipts for verified distributions.' },
                                    { t: 'Mission Cycle Reminders', d: 'Predictive alerts for your upcoming pledges.' },
                                    { t: 'Strategic Impact Alerts', d: 'Notifications for new mission hub launches.' },
                                  ]
                                : [
                                    { t: 'Strategic Briefings', d: 'Receive community performance reports Hub.' },
                                    { t: 'Protocol Access Alerts', d: 'Real-time security notifications for log activity.' },
                                    { t: 'Transaction Hubs', d: 'Summary of verified financial rotations.' },
                                  ]
                             ).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-2xl group/item hover:bg-white hover:shadow-xl transition-all duration-500">
                                   <div>
                                      <p className="text-[11px] font-extrabold text-slate-900 uppercase tracking-widest  leading-none mb-1">{item.t}</p>
                                      <p className="text-[10px] font-bold text-slate-400  leading-none">{item.d}</p>
                                   </div>
                                   <div className="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                      <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tf-primary shadow-inner transition-colors duration-500"></div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}

                       {activeTab === 'system' && (
                          <div className="space-y-10 text-left">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                   <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest  leading-none">UI Registry Environment</h4>
                                   <div className="grid grid-cols-2 gap-4">
                                      <button type="button" className="p-6 rounded-2xl bg-white border border-slate-900 text-slate-900 flex flex-col items-center gap-3 shadow-xl shadow-slate-900/10 scale-105 z-10 transition-all">
                                         <FiSun size={20} />
                                         <span className="text-[9px] font-extrabold uppercase tracking-widest">Normal Hub</span>
                                      </button>
                                      <button type="button" className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex flex-col items-center gap-3 opacity-50 grayscale cursor-not-allowed">
                                         <FiMoon size={20} />
                                         <span className="text-[9px] font-extrabold uppercase tracking-widest">Archive Hub</span>
                                      </button>
                                   </div>
                                </div>
                                <div className="p-8 bg-tf-primary/5 rounded-[2rem] border border-tf-primary/10 space-y-4">
                                   <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest  leading-none">Data Localization HUB</p>
                                   <p className="text-xs font-medium text-slate-500  leading-relaxed">Language and regional time-sync is managed globally for verified members HUB.</p>
                                   <button type="button" className="w-full py-4 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest opacity-50 ">Registry Status: Synchronized</button>
                                </div>
                             </div>
                          </div>
                       )}

                       {(activeTab === 'profile' || activeTab === 'security') && (
                          <div className="pt-10 border-t border-slate-50 flex items-center justify-end">
                             <button type="submit" disabled={loading} className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-[0.4em] hover:bg-tf-primary transition-all duration-700 shadow-2xl active:scale-95  flex items-center gap-3 group/save disabled:opacity-50">
                                {loading ? 'Synchronizing HUB...' : (
                                   <>Save Configuration HUB <FiArrowRight className="group-hover:translate-x-2 transition-transform" /></>
                                )}
                             </button>
                          </div>
                       )}
                    </form>
                 </div>
              </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function FormInput({ label, icon, ...props }) {
  return (
    <div className="space-y-4 group/input">
      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1 block group-focus-within/input:text-tf-primary transition-colors  leading-none">
        {label}
      </label>
      <div className="relative">
        <input 
          {...props} 
          className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-5 text-[13px] font-extrabold text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-tf-primary focus:bg-white transition-all shadow-inner " 
        />
        {icon && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 text-lg group-focus-within/input:text-tf-primary transition-colors">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
