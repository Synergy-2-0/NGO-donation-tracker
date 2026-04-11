import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api/axios';

const ROLES = [
  { value: 'donor',   label: 'Donor' },
  { value: 'partner', label: 'Apply for Partnership' },
  { value: 'ngo-admin', label: 'Register as NGO' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-zA-Z\s'-]{2,50}$/;
const PHONE_RE = /^\+?[1-9]\d{1,14}$/;

const inputCls = (err) =>
  `w-full bg-slate-50 border ${err ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'} rounded-2xl px-6 py-4 text-sm font-semibold text-tf-dark placeholder-slate-300 focus:outline-none focus:border-tf-primary transition-all shadow-sm`;

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1.5 ml-4 text-[10px] font-bold text-red-500 uppercase tracking-widest leading-tight">{msg}</p> : null;

function validateAccount(signUp) {
  const errs = {};
  if (!NAME_RE.test(signUp.name.trim()))
    errs.name = 'Valid full name required.';
  if (!EMAIL_RE.test(signUp.email))
    errs.email = 'Valid email address required.';
  if (signUp.password.length < 8)
    errs.password = 'Min. 8 characters required.';
  if (!/[A-Z]/.test(signUp.password))
    errs.password = (errs.password ? errs.password + ' ' : '') + 'Include uppercase.';
  if (!/[0-9]/.test(signUp.password))
    errs.password = (errs.password ? errs.password + ' ' : '') + 'Include number.';
  if (signUp.confirmPassword !== signUp.password)
    errs.confirmPassword = 'Passwords do not match.';
  return errs;
}

function validateProfile(signUp) {
  const errs = {};
  if (signUp.phone && !PHONE_RE.test(signUp.phone.trim()))
    errs.phone = 'Valid phone number required.';
  return errs;
}

import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const { login, googleLogin, register, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('signin');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t === 'signup') setTab('signup');
  }, [searchParams]);

  const [signIn, setSignIn] = useState({ email: '', password: '' });

  const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: '',
    city: '',
    country: 'Sri Lanka',
    preferredCauses: '',
    bio: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSignUpChange = (field, value) => {
    const updated = { ...signUp, [field]: value };
    setSignUp(updated);
    if (touched[field]) {
      const errs = validateAccount(updated);
      setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
      if (field === 'password' && touched.confirmPassword) {
        setFieldErrors((prev) => ({ ...prev, confirmPassword: errs.confirmPassword }));
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(signIn.email, signIn.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError('');
    try {
      const data = await googleLogin(response.credential);
      if (data.isNewUser) {
        setTab('signup');
        setStep(1);
        setIsGoogleUser(true);
        setSignUp((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
        }));
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const submitSignUp = async () => {
    setError('');
    try {
      const payload = {
        name: signUp.name.trim(),
        email: signUp.email,
        role: signUp.role,
        phone: signUp.phone.trim() || undefined,
        city: signUp.city.trim() || undefined,
        country: signUp.country.trim() || undefined,
        preferredCauses: signUp.preferredCauses
          ? signUp.preferredCauses.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: signUp.bio.trim() || undefined,
      };

      if (isGoogleUser) {
        await updateProfile(payload);
      } else {
        payload.password = signUp.password;
        await register(payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setStep(1);
    }
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    
    let errs = {};
    if (!isGoogleUser) {
      errs = validateAccount(signUp);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
    }
    
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    
    if (signUp.role === 'donor') {
      setStep(2);
    } else {
      submitSignUp();
    }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    const errs = validateProfile(signUp);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    submitSignUp();
  };

  const [liveStats, setLiveStats] = useState({ donors: 0, nodes: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [impactRes, donorRes] = await Promise.all([
          api.get('/api/public/impact-metrics').then(res => res.data),
          api.get('/api/public/donor-stats').then(res => res.data)
        ]);
        setLiveStats({ 
          donors: donorRes.totalDonors || 0, 
          nodes: impactRes.verifiedPartners || 0 
        });
      } catch (err) {
        console.error('Failed to load live portal stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-tf-dark relative overflow-hidden font-sans">
       {/* High-Fidelity Cinematic Backdrop */}
       <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600" alt="Backdrop" className="w-full h-full object-cover opacity-10 scale-105 blur-sm grayscale" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-tf-dark to-transparent" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tf-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-40" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-tf-accent/5 blur-[120px] rounded-full translate-y-1/3 -translate-x-1/3 opacity-30" />
       </div>

       <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[4rem] shadow-5xl overflow-hidden animate-fade-in border border-white/20 backdrop-blur-3xl selection:bg-tf-primary selection:text-white">
          
          {/* Left panel — Brand Story */}
          <div className="hidden lg:flex flex-col justify-center px-16 py-20 bg-slate-900 text-white flex-1 relative overflow-hidden group">
             <div className="absolute inset-0 bg-tf-primary/5 group-hover:bg-tf-primary/10 transition-all duration-1000" />
             <div className="relative z-10 space-y-12">
                <div className="space-y-8">
                   <div className="flex items-center">
                      <img src="/heart-logo c.png" alt="TransFund" className="h-12 w-auto" />
                   </div>
                   <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-[1.05] uppercase">
                      Empowering <br />
                      <span className="text-tf-primary underline decoration-white/10 underline-offset-8">Humanity</span>
                   </h2>
                   <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
                      Welcome to the TransFund Portal. Join thousands of patrons building a transparent future for global aid.
                   </p>
                </div>

                <div className="flex gap-10 border-t border-white/5 pt-10">
                   <div className="space-y-1">
                      <p className="text-4xl font-extrabold text-white tabular-nums tracking-tighter">
                        {liveStats.donors > 0 ? liveStats.donors.toLocaleString() : '12K+'}
                      </p>
                      <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest leading-none">Global Supporters Hub</p>
                   </div>
                   <div className="w-px h-12 bg-white/10" />
                   <div className="space-y-1">
                      <p className="text-4xl font-extrabold text-white tabular-nums tracking-tighter">
                        {liveStats.nodes > 0 ? liveStats.nodes.toLocaleString() : '480+'}
                      </p>
                      <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest leading-none">Active Partners Hub</p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                   {['Verified Aid', 'Real-time Impact Hub', 'Verified Security'].map((tag) => (
                      <span key={tag} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all tracking-tighter shadow-sm">
                         {tag}
                      </span>
                   ))}
                </div>
             </div>
          </div>

          {/* Right panel — Interaction Hub */}
          <div className="w-full lg:w-[500px] p-12 md:p-16 flex flex-col justify-center bg-white">
             <div className="space-y-10">
                <div className="space-y-4">
                   <p className="text-tf-primary text-[11px] font-extrabold uppercase tracking-[0.5em]  leading-none">Secure Access Point</p>
                   <h1 className="text-4xl font-extrabold text-tf-dark tracking-tighter uppercase underline decoration-tf-primary/20 underline-offset-8">Account Portal</h1>
                </div>

                {/* Tabs Hub */}
                <div className="flex gap-10 border-b border-slate-100 pb-px">
                   {[
                      { id: 'signin', label: 'Sign In' },
                      { id: 'signup', label: 'Registration' }
                   ].map((t) => (
                      <button
                         key={t.id}
                         onClick={() => { setTab(t.id); setError(''); setStep(1); setIsGoogleUser(false); }}
                         className={`pb-4 text-[12px] font-extrabold uppercase tracking-[0.3em] transition-all relative  ${
                            tab === t.id ? 'text-tf-dark' : 'text-slate-300 hover:text-slate-500'
                         }`}
                      >
                         {t.label}
                         {tab === t.id && <div className="absolute inset-x-0 bottom-[-1px] h-[3px] bg-tf-primary rounded-full" />}
                      </button>
                   ))}
                </div>

                {error && (
                   <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] font-extrabold uppercase tracking-widest px-6 py-4 rounded-2xl animate-fade-in shadow-sm">
                      {error}
                   </div>
                )}

                {/* --- Sign In Form --- */}
                {tab === 'signin' ? (
                   <div className="space-y-8">
                     <form onSubmit={handleSignIn} className="space-y-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Patron Email</label>
                           <input
                              type="email"
                              value={signIn.email}
                              onChange={(e) => setSignIn((f) => ({ ...f, email: e.target.value }))}
                              required
                              placeholder="patron@transfund.org"
                              className={inputCls(false)}
                           />
                        </div>
                        <div className="space-y-3 relative">
                           <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Secure Password</label>
                           <input
                              type={showPassword ? "text" : "password"}
                              value={signIn.password}
                              onChange={(e) => setSignIn((f) => ({ ...f, password: e.target.value }))}
                              required
                              placeholder="••••••••"
                              className={inputCls(false)}
                           />
                           <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-6 top-[52px] text-slate-300 hover:text-tf-primary transition-colors"
                           >
                              {showPassword ? (
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              ) : (
                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.51-4.51A9.959 9.959 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3m11 8a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                              )}
                           </button>
                        </div>
                        <button
                           type="submit"
                           disabled={loading}
                           className="w-full bg-tf-dark hover:bg-tf-primary text-white font-extrabold py-7 rounded-full transition-all text-[12px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 mt-4"
                        >
                           {loading ? 'Authenticating…' : 'Initialize Session'}
                        </button>
                     </form>
                     
                     <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] font-extrabold uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">Or Continue With</span></div>
                     </div>

                     <div className="flex justify-center">
                        <GoogleLogin 
                           onSuccess={handleGoogleSuccess} 
                           onError={() => setError('Google Authentication Failed')}
                           useOneTap
                           theme="outline"
                           shape="pill"
                           size="large"
                           width="400"
                        />
                     </div>
                   </div>
                ) : (
                   <div className="space-y-10">
                      <div className="flex items-center gap-8">
                         {[1, 2].map(s => (
                            <div key={s} className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-extrabold transition-all ${
                                  step >= s ? 'bg-tf-primary text-white shadow-xl shadow-tf-primary/30 rotate-3' : 'bg-slate-50 text-slate-300 border border-slate-100'
                               }`}>{s}</div>
                               <p className={`text-[10px] font-extrabold uppercase tracking-widest  ${step === s ? 'text-tf-dark' : 'text-slate-300'}`}>
                                  {s === 1 ? 'Account' : 'Profile'}
                               </p>
                            </div>
                         ))}
                      </div>

                      {!isGoogleUser && step === 1 && (
                         <div className="space-y-8">
                           <div className="flex justify-center mb-4">
                              <GoogleLogin 
                                 onSuccess={handleGoogleSuccess} 
                                 onError={() => setError('Google Authentication Failed')}
                                 theme="filled_blue"
                                 shape="pill"
                                 size="large"
                                 width="400"
                                 text="signup_with"
                              />
                           </div>
                           <div className="relative">
                              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                              <div className="relative flex justify-center text-[10px] font-extrabold uppercase tracking-widest"><span className="bg-white px-4 text-slate-300">Or use email</span></div>
                           </div>
                         </div>
                      )}

                      {step === 1 ? (
                         <form onSubmit={handleStep1} className="space-y-8">
                            {isGoogleUser && (
                               <div className="bg-tf-primary/5 p-6 rounded-2xl border border-tf-primary/10">
                                  <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-widest leading-relaxed">
                                     Google Hub Active: Welcome {signUp.name}! Please finalize your account settings below.
                                  </p>
                               </div>
                            )}

                            {!isGoogleUser && (
                               <>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Full Name</label>
                                    <input
                                       type="text"
                                       value={signUp.name}
                                       onChange={(e) => handleSignUpChange('name', e.target.value)}
                                       onBlur={() => touch('name')}
                                       required
                                       placeholder="John Doe"
                                       className={inputCls(fieldErrors.name)}
                                     />
                                    <FieldError msg={fieldErrors.name} />
                                 </div>
                                 <div className="space-y-3">
                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Email Address Hub</label>
                                    <input
                                       type="email"
                                       value={signUp.email}
                                       onChange={(e) => handleSignUpChange('email', e.target.value)}
                                       onBlur={() => touch('email')}
                                       required
                                       placeholder="email@example.com"
                                       className={inputCls(fieldErrors.email)}
                                     />
                                    <FieldError msg={fieldErrors.email} />
                                 </div>
                               </>
                            )}

                            <div className="space-y-3">
                               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Account Type Hub</label>
                               <select
                                  value={signUp.role}
                                  onChange={(e) => handleSignUpChange('role', e.target.value)}
                                  className={inputCls(false) + " appearance-none cursor-pointer pr-12 "}
                               >
                                  {ROLES.map((r) => (
                                     <option key={r.value} value={r.value}>{r.label.toUpperCase()}</option>
                                  ))}
                               </select>
                            </div>

                            {!isGoogleUser && (
                               <>
                                 <div className="space-y-3 relative">
                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Secure Password</label>
                                    <input
                                       type={showPassword ? "text" : "password"}
                                       value={signUp.password}
                                       onChange={(e) => handleSignUpChange('password', e.target.value)}
                                       onBlur={() => touch('password')}
                                       required
                                       placeholder="••••••••"
                                       className={inputCls(fieldErrors.password)}
                                     />
                                    <FieldError msg={fieldErrors.password} />
                                 </div>
                                 <div className="space-y-3 relative">
                                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Confirm Password</label>
                                    <input
                                       type={showPassword ? "text" : "password"}
                                       value={signUp.confirmPassword}
                                       onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                                       onBlur={() => touch('confirmPassword')}
                                       required
                                       placeholder="••••••••"
                                       className={inputCls(fieldErrors.confirmPassword)}
                                     />
                                    <FieldError msg={fieldErrors.confirmPassword} />
                                 </div>
                               </>
                            )}
                            <button
                               type="submit"
                               disabled={loading}
                               className="w-full bg-tf-primary hover:bg-tf-dark text-white font-extrabold py-7 rounded-full transition-all text-[12px] uppercase tracking-[0.4em] shadow-2xl active:scale-95"
                            >
                               {loading ? 'Verifying Account Hub…' : (isGoogleUser ? 'Continue Setup →' : 'Next Step Hub →')}
                            </button>
                         </form>
                      ) : (
                         <form onSubmit={handleStep2} className="space-y-8 animate-slide-in">
                            <div className="space-y-3">
                               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Verified Phone</label>
                               <input
                                  type="tel"
                                  value={signUp.phone}
                                  onChange={(e) => handleSignUpChange('phone', e.target.value)}
                                  required
                                  placeholder="+94 77 000 0000"
                                  className={inputCls(fieldErrors.phone)}
                               />
                               <FieldError msg={fieldErrors.phone} />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">City Hub</label>
                                  <input
                                     type="text"
                                     value={signUp.city}
                                     onChange={(e) => handleSignUpChange('city', e.target.value)}
                                     placeholder="Colombo"
                                     className={inputCls(false)}
                                  />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Country</label>
                                  <input
                                     type="text"
                                     value={signUp.country}
                                     onChange={(e) => handleSignUpChange('country', e.target.value)}
                                     placeholder="Sri Lanka"
                                     className={inputCls(false)}
                                  />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-6">Mission Focus</label>
                               <input
                                  type="text"
                                  value={signUp.preferredCauses}
                                  onChange={(e) => handleSignUpChange('preferredCauses', e.target.value)}
                                  placeholder="Education, Relief, Nodes"
                                  className={inputCls(false)}
                                />
                            </div>
                            <div className="flex gap-6 pt-6">
                               <button
                                  type="button"
                                  onClick={() => setStep(1)}
                                  className="flex-1 border-2 border-slate-100 text-slate-400 hover:text-tf-dark hover:border-tf-dark font-extrabold py-7 rounded-full text-[11px] uppercase tracking-widest transition-all  active:scale-95"
                               >
                                  Back Hub
                                </button>
                               <button
                                  type="submit"
                                  disabled={loading}
                                  className="flex-[2] bg-tf-primary hover:bg-tf-dark text-white font-extrabold py-7 rounded-full transition-all text-[12px] uppercase tracking-[0.4em] shadow-2xl active:scale-95"
                               >
                                  {loading ? 'Finalizing Profile…' : 'Complete Setup Hub'}
                                </button>
                            </div>
                         </form>
                      )}
                   </div>
                )}
             </div>
          </div>
       </div>

       <style>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slide-in { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
          .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
          .animate-slide-in { animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
       `}</style>
    </div>
  );
}
