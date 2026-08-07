
import React, { useState, useEffect } from "react";

import {
  getExperience,
  deleteExperience,
} from "../Services/Experience.js";

import ExperienceCard from "../Components/ExperienceCard.jsx";
import ExperienceModal from "../Components/ExperienceModal";


const ExperienceSection = () => {

  const [experiences, setExperiences] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [selectedExperience, setSelectedExperience] =
    useState(null);


  /* =====================================================
     FETCH EXPERIENCES
  ===================================================== */

  const fetchExperiences = async () => {

    try {

      setLoading(true);

      const data = await getExperience();

      console.log(
        "Experience fetch response:",
        data
      );

      setExperiences(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Error fetching experiences:",
        error
      );

      if (error.response) {

        console.error(
          "Experience API error response:",
          error.response.status,
          error.response.data
        );

      }

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     LOAD ON COMPONENT MOUNT
  ===================================================== */

  useEffect(() => {

    fetchExperiences();

  }, []);


  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (experience) => {

    setSelectedExperience(experience);

    setOpen(true);

  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (experienceOrId) => {

    const id =
      typeof experienceOrId === "string"
        ? experienceOrId
        : experienceOrId?.id ??
          experienceOrId?._id;


    if (!id) {

      console.error(
        "Error deleting experience: missing id",
        experienceOrId
      );

      return;

    }


    try {

      await deleteExperience(id);

      await fetchExperiences();

    } catch (error) {

      console.error(
        "Error deleting experience:",
        error
      );

    }

  };


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSaved = async () => {

    setOpen(false);

    setSelectedExperience(null);

    await fetchExperiences();

  };


  /* =====================================================
     UI
  ===================================================== */

  return (

    <section className="
     w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80
    ">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        items-start
        justify-between
        gap-4
        mb-5
      ">

        <div>

          <h2 className="
            text-xl
            font-bold
            text-gray-900
          ">
            Experience
          </h2>

          <p className="
            text-sm
            text-gray-600
            mt-1
          ">
            Manage your work history and roles.
          </p>

        </div>


        {/* ADD EXPERIENCE */}

        <button
          onClick={() => {

            setSelectedExperience(null);

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
          Add Experience
        </button>

      </div>


      {/* =================================================
          EXPERIENCE CONTENT
      ================================================= */}

      {loading ? (

        <p className="
          text-sm
          text-gray-600
        ">
          Loading experiences...
        </p>

      ) : experiences.length > 0 ? (

        /*
          IMPORTANT:

          flex
              → cards go left → right

          flex-nowrap
              → cards never move to another row

          overflow-x-auto
              → horizontal scrolling

          scroll-smooth
              → smooth horizontal scrolling

          scrollbar-hide
              → hides the scrollbar
        */

        <div
          className="
            w-full
            overflow-x-auto
            overflow-y-hidden
            scroll-smooth
            flex
            flex-nowrap
            gap-4
            pb-2
            scrollbar-hide
          "
        >

          {experiences.map((experience) => (

            /*
              shrink-0 is VERY important.

              Without it, flexbox may shrink the cards
              to fit the available width.

              With shrink-0, every card keeps its width.
            */

            <div
              key={
                experience.id ??
                experience._id ??
                experience.company
              }
              className="
                shrink-0
                w-[340px]
                h-full
              "
            >

              <ExperienceCard
                experience={experience}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

            </div>

          ))}

        </div>

      ) : (

        <p className="
          text-sm
          text-gray-600
        ">
          No experience data found.
        </p>

      )}


      {/* =================================================
          EXPERIENCE MODAL
      ================================================= */}

      <ExperienceModal
        open={open}
        onClose={() => {

          setOpen(false);

          setSelectedExperience(null);

        }}
        onSave={handleSaved}
        experience={selectedExperience}
      />

    </section>

  );

};


export default ExperienceSection;

