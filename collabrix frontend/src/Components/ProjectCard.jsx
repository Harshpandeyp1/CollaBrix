import React from "react";
import { Pencil, Trash2, GitBranch, ExternalLink, Users } from "lucide-react";

const STATUS_STYLES = {
  PLANNING: "text-gray-700 bg-gray-100",
  IN_PROGRESS: "text-blue-700 bg-blue-50",
  COMPLETED: "text-green-700 bg-green-50",
  ON_HOLD: "text-yellow-700 bg-yellow-50",
  ARCHIVED: "text-gray-500 bg-gray-100",
};

const formatStatus = (status) => {
  if (!status) return "";
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.title}"?`)) {
      onDelete(project);
    }
  };

  const techList = project.techStack
    ? project.techStack.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const statusStyle = STATUS_STYLES[project.status] || "text-gray-700 bg-gray-100";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden">

      {/* Image */}
      {project.image && (
        <div className="w-full h-40 bg-gray-100">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Title & Buttons */}
        <div className="flex justify-between items-start gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {project.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {project.status && (
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${statusStyle}`}>
                  {formatStatus(project.status)}
                </span>
              )}

              {project.lookingForCollaborators && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  <Users size={12} /> Looking for collaborators
                </span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit(project)}
              className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
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

        {/* Description */}
        {project.description && (
          <p className="mt-3 text-gray-700 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Tech Stack */}
        {techList.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techList.map((tech, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-4 border-t pt-4 flex flex-wrap gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-indigo-600 transition"
              >
                <GitBranch size={16} /> GitHub
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-indigo-600 transition"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;