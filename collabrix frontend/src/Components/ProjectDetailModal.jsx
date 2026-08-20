import React, { useEffect } from "react";

const ProjectDetailModal = ({ project, open, onClose }) => {

    useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  if (open) {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "unset";
  };
}, [open, onClose]);
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open || !project) {
    return null;
  }

  const techList = Array.isArray(project.techStack)
    ? project.techStack
    : project.techStack
    ? project.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside modal
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Header: Title + Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="modal-project-title"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {project.title}
            </h2>

            {/* Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {project.status && (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {project.status.toLowerCase().replace(/_/g, " ")}
                </span>
              )}

              {project.lookingForCollaborators && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Looking for collaborators
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800">
            <img
              src={project.image}
              alt={project.title}
              className="max-h-72 w-full object-cover"
            />
          </div>
        )}

        {/* About Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            About this project
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-zinc-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Tech Stack
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {techList.length > 0 ? (
              techList.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 dark:text-zinc-500">
                No technologies specified.
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;