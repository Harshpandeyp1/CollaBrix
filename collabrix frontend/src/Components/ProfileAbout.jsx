import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { updateAboutAndSkills } from "../Services/Profile.js";
import { useProfileModal } from "./ProfileModalContext.js";

const getSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.filter((skill) => typeof skill === "string");
  }

  if (typeof skills === "string") {
    return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
  }

  return [];
};

export default function ProfileAbout({
  profile = {},
  canEdit = false,
  onSave,
}) {
  const profileBio = profile.bio || profile.description || profile.about || "";
  const profileSkills = getSkills(profile.skills);
  const skillsValue = profileSkills.join(", ");
  const { activeModal, openModal, closeModal } = useProfileModal();
  const isEditing = activeModal === "about";
  const [bio, setBio] = useState(profileBio);
  const [skills, setSkills] = useState(profileSkills.join(", "));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setBio(profileBio);
    setSkills(skillsValue);
  }, [profileBio, skillsValue]);

  const cancelEdit = () => {
    setBio(profileBio);
    setSkills(skillsValue);
    setErrorMessage("");
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const fullName = profile.fullName || profile.name || "";
    if (!fullName.trim()) {
      setErrorMessage(
        "Your profile name is missing. Add your full name in Edit Profile before saving About and Skills.",
      );
      return;
    }

    setIsSaving(true);

    try {
      await updateAboutAndSkills({
        fullName: fullName.trim(),
        bio,
        skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      });
      closeModal();
      await onSave?.();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to save About and Skills.";
      setErrorMessage(message);
      console.error("About and Skills save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="relative mt-2 w-full min-w-0 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-lg dark:bg-zinc-800 dark:hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          About
        </h2>
        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={() => openModal("about")}
            aria-label="Edit About and Skills"
            title="Edit About and Skills"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200">
            About
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
              placeholder="Tell people about yourself"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700 dark:text-zinc-200">
            Skills
            <input
              type="text"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
              placeholder="React, JavaScript, Design"
            />
            <span className="mt-1 block text-xs font-normal text-gray-500 dark:text-zinc-400">
              Separate skills with commas.
            </span>
          </label>

          {errorMessage && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-gray-200 bg-white py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-zinc-300">
            {profileBio || "Building Projecter..."}
          </p>

          <div className="mt-6">
            <h3 className="text-base font-semibold text-gray-700 dark:text-white">
              Skills
            </h3>
            {profileSkills.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {profileSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No skills added yet.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
