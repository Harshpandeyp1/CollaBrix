
import React, { useState, useEffect } from "react";

import {
  getEducation,
  deleteEducation,
} from "../Services/Education.js";

import EducationCard from "./EducationCard.jsx";
import EducationModal from "./EducationModal.jsx";

const EducationSection = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  // ================================
  // FETCH EDUCATION
  // ================================

  const fetchEducations = async () => {
    try {
      setLoading(true);

      const data = await getEducation();

      console.log("Education fetch response:", data);

      setEducations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching educations:", error);
      setEducations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // ================================
  // EDIT
  // ================================

  const handleEdit = (education) => {
    setSelectedEducation(education);
    setOpen(true);
  };

  // ================================
  // DELETE
  // ================================

  const handleDelete = async (educationOrId) => {
    const id =
      typeof educationOrId === "string"
        ? educationOrId
        : educationOrId?.id ?? educationOrId?._id;

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
      console.error("Error deleting education:", error);
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
    <section className="     w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80
">

      {/* ================================
          HEADER
      ================================= */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Education
          </h2>

          <p className="text-sm text-gray-600">
            Manage your educational background.
          </p>
        </div>

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

      </div>

      {/* ================================
          CONTENT
      ================================= */}

      {loading ? (

        <p className="text-sm text-gray-600">
          Loading educations...
        </p>

      ) : educations.length > 0 ? (

        /*
          IMPORTANT:

          flex
          -> puts cards horizontally

          overflow-x-auto
          -> allows horizontal scrolling

          overflow-y-hidden
          -> prevents vertical scrolling

          scroll-smooth
          -> smooth scrolling

          snap-x snap-mandatory
          -> cards snap into position

          Each card wrapper:
          min-w-[320px]
          -> fixed card width

          shrink-0
          -> prevents flex from shrinking the cards
        */

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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

          ))}

        </div>

      ) : (

        <p className="text-sm text-gray-600">
          No education data found.
        </p>

      )}

      {/* ================================
          MODAL
      ================================= */}

      <EducationModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedEducation(null);
        }}
        onSave={handleSaved}
        education={selectedEducation}
      />

    </section>
  );
};

export default EducationSection;

