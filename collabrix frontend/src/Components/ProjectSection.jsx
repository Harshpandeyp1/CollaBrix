
import React, { useState, useEffect } from "react";
import ProjectInterestModal from "./ProjectInterestModal.jsx";
import {
  getProjects,
  deleteProject,
  getProjectInterests
} from "../Services/Project.js";

import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [interestOpen, setInterestOpen] = useState(false);
  const [interestProject, setInterestProject] = useState(null);
  const [interests, setInterests] = useState([]);
const [interestLoading, setInterestLoading] = useState(false);
  // =========================================
  // FETCH PROJECTS
  // =========================================
const handleViewInterests = async (project) => {
  try {
    setInterestProject(project);
    setInterestLoading(true);

    const data = await getProjectInterests(project.id);

    setInterests(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching project interests:", error);
    setInterests([]);
  } finally {
    setInterestLoading(false);
  }
};

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = await getProjects();

      console.log("Project fetch response:", data);

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================================
  // EDIT PROJECT
  // =========================================

  const handleEdit = (project) => {
    setSelectedProject(project);
    setOpen(true);
  };

  // =========================================
  // DELETE PROJECT
  // =========================================

  const handleDelete = async (projectOrId) => {
    const id =
      typeof projectOrId === "string"
        ? projectOrId
        : projectOrId?.id ?? projectOrId?._id;

    if (!id) {
      console.error(
        "Error deleting project: missing id",
        projectOrId
      );
      return;
    }

    try {
      await deleteProject(id);

      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // =========================================
  // SAVE PROJECT
  // =========================================

  const handleSaved = async () => {
    setOpen(false);
    setSelectedProject(null);

    await fetchProjects();
  };

  // =========================================
  // UI
  // =========================================

  return (
    <section className="     w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80 dark:bg-zinc-800
">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Projects
          </h2>

          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Manage your projects.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProject(null);
            setOpen(true);
          }}
          className="
            shrink-0
            rounded-xl
            bg-sky-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            shadow-sm
            shadow-sky-500/20
            transition
            hover:bg-sky-700
          "
        >
          Add Project
        </button>

      </div>

      {/* =====================================
          PROJECTS
      ====================================== */}

      {loading ? (

        <p className="text-sm text-gray-600">
          Loading projects...
        </p>

      ) : projects.length > 0 ? (

        <div
          className="
            flex
            gap-4
            w-full
            overflow-x-auto
            overflow-y-hidden
            pb-2
            scroll-smooth
            snap-x
            snap-mandatory
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {projects.map((project) => (

            <div
              key={
                project.id ??
                project._id ??
                project.title
              }
            className="
            min-w-[320px]
            max-w-[320px]
            h-[380px]
            shrink-0
            snap-start
          ">

              <ProjectCard
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewInterests={handleViewInterests}
            />
            </div>

          ))}

        </div>

      ) : (

        <p className="text-sm text-gray-600">
          No project data found.
        </p>

      )}

      {/* =====================================
          MODALS
      ====================================== */}

      <ProjectInterestModal
        open={interestOpen}
        project={interestProject}
        onClose={() => {
          setInterestOpen(false);
          setInterestProject(null);
        }}
      />

      <ProjectModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaved}
        project={selectedProject}
      />

    </section>
  );
};

export default ProjectSection;

