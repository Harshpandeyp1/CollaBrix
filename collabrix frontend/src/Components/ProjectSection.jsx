
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ProjectInterestModal from "./ProjectInterestModal.jsx";
import {
  getProjects,
  getProjectsByUserId,
  deleteProject,

} from "../Services/Project.js";

import ProjectCard from "./ProjectCard.jsx";
import ProjectModal from "./ProjectModal.jsx";

const ProjectSection = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [interestOpen, setInterestOpen] = useState(false);
  const [interestProject, setInterestProject] = useState(null);
  const isOwnProfile = !userId;
 
  // =========================================
  // FETCH PROJECTS
  // =========================================
const handleViewInterests = (project) => {
  setInterestProject(project);
  setInterestOpen(true);
};

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const data = userId
        ? await getProjectsByUserId(userId)
        : await getProjects();

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
  }, [userId]);

  // =========================================
  // EDIT PROJECT
  // =========================================

  const handleEdit = (project) => {
    if (!isOwnProfile) return;
    setSelectedProject(project);
    setOpen(true);
  };

  // =========================================
  // DELETE PROJECT
  // =========================================

  const handleDelete = async (projectOrId) => {
    if (!isOwnProfile) return;
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

        {isOwnProfile && <button
          type="button"
          onClick={() => {
            setSelectedProject(null);
            setOpen(true);
          }}
          title="Add project"
          aria-label="Add project"
          className="
            shrink-0
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-sky-600
            text-white
            shadow-sm
            shadow-sky-500/20
            transition
            hover:bg-sky-700
          "
        >
          <Plus size={20} />
        </button>}

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
              onEdit={isOwnProfile ? handleEdit : undefined}
              onDelete={isOwnProfile ? handleDelete : undefined}
              onViewInterests={isOwnProfile ? handleViewInterests : undefined}
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

      {isOwnProfile && <ProjectInterestModal
        open={interestOpen}
        project={interestProject}
        onClose={() => {
          setInterestOpen(false);
          setInterestProject(null);
        }}
      />}

      {isOwnProfile && <ProjectModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedProject(null);
        }}
        onSave={handleSaved}
        project={selectedProject}
      />}

    </section>
  );
};

export default ProjectSection;
