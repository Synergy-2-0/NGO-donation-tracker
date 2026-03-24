export default function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Heart beating animation */}
      <div className="relative">
        <svg
          className={`${sizeClasses[size]} text-brand-red animate-pulse`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>

        {/* Pulsing rings around heart */}
        <div className="absolute inset-0 animate-ping">
          <svg
            className={`${sizeClasses[size]} text-brand-orange opacity-30`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>

        {/* Second pulsing ring */}
        <div className="absolute inset-0 animate-ping" style={{ animationDelay: '150ms' }}>
          <svg
            className={`${sizeClasses[size]} text-brand-brown opacity-20`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {message && (
        <p className="mt-4 text-sm font-medium text-brand-brown animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
