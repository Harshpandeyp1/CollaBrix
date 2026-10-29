import React from 'react'
import { useState, useEffect } from 'react'
import { createEducation, updateEducation } from '../Services/Education.js'
import ModalPortal from "./ModalPortal.jsx";

const EducationModal = ({ open, onClose, onSave, education }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    description: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false
  });

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || "",
        degree: education.degree || "",
        fieldOfStudy: education.fieldOfStudy || "",
        description: education.description || "",
        startDate: education.startDate || "",
        endDate: education.endDate || "",
        currentlyStudying: education.currentlyStudying || false
      });
    } else {
      setFormData({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        description: "",
        startDate: "",
        endDate: "",
        currentlyStudying: false
      });
    }
  }, [education]);

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

    if (!formData.institution.trim() || !formData.degree.trim()) {
      setErrorMessage("Institution and degree are required.");
      return;
    }

    if (!formData.currentlyStudying && !formData.endDate) {
      setErrorMessage("Please provide an end date or mark currently studying.");
      return;
    }

    const payload = {
      institution: formData.institution,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      description: formData.description,
      startDate: formData.startDate || null,
      endDate: formData.currentlyStudying ? null : formData.endDate || null,
      currentlyStudying: formData.currentlyStudying,
    };

    try {
      if (education) {
        await updateEducation(education.id, payload);
      } else {
        await createEducation(payload);
      }
      onSave();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unable to save education.";
      setErrorMessage(message);
      console.error("Education save failed", error);
    }
  };

  if (!open) return null;

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-lg dark:bg-black">

        <h2 className="mb-4 shrink-0 text-xl font-bold text-gray-900">
          {education ? "Edit Education" : "Add Education"}
        </h2>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">

          <input
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Institution"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Degree (e.g. B.Tech)"
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            name="fieldOfStudy"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            placeholder="Field of Study (e.g. Computer Science)"
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
              disabled={formData.currentlyStudying}
              className="min-w-0 border rounded-lg px-3 py-2 text-sm flex-1 disabled:bg-gray-100"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="currentlyStudying"
              checked={formData.currentlyStudying}
              onChange={handleChange}
            />
            I currently study here
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

export default EducationModal