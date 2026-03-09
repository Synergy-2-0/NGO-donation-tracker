import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'donor',   label: 'Donor' },
  { value: 'partner', label: 'Partner' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-zA-Z\s'-]{2,50}$/;

const inputCls = (err) =>
  `w-full border ${err ? 'border-red-400 bg-red-50/30' : 'border-orange-200 bg-orange-50/40'} rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition`;

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;

function validate(signUp) {
  const errs = {};
  if (!NAME_RE.test(signUp.name.trim()))
    errs.name = 'Enter a valid full name (letters only, 2–50 chars).';
  if (!EMAIL_RE.test(signUp.email))
    errs.email = 'Enter a valid email address.';
  if (signUp.password.length < 8)
    errs.password = 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(signUp.password))
    errs.password = (errs.password ? errs.password + ' ' : '') + 'Include at least one uppercase letter.';
  if (!/[0-9]/.test(signUp.password))
    errs.password = (errs.password ? errs.password + ' ' : '') + 'Include at least one number.';
  if (signUp.confirmPassword !== signUp.password)
    errs.confirmPassword = 'Passwords do not match.';
  return errs;
}

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [error, setError] = useState('');

  // Sign-in form
  const [signIn, setSignIn] = useState({ email: '', password: '' });

  // Sign-up form
  const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSignUpChange = (field, value) => {
    const updated = { ...signUp, [field]: value };
    setSignUp(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
      // also re-validate confirmPassword when password changes
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate(signUp);
    setFieldErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (Object.keys(errs).length > 0) return;
    try {
      await register({
        name: signUp.name.trim(),
        email: signUp.email,
        password: signUp.password,
        role: signUp.role,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #7C2D12 0%, #DC2626 50%, #FB923C 100%)' }}
    >
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-3xl font-extrabold text-white tracking-tight">TrustFund</span>
        </div>
        <h2 className="text-4xl font-bold text-white leading-snug mb-4">
          Compassion &amp; Humanity<br />in Every Donation
        </h2>
        <p className="text-orange-100 text-base leading-relaxed max-w-sm">
          Track your giving, manage pledges, and see the real-world impact of your contributions towards NGO campaigns.
        </p>
        <div className="mt-10 flex gap-6">
          {[['500+', 'Campaigns'], ['10K+', 'Donors'], ['$2M+', 'Raised']].map(([num, lbl]) => (
            <div key={lbl}>
              <p className="text-2xl font-bold text-white">{num}</p>
              <p className="text-orange-200 text-sm">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form card */}
      <div className="flex items-center justify-center w-full lg:w-[480px] lg:shrink-0 px-6 py-12">
        <div className="bg-[#FFF7ED] rounded-2xl shadow-2xl w-full max-w-sm p-8">
          {/* Logo (mobile) */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-2xl font-extrabold text-[#7C2D12]">TrustFund</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-orange-100 rounded-xl p-1 mb-6">
            {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === key
                    ? 'bg-[#DC2626] text-white shadow'
                    : 'text-[#7C2D12] hover:text-red-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* ── Sign In ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={signIn.email}
                  onChange={(e) => setSignIn((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="you@example.com"
                  className={inputCls(false)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  value={signIn.password}
                  onChange={(e) => setSignIn((f) => ({ ...f, password: e.target.value }))}
                  required
                  placeholder="Enter your password"
                  className={inputCls(false)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setTab('signup')} className="text-[#DC2626] font-semibold hover:underline">
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ── Sign Up ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Full Name</label>
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
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={signUp.email}
                  onChange={(e) => handleSignUpChange('email', e.target.value)}
                  onBlur={() => touch('email')}
                  required
                  placeholder="you@example.com"
                  className={inputCls(fieldErrors.email)}
                />
                <FieldError msg={fieldErrors.email} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Role</label>
                <select
                  value={signUp.role}
                  onChange={(e) => handleSignUpChange('role', e.target.value)}
                  className={inputCls(false)}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  value={signUp.password}
                  onChange={(e) => handleSignUpChange('password', e.target.value)}
                  onBlur={() => touch('password')}
                  required
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  className={inputCls(fieldErrors.password)}
                />
                <FieldError msg={fieldErrors.password} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C2D12] mb-1 uppercase tracking-wide">Confirm Password</label>
                <input
                  type="password"
                  value={signUp.confirmPassword}
                  onChange={(e) => handleSignUpChange('confirmPassword', e.target.value)}
                  onBlur={() => touch('confirmPassword')}
                  required
                  placeholder="Repeat password"
                  className={inputCls(fieldErrors.confirmPassword)}
                />
                <FieldError msg={fieldErrors.confirmPassword} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DC2626] hover:bg-red-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('signin')} className="text-[#DC2626] font-semibold hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
