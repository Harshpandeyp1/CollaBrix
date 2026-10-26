import React, { useCallback, useEffect, useState } from "react";
import { BookmarkCheck, Layers, X } from "lucide-react";
import Navbar from "../Components/Navbar";
import { getSavedProjects, unsaveProject } from "../Services/Project";

const SavedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unsavingIds, setUnsavingIds] = useState({});

  const fetchSavedProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSavedProjects();
      const savedProjects = Array.isArray(response)
        ? response
        : response?.projects ?? response?.data ?? [];

      setProjects(savedProjects);
    } catch (fetchError) {
      console.error("Failed to load saved projects:", fetchError);
      setError(
        fetchError.response?.data?.message ||
          "Unable to load saved projects right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedProjects();
  }, [fetchSavedProjects]);

  const handleUnsave = async (project) => {
    const projectId = project.id ?? project._id;
    if (projectId == null) {
      setError("This project cannot be removed because it has no ID.");
      return;
    }

    setUnsavingIds((current) => ({ ...current, [projectId]: true }));
    setError("");

    try {
      await unsaveProject(projectId);
      setProjects((current) =>
        current.filter(
          (item) => String(item.id ?? item._id) !== String(projectId)
        )
      );
    } catch (unsaveError) {
      console.error("Failed to remove saved project:", unsaveError);
      setError(
        unsaveError.response?.data?.message ||
          "Unable to remove this saved project."
      );
    } finally {
      setUnsavingIds((current) => ({ ...current, [projectId]: false }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] w-full bg-[#FDFBD4] px-4 py-8 dark:bg-black">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-center gap-3">
            <BookmarkCheck
              aria-hidden="true"
              className="text-amber-500"
              size={28}
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Saved Projects
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                Projects you bookmarked from the feed.
              </p>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchSavedProjects}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="py-20 text-center text-sm text-slate-500 dark:text-zinc-400"
            >
              Loading saved projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
              <Layers
                aria-hidden="true"
                className="mb-3 text-amber-500"
                size={32}
              />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                No saved projects yet
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Use the bookmark on a project in the feed to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const projectId = project.id ?? project._id;
                const techStack = Array.isArray(project.techStack)
                  ? project.techStack
                  : (project.techStack || "")
                      .split(",")
                      .map((tech) => tech.trim())
                      .filter(Boolean);

                return (
                  <article
                    key={projectId}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title || "Project preview"}
                        className="h-44 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {project.title || "Untitled Project"}
                        </h2>
                        <button
                          type="button"
                          onClick={() => handleUnsave(project)}
                          disabled={unsavingIds[projectId]}
                          aria-label={`Remove ${project.title || "project"} from saved projects`}
                          className="shrink-0 rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-zinc-800"
                        >
                          <X size={17} />
                        </button>
                      </div>
                      {project.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                          {project.description}
                        </p>
                      )}
                      {techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {techStack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {(project.fullName ||
                        project.username ||
                        project.createdByUsername) && (
                        <p className="mt-auto pt-4 text-xs text-slate-500 dark:text-zinc-500">
                          Shared by{" "}
                          {project.fullName ||
                            project.username ||
                            project.createdByUsername}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedProjects;
