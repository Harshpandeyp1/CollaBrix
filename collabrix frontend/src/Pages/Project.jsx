import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Components/Navbar";
import { getProjects, deleteProject } from "../Services/Project.js";
import ProjectCard from "../Components/ProjectCard.jsx";
import ProjectInterestModal from "../Components/ProjectInterestModal.jsx";
import ProjectModal from "../Components/ProjectModal.jsx";
import ProjectDetailModal from "../Components/ProjectDetailModal";
const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateNew = () => {
    setSelectedProject(null);
    setProjectModalOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
  };

  const handleViewInterests = (project) => {
    setSelectedProject(project);
    setInterestModalOpen(true);
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

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-teal-100 to-blue-100 px-4 py-8 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        <div className="mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                My Projects
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                Manage your projects and find people interested in collaborating.
              </p>
            </div>

            <button
              onClick={handleCreateNew}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              + Create Project
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Loading projects...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-12 text-center backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                No projects found
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Create your first project to start finding collaborators.
              </p>
              <button
                onClick={handleCreateNew}
                className="mt-6 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                Create Project
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => handleEdit(project)}
                  onDelete={() => handleDelete(project.id)}
                  onViewInterests={() => handleViewInterests(project)}
                  onViewProject={(project) => setSelectedProject(project)}
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
        open={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};

export default Project;