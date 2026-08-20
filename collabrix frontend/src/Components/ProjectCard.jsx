import React from "react";
import {
  Pencil,
  Trash2,
  GitBranch,
  ExternalLink,
  Users,
  UserCheck,
  Eye,
  Layers,
} from "lucide-react";

const STATUS_CONFIG = {
  PLANNING: {
    label: "Planning",
    badge: "bg-slate-900/80 text-slate-200 border-slate-700/50 backdrop-blur-md",
    dot: "bg-slate-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badge: "bg-blue-950/80 text-blue-200 border-blue-800/50 backdrop-blur-md",
    dot: "bg-blue-400 animate-pulse",
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-emerald-950/80 text-emerald-200 border-emerald-800/50 backdrop-blur-md",
    dot: "bg-emerald-400",
  },
  ON_HOLD: {
    label: "On Hold",
    badge: "bg-amber-950/80 text-amber-200 border-amber-800/50 backdrop-blur-md",
    dot: "bg-amber-400",
  },
  ARCHIVED: {
    label: "Archived",
    badge: "bg-zinc-900/80 text-zinc-400 border-zinc-700/50 backdrop-blur-md",
    dot: "bg-zinc-500",
  },
};

const normalizeUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

const ProjectCard = ({
  project = {},
  onEdit,
  onDelete,
  onViewInterests,
  onViewProject,
}) => {
  // Safe authentication parsing
  let currentUserId = null;
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    currentUserId = currentUser?.id ?? currentUser?._id;
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
  }

  const isOwner = Boolean(
    currentUserId && Number(project?.userId) === Number(currentUserId)
  );

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project?.title}"?`)) {
      onDelete?.(project);
    }
  };

  const techList = Array.isArray(project?.techStack)
    ? project.techStack
    : project?.techStack
    ? project.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const statusKey = project?.status?.toUpperCase();
  const statusDetails = STATUS_CONFIG[statusKey] || {
    label: project?.status || "Draft",
    badge: "bg-slate-900/80 text-slate-200 border-slate-700/50 backdrop-blur-md",
    dot: "bg-slate-400",
  };

  const interestCount =
    project?.interestCount ??
    (Array.isArray(project?.interests) ? project.interests.length : null);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      {/* ================= CARD MEDIA / BANNER ================= */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-zinc-800">
        {project?.image ? (
          <img
            src={project.image}
            alt={project.title || "Project preview"}
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-50/50 via-slate-100 to-sky-50 dark:from-zinc-900 dark:via-zinc-800/60 dark:to-zinc-900">
            <div className="rounded-xl bg-white/80 p-3 shadow-xs backdrop-blur-xs dark:bg-zinc-800/80">
              <Layers className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
            </div>
            <span className="mt-2 text-xs font-medium text-slate-400 dark:text-zinc-500">
              No preview available
            </span>
          </div>
        )}

        {/* Top Badges Overlay */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {/* Status Badge */}
          {project?.status && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusDetails.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusDetails.dot}`} />
              {statusDetails.label}
            </span>
          )}

          {/* Owner Quick Controls */}
          {isOwner && (
            <div className="ml-auto flex items-center gap-1 rounded-full border border-white/20 bg-black/60 p-1 backdrop-blur-md transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(project);
                }}
                aria-label="Edit project"
                className="rounded-full p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <Pencil size={13} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete project"
                className="rounded-full p-1.5 text-rose-300 transition hover:bg-rose-500/30 hover:text-rose-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Collaborators Floating Pill */}
        {project?.lookingForCollaborators && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/80 px-2.5 py-1 text-[11px] font-semibold text-indigo-200 shadow-sm backdrop-blur-md">
              <Users size={12} className="text-indigo-400" />
              Recruiting
            </span>
          </div>
        )}
      </div>

      {/* ================= CARD BODY ================= */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3
          title={project?.title}
          className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
        >
          {project?.title || "Untitled Project"}
        </h3>

        {/* Description */}
        <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
          {project?.description ||
            "No description provided for this project yet."}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {techList.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
          {techList.length > 4 && (
            <span className="rounded-lg border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-500">
              +{techList.length - 4}
            </span>
          )}
        </div>

        {/* ================= CARD FOOTER ================= */}
        <div className="mt-auto pt-5">
          {/* External Code/Live Links */}
          {(project?.githubUrl || project?.liveUrl) && (
            <div className="mb-3.5 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
              {project.githubUrl && (
                <a
                  href={normalizeUrl(project.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-medium transition hover:text-slate-900 dark:hover:text-white"
                >
                  <GitBranch size={13} className="text-slate-400" />
                  Repository
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={normalizeUrl(project.liveUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-medium transition hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <ExternalLink size={13} className="text-slate-400" />
                  Live Preview
                </a>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {onViewProject && (
              <button
                type="button"
                onClick={() => onViewProject(project)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <Eye size={14} />
                Details
              </button>
            )}

            {project?.lookingForCollaborators && isOwner && onViewInterests && (
              <button
                type="button"
                onClick={() => onViewInterests(project)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 active:scale-[0.98] dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
              >
                <UserCheck size={14} />
                <span>Interests</span>
                {interestCount !== null && interestCount > 0 && (
                  <span className="ml-0.5 rounded-full bg-indigo-200/70 px-1.5 py-0.2 text-[10px] font-bold text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200">
                    {interestCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;