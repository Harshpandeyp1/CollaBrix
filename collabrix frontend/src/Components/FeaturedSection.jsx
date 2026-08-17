
import React, { useState, useEffect } from "react";

import {
  getFeatured,
  deleteFeatured,
} from "../Services/Featured.js";

import FeaturedCard from "./FeaturedCard";
import FeaturedModal from "./FeaturedModal";


const FeaturedSection = () => {

  const [featured, setFeatured] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [selectedFeatured, setSelectedFeatured] =
    useState(null);


  /* =====================================================
     FETCH FEATURED
  ===================================================== */

  const fetchFeatured = async () => {

    try {

      setLoading(true);

      const data = await getFeatured();

      setFeatured(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      console.error(
        "Error fetching featured:",
        error
      );

      setFeatured([]);

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     LOAD FEATURED ON PAGE LOAD
  ===================================================== */

  useEffect(() => {

    fetchFeatured();

  }, []);


  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (featuredItem) => {

    setSelectedFeatured(featuredItem);

    setOpen(true);

  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (featuredOrId) => {

    const id =
      typeof featuredOrId === "string"
        ? featuredOrId
        : featuredOrId?.id ??
          featuredOrId?._id;


    if (!id) {

      console.error(
        "Unable to delete featured item: missing id"
      );

      return;

    }


    try {

      await deleteFeatured(id);

      await fetchFeatured();

    } catch (error) {

      console.error(
        "Error deleting featured:",
        error
      );

    }

  };


  /* =====================================================
     SAVE
  ===================================================== */

  const handleSaved = async () => {

    setOpen(false);

    setSelectedFeatured(null);

    await fetchFeatured();

  };


  /* =====================================================
     UI
  ===================================================== */

  return (

    <section
      className="
            w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80 dark:bg-zinc-800 dark:bg-black dark:hover:bg-zinc-900

      "
    >

      <div className="flex flex-col gap-4">


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Featured
            </h2>

            <p
              className="
                text-sm
                text-gray-400
              "
            >
              Manage your featured items.
            </p>

          </div>


          {/* ADD FEATURED */}

          <button
            onClick={() => {

              setSelectedFeatured(null);

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
            Add Featured
          </button>

        </div>


        {/* =================================================
            FEATURED CONTENT
        ================================================= */}

        {loading ? (

          <p
            className="
              text-sm
              text-gray-600
            "
          >
            Loading featured items...
          </p>

        ) : featured.length > 0 ? (

          /*
            HORIZONTAL CARD CONTAINER

            flex
              → cards go left → right

            flex-nowrap
              → cards never go to another row

            overflow-x-auto
              → horizontal scrolling

            overflow-y-hidden
              → no vertical scrolling

            scroll-smooth
              → smooth horizontal movement

            gap-4
              → equal spacing between cards
          */

          <div
            className="
              w-full
              flex
              flex-nowrap
              gap-4
              overflow-x-auto
              overflow-y-hidden
              scroll-smooth
              pb-2
            "
          >

            {featured.map((item) => (

              /*
                shrink-0 is important.

                It prevents flexbox from shrinking
                the cards to fit inside the container.

                Every card therefore has the same width.
              */

              <div
                key={
                  item.id ??
                  item._id ??
                  item.title
                }
                className="
                  shrink-0
                  w-[280px]
                "
              >

                <FeaturedCard
                  featured={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

              </div>

            ))}

          </div>

        ) : (

          <p
            className="
              text-sm
              text-gray-600
            "
          >
            No featured data found.
          </p>

        )}

      </div>


      {/* =================================================
          MODAL
      ================================================= */}

      <FeaturedModal
        open={open}
        onClose={() => {

          setOpen(false);

          setSelectedFeatured(null);

        }}
        onSave={handleSaved}
        featured={selectedFeatured}
      />

    </section>

  );

};


export default FeaturedSection;

