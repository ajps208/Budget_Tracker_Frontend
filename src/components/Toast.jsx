export default function Toast({ message, tone = "info", onClose }) {
  if (!message) return null;

  const bg =
    tone === "success"
      ? "bg-green-500"
      : tone === "danger"
      ? "bg-red-500"
      : "bg-gray-800";

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-4 py-2 rounded shadow`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
