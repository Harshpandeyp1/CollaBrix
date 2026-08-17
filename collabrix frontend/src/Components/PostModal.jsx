import React, { useEffect, useState } from "react";
import { createPost, updatePost } from "../Services/Post";

const STATUS_OPTIONS = [
  { value: "IDEA", label: "Idea" },
  { value: "BUILDING", label: "Building" },
  { value: "MVP_READY", label: "MVP Ready" },
  { value: "COMPLETED", label: "Completed" },
];

const PostModal = ({ open, onClose, onSave, post }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    rolesNeeded: "",
    status: "IDEA",
    teamSizeNeeded: "",
    duration: "",
    githubUrl: "",
    demoUrl: "",
    bannerImage: "",
    tags: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        description: post.description || "",
        techStack: post.techStack?.join(", ") || "",
        rolesNeeded: post.rolesNeeded?.join(", ") || "",
        status: post.status || "IDEA",
        teamSizeNeeded: post.teamSizeNeeded || "",
        duration: post.duration || "",
        githubUrl: post.githubUrl || "",
        demoUrl: post.demoUrl || "",
        bannerImage: post.bannerImage || "",
        tags: post.tags?.join(", ") || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        techStack: "",
        rolesNeeded: "",
        status: "IDEA",
        teamSizeNeeded: "",
        duration: "",
        githubUrl: "",
        demoUrl: "",
        bannerImage: "",
        tags: "",
      });
    }
  }, [post]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const convertToArray = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: convertToArray(formData.techStack),
      rolesNeeded: convertToArray(formData.rolesNeeded),
      status: formData.status,
      teamSizeNeeded: Number(formData.teamSizeNeeded),
      duration: formData.duration,
      githubUrl: formData.githubUrl,
      demoUrl: formData.demoUrl,
      bannerImage: formData.bannerImage,
      tags: convertToArray(formData.tags),
    };

    try {
      if (post) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }

      onSave();
      onClose();
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to create post."
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-5">

      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto dark:bg-black ">

        <h2 className="text-2xl font-bold mb-6">
          {post ? "Edit Idea" : "Share an Idea"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Describe your idea..."
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
            required
          />

          <input
            name="techStack"
            placeholder="React, Spring Boot, MySQL..."
            value={formData.techStack}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="rolesNeeded"
            placeholder="Frontend Developer, UI Designer..."
            value={formData.rolesNeeded}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <div className="grid md:grid-cols-3 gap-4">

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded-xl p-3"
            >
              {STATUS_OPTIONS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="teamSizeNeeded"
              placeholder="Team Size"
              value={formData.teamSizeNeeded}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

            <input
              name="duration"
              placeholder="2 Months"
              value={formData.duration}
              onChange={handleChange}
              className="border rounded-xl p-3"
            />

          </div>

          <input
            name="githubUrl"
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="demoUrl"
            placeholder="Demo URL"
            value={formData.demoUrl}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="bannerImage"
            placeholder="Banner Image URL"
            value={formData.bannerImage}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="tags"
            placeholder="AI, React, Startup..."
            value={formData.tags}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          {errorMessage && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="border rounded-xl px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-sky-600 text-white rounded-xl px-5 py-2 hover:bg-sky-700"
            >
              {post ? "Update Post" : "Share Idea"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default PostModal;