import React from "react";
import {
  Pencil,
  Trash2,
  ExternalLink,
  ImageOff,
  Award,
  FileText,
  Globe,
  PlayCircle,
} from "lucide-react";

const TYPE_STYLES = {
  GITHUB: "border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  PORTFOLIO: "border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300",
  CERTIFICATE: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  RESUME: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  VIDEO: "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  OTHER: "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
};

const getTypeIcon = (type) => {
  switch (type) {
    case "PORTFOLIO":
      return <Globe size={14} />;
    case "CERTIFICATE":
      return <Award size={14} />;
    case "RESUME":
      return <FileText size={14} />;
    case "VIDEO":
      return <PlayCircle size={14} />;
    default:
      return <ExternalLink size={14} />;
  }
};

const formatType = (type) => {
  if (!type) return "";

  return type
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const FeaturedCard = ({ featured, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${featured.title}"?`)) {
      onDelete(featured);
    }
  };

  return (
    <div className="group flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">

      {/* Thumbnail */}

      <a
        href={featured.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="aspect-video flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-zinc-800">

          {featured.thumbnail ? (
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageOff size={30} />
              <span className="text-xs mt-1">No Preview</span>
            </div>
          )}

        </div>
      </a>

      {/* Body */}

      <div className="flex min-h-0 flex-1 flex-col p-5">

        <span
          className={`inline-flex w-fit items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium ${
            TYPE_STYLES[featured.type] || "border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {getTypeIcon(featured.type)}
          {formatType(featured.type)}
        </span>

        <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
          {featured.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
          {featured.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800">

          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 transition hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            <ExternalLink size={15} />
            Visit
          </a>

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(featured)}
                  type="button"
                  title="Edit featured item"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                  aria-label="Edit featured item"
                >
                  <Pencil size={16} />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={handleDelete}
                  type="button"
                  title="Delete featured item"
                  className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  aria-label="Delete featured item"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default FeaturedCard;