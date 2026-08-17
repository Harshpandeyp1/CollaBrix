
import React from "react";
import {
  Pencil,
  Trash2,
  GitBranch,
  ExternalLink,
  Users,
  UserCheck,
} from "lucide-react";

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
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const ProjectCard = ({ project, onEdit, onDelete, onViewInterests }) => {

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const isOwner = Number(project.userId) === Number(currentUserId);

  // rest of your code...

  const handleDelete = () => {
    if (window.confirm(`Delete project "${project.title}"?`)) {
      onDelete(project);
    }
  };

  const techList = project.techStack
    ? project.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const statusStyle =
    STATUS_STYLES[project.status] ||
    "text-gray-700 bg-gray-100";
 console.log(
  "Current User:",
  currentUserId,
  "Project Owner:",
  project.userId,
  "Is Owner:",
  isOwner
);
  return (
   
    <div className="flex flex-col h-full bg-white border-zinc-500 dark:bg-zinc-900 rounded-xl overflow-hidden  dark:bg-linear-to-br
      dark:from-zinc-800
      dark:via-teal-900
      dark:to-zinc-800">

      {/* ================= IMAGE ================= */}

      {project.image ? (
        <div className="w-full h-40 bg-gray-100 shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gray-50 dark:bg-zinc-800 shrink-0" />
      )}


      {/* ================= CONTENT ================= */}

      <div className="p-6 flex flex-col flex-1">

        
{/* ================= TITLE & BUTTONS ================= */}

<div className="flex justify-between items-start gap-4">

  {/* ================= PROJECT INFO ================= */}

  <div className="min-w-0 flex-1">

    <h3 className="text-xl font-bold text-gray-900 dark:text-white break-words">
      {project.title}
    </h3>

    <div className="mt-2 flex flex-wrap items-center gap-2">

      {project.status && (
        <span
          className={`
            inline-block
            text-xs
            font-medium
            px-2.5
            py-1
            rounded-full
            ${statusStyle}
          `}
        >
          {formatStatus(project.status)}
        </span>
      )}

      {project.lookingForCollaborators && (
        <span
          className="
            inline-flex
            items-center
            gap-1
            text-xs
            font-medium
            text-indigo-700
            bg-indigo-50
            px-2.5
            py-1
            rounded-full
          "
        >
          <Users size={12} />
          Looking for collaborators
        </span>
      )}

    </div>

  </div>


  {/* ================= ACTION BUTTONS ================= */}

  <div className="flex flex-col gap-2 shrink-0">

    {/* Edit + Delete */}

    <div className="flex gap-2">

      <button
        onClick={() => onEdit(project)}
        className="
          flex
          items-center
          gap-1
          rounded-lg
          border
          border-gray-300
          px-3
          py-1.5
          text-sm
          text-gray-700
          hover:bg-gray-100
          transition
          dark:bg-black
          dark:text-white
          dark:hover:bg-zinc-800
        "
      >
        <Pencil size={14} />
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="
          flex
          items-center
          gap-1
          rounded-lg
          border
          border-red-300
          px-3
          py-1.5
          text-sm
          text-red-600
          hover:bg-red-50
          transition
        "
      >
        <Trash2 size={14} />
        Delete
      </button>

    </div>


    {/* Interests */}

    {project.lookingForCollaborators && isOwner&&(
      <button
        type="button"
        onClick={() => onViewInterests(project)}
        className="
          w-full
          flex
          items-center
          justify-center
          gap-1.5
          rounded-lg
          border
          border-indigo-300
          px-3
          py-1.5
          text-sm
          font-medium
          text-indigo-600
          hover:bg-indigo-50
          transition
          dark:border-indigo-800
          dark:text-indigo-400
          dark:hover:bg-indigo-950
        "
      >
        <UserCheck size={14} />
        Interests
      </button>
    )}

  </div>

</div>




        {/* ================= DESCRIPTION ================= */}

        <div className="mt-3 h-20 overflow-hidden dark:text-zinc-400">

          {project.description && (
            <p className="text-gray-700 leading-relaxed dark:text-zinc-400">
              {project.description}
            </p>
          )}

        </div>


        {/* ================= TECH STACK ================= */}

        <div className="mt-4 min-h-8">

          {techList.length > 0 && (
            <div className="flex flex-wrap gap-1.5">

              {techList.map((tech, i) => (
                <span
                  key={i}
                  className="
                    text-xs
                    bg-gray-100
                    dark:bg-zinc-800
                    text-gray-700
                    dark:text-zinc-300
                    px-2.5
                    py-1
                    rounded-full
                  "
                >
                  {tech}
                </span>
              ))}

            </div>
          )}

        </div>


        {/* ================= INTEREST BUTTON ================= */}

       

        {/* ================= LINKS ================= */}

        <div className="mt-auto">

          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-4 border-t pt-4 flex flex-wrap gap-4">

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    text-gray-700
                    dark:text-zinc-300
                    hover:text-indigo-600
                    transition
                  "
                >
                  <GitBranch size={16} />
                  GitHub
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    text-gray-700
                    dark:text-zinc-300
                    hover:text-indigo-600
                    transition
                  "
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProjectCard;

