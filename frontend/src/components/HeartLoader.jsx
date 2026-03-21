// Mini heart loader for buttons and inline use
export function HeartLoader({ className = "w-4 h-4", color = "text-white" }) {
  return (
    <svg
      className={`${className} ${color} animate-pulse`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}