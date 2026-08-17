
import React, { useEffect, useState } from "react";

import {
  getProjectInterests,
  updateProjectInterestStatus,
} from "../Services/Project.js";

const ProjectInterestModal = ({
  open,
  project,
  onClose,
}) => {

  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // =========================================
  // FETCH INTERESTS
  // =========================================

  const fetchInterests = async () => {

    if (!project?.id) return;

    try {

      setLoading(true);

      const data = await getProjectInterests(
        project.id
      );

      console.log(
        "Project interests:",
        data
      );

      setInterests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to fetch project interests:",
        error
      );

      setInterests([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // FETCH WHEN MODAL OPENS
  // =========================================

  useEffect(() => {

    if (open && project) {
      fetchInterests();
    }

  }, [open, project]);


  // =========================================
  // ACCEPT / REJECT
  // =========================================

  const handleStatusUpdate = async (
    interestId,
    status
  ) => {

    try {

      setUpdatingId(interestId);

      const updated =
        await updateProjectInterestStatus(
          interestId,
          status
        );

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === interestId
            ? updated
            : interest
        )
      );

    } catch (error) {

      console.error(
        "Failed to update interest:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to update interest"
      );

    } finally {

      setUpdatingId(null);

    }
  };

  if (!open) {
    return null;
  }


  // =========================================
  // UI
  // =========================================

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
      onClick={onClose}
    >

      <div
        className="
          w-full
          max-w-lg
          max-h-[80vh]
          overflow-hidden
          rounded-2xl
          bg-white
          dark:bg-zinc-900
          shadow-2xl
          border
          border-slate-200
          dark:border-zinc-700
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            py-4
            border-b
            border-slate-200
            dark:border-zinc-700
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
              Interested People
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
                dark:text-zinc-400
              "
            >
              {project?.title}
            </p>

          </div>


          <button
            onClick={onClose}
            className="
              w-8
              h-8
              rounded-full
              flex
              items-center
              justify-center
              text-gray-500
              dark:text-zinc-400
              hover:bg-gray-100
              dark:hover:bg-zinc-800
              transition
            "
          >
            ✕
          </button>

        </div>


        {/* ================================= */}
        {/* CONTENT */}
        {/* ================================= */}

        <div
          className="
            overflow-y-auto
            max-h-[60vh]
            p-5
          "
        >

          {loading ? (

            <div className="py-10 text-center">

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-zinc-400
                "
              >
                Loading interested people...
              </p>

            </div>

          ) : interests.length === 0 ? (

            <div className="py-10 text-center">

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-zinc-400
                "
              >
                No one has shown interest yet.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {interests.map((interest) => (

                <div
                  key={interest.id}
                  className="
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-zinc-700
                    p-4
                  "
                >

                  {/* USER */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      {/* PROFILE IMAGE */}

                      {interest.profileImage ? (

                        <img
                          src={interest.profileImage}
                          alt={
                            interest.fullName ||
                            interest.username
                          }
                          className="
                            w-10
                            h-10
                            rounded-full
                            object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                            w-10
                            h-10
                            rounded-full
                            flex
                            items-center
                            justify-center
                            bg-gradient-to-br
                            from-sky-500
                            to-teal-500
                            text-white
                            text-xs
                            font-bold
                          "
                        >
                          {(
                            interest.fullName ||
                            interest.username ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                      )}


                      {/* USER INFO */}

                      <div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {interest.fullName ||
                            interest.username ||
                            "Unknown User"}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-zinc-400
                          "
                        >
                          @{interest.username}
                        </p>

                      </div>

                    </div>


                    {/* STATUS */}

                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-semibold
                        ${
                          interest.status ===
                          "ACCEPTED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : interest.status ===
                              "REJECTED"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                        }
                      `}
                    >
                      {interest.status}
                    </span>

                  </div>


                  {/* DATE */}

                  {interest.createdAt && (

                    <p
                      className="
                        mt-2
                        text-[11px]
                        text-gray-400
                        dark:text-zinc-500
                      "
                    >
                      Interested on{" "}
                      {new Date(
                        interest.createdAt
                      ).toLocaleDateString()}
                    </p>

                  )}


                  {/* ACTIONS */}

                  {interest.status ===
                    "PENDING" && (

                    <div
                      className="
                        mt-3
                        flex
                        gap-2
                      "
                    >

                      <button
                        disabled={
                          updatingId ===
                          interest.id
                        }
                        onClick={() =>
                          handleStatusUpdate(
                            interest.id,
                            "ACCEPTED"
                          )
                        }
                        className="
                          flex-1
                          rounded-lg
                          bg-emerald-600
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-white
                          transition
                          hover:bg-emerald-700
                          disabled:opacity-50
                        "
                      >
                        {updatingId ===
                        interest.id
                          ? "Updating..."
                          : "Accept"}
                      </button>


                      <button
                        disabled={
                          updatingId ===
                          interest.id
                        }
                        onClick={() =>
                          handleStatusUpdate(
                            interest.id,
                            "REJECTED"
                          )
                        }
                        className="
                          flex-1
                          rounded-lg
                          border
                          border-red-200
                          dark:border-red-900
                          px-3
                          py-2
                          text-xs
                          font-semibold
                          text-red-600
                          dark:text-red-400
                          transition
                          hover:bg-red-50
                          dark:hover:bg-red-950/40
                          disabled:opacity-50
                        "
                      >
                        Reject
                      </button>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );
};

export default ProjectInterestModal;

