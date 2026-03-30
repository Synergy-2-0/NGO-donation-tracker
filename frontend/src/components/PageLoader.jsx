import LoadingSpinner from './LoadingSpinner';

export default function PageLoader({ message = 'Loading TrustFund...', fullScreen = false }) {
  const containerClass = fullScreen
    ? 'fixed inset-0 bg-brand-cream/90 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'min-h-screen flex items-center justify-center bg-brand-cream';

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* Logo */}
        <img
          src="/heart-logo c.png"
          alt="TrustFund"
          className="w-16 h-16 mx-auto mb-4 opacity-80"
        />

        {/* Loading animation */}
        <LoadingSpinner size="lg" message={message} />

        {/* Tagline */}
        <p className="mt-6 text-xs text-brand-brown/60 font-medium uppercase tracking-wider">
          Compassion & Humanity in Every Donation
        </p>
      </div>
    </div>
  );
}
