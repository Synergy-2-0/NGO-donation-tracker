import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ROLES = [
  { value: 'donor',   label: 'Donor' },
  { value: 'partner', label: 'Partner' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[a-zA-Z\s'-]{2,50}$/;

const inputCls = (err) =>
  `w-full border ${err ? 'border-brand-red bg-red-50/30' : 'border-brand-orange/40 bg-brand-cream/60'} rounded-lg px-4 py-2.5 text-sm text-brand-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition`;

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1 text-xs text-brand-red">{msg}</p> : null;

const PHONE_RE = /^\+?[1-9]\d{1,14}$/;

function validateAccount(signUp) {
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

function validateProfile(signUp) {
  const errs = {};
  if (signUp.phone && !PHONE_RE.test(signUp.phone.trim()))
    errs.phone = 'Enter a valid phone number (e.g. +94771234567).';
  return errs;
}

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin'); // 'signin' | 'signup'
  const [step, setStep] = useState(1); // signup wizard step
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
    // Donor profile fields (step 2)
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

  const submitSignUp = async () => {
    setError('');
    try {
      await register({
        name: signUp.name.trim(),
        email: signUp.email,
        password: signUp.password,
        role: signUp.role,
        phone: signUp.phone.trim() || undefined,
        city: signUp.city.trim() || undefined,
        country: signUp.country.trim() || undefined,
        preferredCauses: signUp.preferredCauses
          ? signUp.preferredCauses.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: signUp.bio.trim() || undefined,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setStep(1);
    }
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    const errs = validateAccount(signUp);
    setFieldErrors(errs);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-brand-brown via-brand-red to-brand-orange">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-center items-center px-16 flex-1 relative overflow-hidden">
        {/* Background image - positioned to show hands reaching */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/hands-love-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.2,
          }}
        />
        {/* Gradient overlay for smooth blending */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(124, 45, 18, 0.8) 80%)'
          }}
        />

        {/* Decorative glowing orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-orange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-brand-red/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

        {/* Content wrapper */}
        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src="/hand-heart-logo.png" alt="TrustFund Logo" className="w-64 h-auto object-contain drop-shadow-2xl" />
          </div>

          {/* Tagline */}
          <h2 className="text-5xl font-bold text-white leading-tight drop-shadow-md">
            Compassion &amp;<br />Humanity
          </h2>
          <p className="text-lg text-white/90 font-medium mt-2">in Every Donation</p>

          {/* Description */}
          <p className="text-brand-cream/90 text-base leading-relaxed max-w-sm mx-auto mt-4">
            Track your giving, manage pledges, and see the real-world impact of your contributions.
          </p>

          {/* Stats with glassmorphism cards */}
          <div className="flex justify-center gap-4 mt-6">
            {[['500+', 'Campaigns'], ['10K+', 'Donors'], ['$2M+', 'Raised']].map(([num, lbl]) => (
              <div
                key={lbl}
                className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20 shadow-lg"
              >
                <p className="text-2xl font-bold text-white">{num}</p>
                <p className="text-brand-cream/80 text-xs mt-1 uppercase tracking-wide">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form card */}
      <div className="flex items-center justify-center w-full lg:w-[480px] lg:shrink-0 px-6 py-12">
        <div className="bg-brand-cream rounded-2xl shadow-2xl w-full max-w-sm p-8">
          {/* Logo (mobile) */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <img src="/hand-heart-logo.png" alt="TrustFund Logo" className="w-12 h-12 object-contain" />
          </div>

          {/* Tabs */}
          <div className="flex bg-brand-orange/20 rounded-xl p-1 mb-6">
            {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); setError(''); setStep(1); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === key
                    ? 'bg-brand-red text-white shadow'
                    : 'text-brand-brown hover:text-brand-red'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-brand-red/30 text-brand-red text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* ── Sign In ── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Email</label>
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
                <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Password</label>
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
                className="w-full bg-brand-red hover:bg-brand-red/90 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm mt-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
              <p className="text-center text-xs text-gray-400 pt-1">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => setTab('signup')} className="text-brand-red font-semibold hover:underline">
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ── Sign Up ── */}
          {tab === 'signup' && (
            <div className="space-y-4">
              {/* Step indicator — donors only */}
              {signUp.role === 'donor' && (
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        step >= s ? 'bg-brand-red text-white' : 'bg-brand-orange/20 text-brand-brown'
                      }`}>{s}</div>
                      {s === 1 && <div className={`h-0.5 w-10 transition-colors ${step >= 2 ? 'bg-brand-red' : 'bg-brand-orange/40'}`} />}
                    </div>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">{step === 1 ? 'Account Info' : 'Donor Profile'}</span>
                </div>
              )}

              {/* Step 1 — Account fields */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Full Name</label>
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
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Email</label>
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
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Role</label>
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
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Password</label>
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
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Confirm Password</label>
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
                    className="w-full bg-brand-red hover:bg-brand-red/90 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm mt-1"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {signUp.role === 'donor' ? 'Continuing...' : 'Creating account...'}
                      </span>
                    ) : (
                      signUp.role === 'donor' ? 'Next →' : 'Create Account'
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 pt-1">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setTab('signin'); setStep(1); }} className="text-brand-red font-semibold hover:underline">
                      Sign In
                    </button>
                  </p>
                </form>
              )}

              {/* Step 2 — Donor profile setup */}
              {step === 2 && (
                <form onSubmit={handleStep2} className="space-y-4">
                  <p className="text-xs text-gray-500 -mt-1">
                    Optional — you can update these anytime from your profile.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      value={signUp.phone}
                      onChange={(e) => handleSignUpChange('phone', e.target.value)}
                      onBlur={() => touch('phone')}
                      placeholder="+94771234567"
                      className={inputCls(fieldErrors.phone)}
                    />
                    <FieldError msg={fieldErrors.phone} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">City</label>
                      <input
                        type="text"
                        value={signUp.city}
                        onChange={(e) => handleSignUpChange('city', e.target.value)}
                        placeholder="Colombo"
                        className={inputCls(false)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Country</label>
                      <input
                        type="text"
                        value={signUp.country}
                        onChange={(e) => handleSignUpChange('country', e.target.value)}
                        placeholder="Sri Lanka"
                        className={inputCls(false)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">Preferred Causes</label>
                    <input
                      type="text"
                      value={signUp.preferredCauses}
                      onChange={(e) => handleSignUpChange('preferredCauses', e.target.value)}
                      placeholder="education, health, environment"
                      className={inputCls(false)}
                    />
                    <p className="mt-1 text-xs text-gray-400">Comma-separated</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-brown mb-1 uppercase tracking-wide">
                      Bio <span className="font-normal text-gray-400 normal-case">(optional)</span>
                    </label>
                    <textarea
                      value={signUp.bio}
                      onChange={(e) => handleSignUpChange('bio', e.target.value)}
                      rows={2}
                      placeholder="Tell us a bit about yourself..."
                      className={`${inputCls(false)} resize-none`}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-brand-orange/40 text-brand-brown font-semibold py-2.5 rounded-lg text-sm hover:bg-brand-orange/10 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-brand-red hover:bg-brand-red/90 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
