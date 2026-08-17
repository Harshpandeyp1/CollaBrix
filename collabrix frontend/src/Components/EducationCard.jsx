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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden p-3 flex flex-col
    dark:bg-linear-to-br
      dark:from-zinc-800
      dark:via-teal-900
      dark:to-zinc-800">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {education.institution}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
            {education.degree}
            {education.fieldOfStudy ? ` • ${education.fieldOfStudy}` : ""}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(education)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition dark:bg-black dark:text-white dark:hover:bg-zinc-700"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 ">
        <Calendar size={14} />
        <span>
          {formatDate(education.startDate)} – {education.currentlyStudying ? "Present" : formatDate(education.endDate)}
        </span>
      </div>

      {education.description && (
        <p className="mt-4 text-sm text-gray-700 leading-relaxed dark:text-zinc-400">
          {education.description}
        </p>
      )}
    </div>
  );
};

export default EducationCard;