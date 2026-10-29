import React, { useState, useEffect } from "react";
import { createFeatured, updateFeatured } from "../Services/Featured.js";
import ModalPortal from "./ModalPortal.jsx";

const FEATURED_TYPES = [
  { value: "PORTFOLIO", label: "Portfolio" },
  { value: "GITHUB", label: "GitHub" },
  { value: "CERTIFICATE", label: "Certificate" },
  { value: "RESUME", label: "Resume" },
  { value: "VIDEO", label: "Video" },
  { value: "OTHER", label: "Other" },
];

const FeaturedModal = ({ open, onClose, onSave, featured }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    url: "",
    type: "PORTFOLIO",
  });

  useEffect(() => {
    if (featured) {
      setFormData({
        title: featured.title || "",
        description: featured.description || "",
        thumbnail: featured.thumbnail || "",
        url: featured.url || "",
        type: featured.type || "PORTFOLIO",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        thumbnail: "",
        url: "",
        type: "PORTFOLIO",
      });
    }
  }, [featured]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = {
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      url: formData.url,
      type: formData.type,
    };

    try {
      if (featured) {
        await updateFeatured(featured.id, payload);
      } else {
        await createFeatured(payload);
      }

      onSave();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to save featured item.";

      setErrorMessage(message);
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-xl dark:bg-black">

        <h2 className="mb-5 shrink-0 text-2xl font-bold">
          {featured ? "Edit Featured" : "Add Featured"}
        </h2>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="My Portfolio"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Describe this featured item..."
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thumbnail URL
            </label>

            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
            />
          </div>

          {/* Preview */}
          {formData.thumbnail && (
            <div className="rounded-xl overflow-hidden border">
              <img
                src={formData.thumbnail}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* URL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Website URL
            </label>

            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Featured Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              {FEATURED_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {featured ? "Update" : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
    </ModalPortal>
  );
};

export default FeaturedModal;