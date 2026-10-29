import React from 'react'
import { useState, useEffect } from 'react'
import { createProject, updateProject } from '../Services/Project.js'
import ModalPortal from "./ModalPortal.jsx";

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "ARCHIVED", label: "Archived" },
];

const ProjectModal = ({ open, onClose, onSave, project }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    image: "",
    status: "PLANNING",
    lookingForCollaborators: false
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        techStack: project.techStack || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        image: project.image || "",
        status: project.status || "PLANNING",
        lookingForCollaborators: project.lookingForCollaborators || false
      });
    } else {
      setFormData({
        title: "",
        description: "",
        techStack: "",
        githubUrl: "",
        liveUrl: "",
        image: "",
        status: "PLANNING",
        lookingForCollaborators: false
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      image: formData.image,
      status: formData.status,
      lookingForCollaborators: formData.lookingForCollaborators,
    };

    try {
      if (project) {
        const projectId = project.id ?? project._id;
        await updateProject(projectId, payload);
      } else {
        await createProject(payload);
      }
      onSave();
    } catch (error) {
      const status = error?.response?.status;
      const errorData = error?.response?.data;
      const message = errorData?.message || errorData?.error || error?.message || "Unable to save project.";
      setErrorMessage(`Save failed${status ? ` (${status})` : ''}: ${message}`);
      console.error("Project save failed", {
        status,
        errorData,
        error,
      });
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-lg dark:bg-black">

        <h2 className="mb-4 shrink-0 text-xl font-bold text-gray-900">
          {project ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="Tech Stack (comma separated, e.g. React, Node.js, MongoDB)"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            placeholder="Live Demo URL"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="lookingForCollaborators"
              checked={formData.lookingForCollaborators}
              onChange={handleChange}
            />
            Looking for collaborators
          </label>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
    </ModalPortal>
  )
}

export default ProjectModal