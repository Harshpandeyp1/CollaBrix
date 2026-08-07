import React from 'react'
import { useState, useEffect } from 'react'
import { createExperience, updateExperience } from '../Services/Experience.js'

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {experience ? "Edit Experience" : "Add Experience"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="Position"
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            placeholder="Employment Type (e.g. Full-time)"
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="border rounded-lg px-3 py-2 text-sm"
          />

          <div className="flex gap-3">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 text-sm flex-1"
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.currentlyWorking}
              className="border rounded-lg px-3 py-2 text-sm flex-1 disabled:bg-gray-100"
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
            className="border rounded-lg px-3 py-2 text-sm"
          />

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
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
  )
}

export default ExperienceModal