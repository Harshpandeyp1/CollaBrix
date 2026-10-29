import React from 'react'
import { useState, useEffect } from 'react'
import { createExperience, updateExperience } from '../Services/Experience.js'
import ModalPortal from "./ModalPortal.jsx";

const ExperienceModal = ({ open, onClose, onSave, experience }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    employmentType: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || "",
        position: experience.position || "",
        employmentType: experience.employmentType || "",
        location: experience.location || "",
        description: experience.description || "",
        startDate: experience.startDate || "",
        endDate: experience.endDate || "",
        currentlyWorking: experience.currentlyWorking || false
      });
    } else {
      setFormData({
        company: "",
        position: "",
        employmentType: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false
      });
    }
  }, [experience]);

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

    if (!formData.company.trim() || !formData.position.trim()) {
      setErrorMessage("Company and position are required.");
      return;
    }

    if (!formData.startDate) {
      setErrorMessage("Start date is required.");
      return;
    }

    if (!formData.currentlyWorking && !formData.endDate) {
      setErrorMessage("Please provide an end date or mark currently working.");
      return;
    }

    const payload = {
      company: formData.company,
      position: formData.position,
      startDate: formData.startDate,
      currentlyWorking: formData.currentlyWorking,
    };

    if (formData.employmentType.trim()) {
      payload.employmentType = formData.employmentType.trim();
    }
    if (formData.location.trim()) {
      payload.location = formData.location.trim();
    }
    if (formData.description.trim()) {
      payload.description = formData.description.trim();
    }
    if (!formData.currentlyWorking) {
      payload.endDate = formData.endDate;
    }

    try {
      if (experience) {
        await updateExperience(experience.id, payload);
      } else {
        await createExperience(payload);
      }
      onSave();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unable to save experience.";
      setErrorMessage(message);
      console.error("Experience save failed", error);
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-lg dark:bg-black">

        <h2 className="mb-4 shrink-0 text-xl font-bold text-gray-900">
          {experience ? "Edit Experience" : "Add Experience"}
        </h2>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">

          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            placeholder="Employment Type (e.g. Full-time)"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <div className="flex gap-3">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="min-w-0 border rounded-lg px-3 py-2 text-sm flex-1"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.currentlyWorking}
              className="min-w-0 border rounded-lg px-3 py-2 text-sm flex-1 disabled:bg-gray-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="currentlyWorking"
              checked={formData.currentlyWorking}
              onChange={handleChange}
            />
            I currently work here
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t bg-white pt-3 dark:bg-black">
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

export default ExperienceModal