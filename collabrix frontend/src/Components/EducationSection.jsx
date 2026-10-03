import React, { useState, useEffect } from "react";

import {
  getEducation,
  getEducationByUserId,
  deleteEducation,
} from "../Services/Education.js";

import EducationCard from "./EducationCard.jsx";
import EducationModal from "./EducationModal.jsx";

const EducationSection = ({ userId }) => {

  const [educations, setEducations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [selectedEducation, setSelectedEducation] = useState(null);


  // ================================
  // IS THIS MY PROFILE?
  // ================================

  const isOwnProfile = !userId;


  // ================================
  // FETCH EDUCATION
  // ================================

  const fetchEducations = async () => {

    try {

      setLoading(true);

      let data;

      if (userId) {

        // Viewing another user's profile
        data = await getEducationByUserId(userId);

      } else {

        // Viewing my own profile
        data = await getEducation();

      }

      console.log("Education fetch response:", data);

      setEducations(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Error fetching educations:",
        error
      );

      setEducations([]);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchEducations();

  }, [userId]);


  // ================================
  // EDIT
  // ================================

  const handleEdit = (education) => {

    // Other users' education is read-only
    if (!isOwnProfile) return;

    setSelectedEducation(education);

    setOpen(true);
  };


  // ================================
  // DELETE
  // ================================

  const handleDelete = async (educationOrId) => {

    // Other users' education is read-only
    if (!isOwnProfile) return;

    const id =
      typeof educationOrId === "string"
        ? educationOrId
        : educationOrId?.id ??
          educationOrId?._id;

    if (!id) {

      console.error(
        "Error deleting education: missing id",
        educationOrId
      );

      return;
    }

    try {

      await deleteEducation(id);

      await fetchEducations();

    } catch (error) {

      console.error(
        "Error deleting education:",
        error
      );

    }
  };


  // ================================
  // SAVE
  // ================================

  const handleSaved = async () => {

    setOpen(false);

    setSelectedEducation(null);

    await fetchEducations();
  };


  return (

    <section
      className="
        w-full
        max-w-4xl
        mt-2
        rounded-2xl
        bg-white
        border
        border-gray-200
        shadow-lg
        px-6
        py-5
        mr-80
        dark:bg-zinc-800
        dark:hover:bg-zinc-900
      "
    >

      {/* ================================
          HEADER
      ================================= */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Education
          </h2>

          <p className="text-sm text-gray-600 dark:text-zinc-400">

            {isOwnProfile
              ? "Manage your educational background."
              : "Educational background."
            }

          </p>

        </div>


        {/* Only show Add button on own profile */}

        {isOwnProfile && (

          <button
            onClick={() => {

              setSelectedEducation(null);

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
            Add Education
          </button>

        )}

      </div>


      {/* ================================
          CONTENT
      ================================= */}

      {loading ? (

        <p className="text-sm text-gray-600 dark:text-zinc-400">
          Loading educations...
        </p>

      ) : educations.length > 0 ? (

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

          {educations.map((education) => (

            <div
              key={
                education.id ??
                education._id ??
                education.institution
              }
              className="
                min-w-[320px]
                max-w-[320px]
                shrink-0
                snap-start
              "
            >

              <EducationCard
                education={education}

                onEdit={
                  isOwnProfile
                    ? handleEdit
                    : undefined
                }

                onDelete={
                  isOwnProfile
                    ? handleDelete
                    : undefined
                }
              />

            </div>

          ))}

        </div>

      ) : (

        <p className="text-sm text-gray-600 dark:text-zinc-400">

          {isOwnProfile
            ? "No education data found."
            : "This user hasn't added any education yet."
          }

        </p>

      )}


      {/* ================================
          MODAL
      ================================= */}

      {isOwnProfile && (

        <EducationModal
          open={open}

          onClose={() => {

            setOpen(false);

            setSelectedEducation(null);

          }}

          onSave={handleSaved}

          education={selectedEducation}
        />

      )}

    </section>

  );
};

export default EducationSection;