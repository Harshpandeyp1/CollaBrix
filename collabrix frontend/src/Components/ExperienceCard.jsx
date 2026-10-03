import React from "react";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const getDuration = (start, end, currentlyWorking) => {
  if (!start) return "";
  const startDate = new Date(start);
  const endDate = currentlyWorking ? new Date() : end ? new Date(end) : new Date();

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  if (months < 0) months = 0;

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (remMonths > 0) parts.push(`${remMonths} mo${remMonths > 1 ? "s" : ""}`);
  return parts.length ? parts.join(" ") : "< 1 mo";
};

const ExperienceCard = ({ experience, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete experience at ${experience.company}?`)) {
      onDelete(experience);
    }
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">

      {/* Company & Position */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
            {experience.company}
          </h3>

          <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            {experience.position}
          </p>

          {experience.employmentType && (
            <span className="mt-2 inline-block rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300">
              {experience.employmentType}
            </span>
          )}
        </div>

        {/* Buttons */}
        {(onEdit || onDelete) && (
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(experience)}
                title="Edit experience"
                aria-label="Edit experience"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <Pencil size={16} />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                title="Delete experience"
                aria-label="Delete experience"
                className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Location */}
      {experience.location && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <MapPin size={14} />
          <span>{experience.location}</span>
        </div>
      )}

      {/* Date Range + Duration */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <Calendar size={14} />
        <span>
          {formatDate(experience.startDate)} -{" "}
          {experience.currentlyWorking ? "Present" : formatDate(experience.endDate)}
        </span>
        <span className="text-gray-300">•</span>
        <span>{getDuration(experience.startDate, experience.endDate, experience.currentlyWorking)}</span>

        {experience.currentlyWorking && (
          <span className="ml-1 rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            Current
          </span>
        )}
      </div>

      {/* Skills */}
      {experience.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {experience.skills.map((skill, i) => (
            <span
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {experience.description && (
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-zinc-800">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {experience.description}
          </p>
        </div>
      )}

    </div>
  );
};

export default ExperienceCard;