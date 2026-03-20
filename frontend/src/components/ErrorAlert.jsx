export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start justify-between">
      <p className="text-sm text-red-700">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-400 hover:text-red-600 text-xl leading-none font-medium"
          aria-label="Dismiss error"
        >
          &times;
        </button>
      )}
    </div>
  );
}
