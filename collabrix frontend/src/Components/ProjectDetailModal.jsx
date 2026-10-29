import React, { useEffect, useMemo,useState} from "react";
import { ExternalLink, X, Users } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { getProjectById } from "../Services/Project.js";
const ProjectDetailModal = ({ project, open, onClose }) => {


  const [projectDetails ,setProjectDetails]=useState(null);
  const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   useEffect(()=>{
    if (!open || !project?.id) {
    return;
  }

 
  const fetchProjectDetails=async()=>{
    try{
      setLoading(true);
      setError("");

      const data=await getProjectById(project.id);
      setProjectDetails(data);
    }catch (err) {
  console.error("error fetching the detail", err);

  setError(
    err?.response?.data?.message ||
    "Unable to load project details."
  );

    }finally{
      setLoading(false);
        }
  }
  fetchProjectDetails();
   },[open,project?.id]);


  // Handle 'Escape' key press and prevent background page scrolling when modal is open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Disable background scrolling

    // Cleanup when modal closes or unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // Restore background scrolling
    };
  }, [open, onClose]);
  
   const displayProject=projectDetails||project;
  // Convert techStack into an array regardless of whether it was passed as an array or comma-separated string
  const techList = useMemo(() => {
  if (!displayProject?.techStack) return [];

  if (Array.isArray(displayProject.techStack)) {
    return displayProject.techStack;
  }

  return displayProject.techStack
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
}, [displayProject?.techStack]);
  // Early return if modal is closed or project is missing
  if (!open || !project) {
    return null;
  }
   const hasLinks = displayProject.githubUrl ||displayProject.liveUrl;
 
  return (
    <>
    {loading && (
  <p className="mt-4 text-sm text-slate-500">
    Loading project details...
  </p>
)}

{error && (
  <p className="mt-4 text-sm text-red-500">
    {error}
  </p>
)}

    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()} // Stop click from closing modal when clicking inside card
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Header: Title, Status Badges & Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="modal-project-title"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              {displayProject.title}
            </h2>

            {/* Status & Collaborator Badges */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {displayProject.status && (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {displayProject.status.toLowerCase().replace(/_/g, " ")}
                </span>
              )}

              {displayProject.lookingForCollaborators && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Users size={12} />
                  Looking for collaborators
                </span>
              )}
            </div>
          </div>

          {/* Close Icon Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Project Image */}
        {displayProject.image && (
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800">
            <img
              src={displayProject.image}
              alt={displayProject.title}
              className="max-h-72 w-full object-cover"
            />
          </div>
        )}

        {/* About Section */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            About this project
          </h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
            {displayProject.description || "No description provided."}
          </p>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
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

        {/* Project Links (Only shown if at least one link exists) */}
        {hasLinks && (
          <div className="mt-6 border-t border-slate-100 pt-5 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              Project Links
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {displayProject.githubUrl && (
                <a
                  href={displayProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <FaGithub size={16} />
                  GitHub
                </a>
              )}

              {displayProject.liveUrl && (
                <a
                  href={displayProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        )}

        {/* Collaboration Section */}
        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Collaboration
          </h3>
          <div
            className={`mt-3 rounded-xl border p-4 ${
              displayProject.lookingForCollaborators
                ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                : "border-slate-200 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-800/40"
            }`}
          >
            {displayProject.lookingForCollaborators ? (
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Open for contributions
                </p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  The author is looking for teammates. Reach out or check the repository to contribute.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                This project is not currently looking for collaborators.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectDetailModal;