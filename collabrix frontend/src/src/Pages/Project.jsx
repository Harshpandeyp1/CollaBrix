import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Components/Navbar";
import { getProfile } from "../Services/Profile.js";
import { getProjects, deleteProject } from "../Services/Project.js";
import ProjectCard from "../Components/ProjectCard.jsx";
import ProjectInterestModal from "../Components/ProjectInterestModal.jsx";
import ProjectModal from "../Components/ProjectModal.jsx";
import ProjectDetailModal from "../Components/ProjectDetailModal";
import { BookmarkCheck } from "lucide-react";
import { getSavedProjects, unsaveProject } from "../Services/Project.js";
const Project = () => {
  const [projects, setProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");
  const [unsavingIds, setUnsavingIds] = useState({});
  const [activeTab, setActiveTab] = useState("mine");
  const [selectedProject, setSelectedProject] = useState(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedProjects = useCallback(async () => {
    try {
      setSavedLoading(true);
      setSavedError("");
      const data = await getSavedProjects();
      setSavedProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching saved projects:", error);
      setSavedProjects([]);
      setSavedError(
        error.response?.data?.message || "Unable to load saved projects."
      );
    } finally {
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchSavedProjects();
    fetchCurrentUser();
  }, [fetchProjects, fetchSavedProjects]);

  const handleCreateNew = () => {
    setSelectedProject(null);
    setProjectModalOpen(true);
  };

  const fetchCurrentUser = async () => {
  try {
    const response = await getProfile();
    setCurrentUserId(response.id);
  } catch (error) {
    console.error("Error fetching current user:", error);
  }
};

  const handleEdit = (project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  const handleViewInterests = (project) => {
    setSelectedProject(project);
    setInterestModalOpen(true);
  };
  const handleViewProject = (project) => {
  setSelectedProject(project);
  setDetailModalOpen(true);
};

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleUnsaveProject = async (project) => {
    const projectId = project.id ?? project._id;
    if (projectId == null) {
      setSavedError("This project cannot be removed because it has no ID.");
      return;
    }

    setUnsavingIds((current) => ({ ...current, [projectId]: true }));
    setSavedError("");

    try {
      await unsaveProject(projectId);
      setSavedProjects((current) =>
        current.filter(
          (item) => String(item.id ?? item._id) !== String(projectId)
        )
      );
    } catch (error) {
      console.error("Error removing saved project:", error);
      setSavedError(
        error.response?.data?.message || "Unable to remove saved project."
      );
    } finally {
      setUnsavingIds((current) => ({ ...current, [projectId]: false }));
    }
  };

  const displayedProjects =
    activeTab === "mine" ? projects : savedProjects;
  const displayedLoading =
    activeTab === "mine" ? loading : savedLoading;

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-[#FDFBD4] px-4 py-8 dark:bg-black">
        <div className="mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {activeTab === "mine" ? "My Projects" : "Saved Projects"}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                {activeTab === "mine"
                  ? "Manage your projects and find people interested in collaborating."
                  : "Projects you bookmarked from the discovery feed."}
              </p>
            </div>

            {activeTab === "mine" && (
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                + Create Project
              </button>
            )}
          </div>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("mine")}
              aria-pressed={activeTab === "mine"}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "mine"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              My Projects ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              aria-pressed={activeTab === "saved"}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "saved"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <BookmarkCheck size={16} />
              Saved Projects ({savedProjects.length})
            </button>
          </div>

          {activeTab === "saved" && savedError && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <span>{savedError}</span>
              <button
                type="button"
                onClick={fetchSavedProjects}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {displayedLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Loading {activeTab === "mine" ? "projects" : "saved projects"}...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!displayedLoading && displayedProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-12 text-center backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {activeTab === "mine"
                  ? "No projects found"
                  : "No saved projects yet"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                {activeTab === "mine"
                  ? "Create your first project to start finding collaborators."
                  : "Bookmark a project from the discovery feed to find it here."}
              </p>
              {activeTab === "mine" && (
                <button
                  onClick={handleCreateNew}
                  className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Create Project
                </button>
              )}
            </div>
          )}

          {/* Projects Grid */}
          {!displayedLoading && displayedProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project) => (
               <ProjectCard
                key={project.id ?? project._id}
                project={project}
                currentUserId={currentUserId}
                onEdit={activeTab === "mine" ? () => handleEdit(project) : undefined}
                onDelete={activeTab === "mine" ? () => handleDelete(project.id ?? project._id) : undefined}
                onViewInterests={activeTab === "mine" ? () => handleViewInterests(project) : undefined}
                onViewProject={handleViewProject}
                onUnsave={activeTab === "saved" ? () => handleUnsaveProject(project) : undefined}
                unsaving={unsavingIds[project.id ?? project._id]}
              />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals rendered at root */}
      <ProjectModal
        open={projectModalOpen}
        project={selectedProject}
        onClose={() => {
          setProjectModalOpen(false);
          setSelectedProject(null);
        }}
        onSave={() => {
          setProjectModalOpen(false);
          setSelectedProject(null);
          fetchProjects();
        }}
      />

      <ProjectInterestModal
        open={interestModalOpen}
        project={selectedProject}
        onClose={() => {
          setInterestModalOpen(false);
          setSelectedProject(null);
        }}
      />
     <ProjectDetailModal 
      project={selectedProject}
      open={detailModalOpen}
      onClose={() => {
        setDetailModalOpen(false);
        setSelectedProject(null);
      }}
    />
    </>
  );
};

export default Project;