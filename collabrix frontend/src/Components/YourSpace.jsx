import { useNavigate } from "react-router-dom";

const spaceItems = [
  { icon: "🔖", label: "Saved Ideas", path: "/saved-ideas" },
  { icon: "📁", label: "Saved Projects", path: "/saved-projects" },
  { icon: "💡", label: "My Ideas", path: "/ideas" },
  { icon: "🚀", label: "My Projects", path: "/project" },
  { icon: "👥", label: "My Connections", path: "/connection" },
];

const YourSpace = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`rounded-2xl border border-sky-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <h2 className="mb-4 text-base font-semibold text-slate-800 dark:text-white">
        Your Space
      </h2>

      <div className="space-y-1">
        {spaceItems.map(({ icon, label, path }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 transition hover:bg-sky-50 hover:text-sky-600 dark:text-white dark:hover:bg-zinc-800"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default YourSpace;