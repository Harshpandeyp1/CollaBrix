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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6  dark:bg-linear-to-br
      dark:from-zinc-800
      dark:via-teal-900
      dark:to-zinc-800">

      {/* Company & Position */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {experience.company}
          </h3>

          <p className="text-indigo-600 font-semibold mt-1 dark:text-zinc-400">
            {experience.position}
          </p>

          {experience.employmentType && (
            <span className="inline-block mt-2 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              {experience.employmentType}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(experience)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition dark:text-white dark:hover:bg-zinc-800 dark:bg-black"
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

      {/* Location */}
      {experience.location && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-400">
          <MapPin size={14} />
          <span>{experience.location}</span>
        </div>
      )}

      {/* Date Range + Duration */}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
        <Calendar size={14} />
        <span>
          {formatDate(experience.startDate)} -{" "}
          {experience.currentlyWorking ? "Present" : formatDate(experience.endDate)}
        </span>
        <span className="text-gray-300">•</span>
        <span>{getDuration(experience.startDate, experience.endDate, experience.currentlyWorking)}</span>

        {experience.currentlyWorking && (
          <span className="ml-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
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
              className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {experience.description && (
        <div className="mt-4 border-t pt-4">
          <p className="text-gray-700 leading-relaxed">
            {experience.description}
          </p>
        </div>
      )}

    </div>
  );
};

export default ExperienceCard;