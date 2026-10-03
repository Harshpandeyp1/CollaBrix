import React from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";

const EducationCard = ({ education, onEdit, onDelete }) => {
  if (!education) return null;

  const handleDelete = () => {
    if (window.confirm(`Delete "${education.institution}"?`)) {
      onDelete(education);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
            {education.institution}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            {education.degree}
            {education.fieldOfStudy ? ` • ${education.fieldOfStudy}` : ""}
          </p>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(education)}
                title="Edit education"
                aria-label="Edit education"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <Pencil size={16} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                title="Delete education"
                aria-label="Delete education"
                className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <Calendar size={14} />
        <span>
          {formatDate(education.startDate)} – {education.currentlyStudying ? "Present" : formatDate(education.endDate)}
        </span>
      </div>

      {education.description && (
        <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600 dark:border-zinc-800 dark:text-zinc-400">
          {education.description}
        </p>
      )}
    </div>
  );
};

export default EducationCard;