
import React, { useState, useEffect } from "react";
import axios from "axios";

const PeopleMayKnow = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sentRequests, setSentRequests] = useState({});
  const [sendingIds, setSendingIds] = useState({});


  /* =====================================================
     FETCH PEOPLE
  ===================================================== */

  useEffect(() => {
    fetchPeople();
  }, []);


  const getInitials = (username) => {
    if (!username) return "";

    return username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  };


  const fetchPeople = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Authentication required. Please sign in to see suggestions."
      );

      setPeople([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8080/api/users/suggestion",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeople(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (fetchError) {

      setError(
        fetchError?.response?.data?.message ||
        fetchError?.message ||
        "Unable to load suggestions."
      );

      setPeople([]);

    } finally {
      setLoading(false);
    }
  };


  /* =====================================================
     SEND CONNECTION REQUEST
  ===================================================== */

  const requestConnect = async (id) => {

    if (
      sentRequests[id] ||
      sendingIds[id]
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Authentication required. Please sign in to send a request."
      );
      return;
    }

    setError("");

    setSendingIds((prev) => ({
      ...prev,
      [id]: true,
    }));

    try {

      await axios.post(
        "http://localhost:8080/api/connections/request",
        {
          receiverId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSentRequests((prev) => ({
        ...prev,
        [id]: true,
      }));

    } catch (requestError) {

      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Unable to send the connection request."
      );

    } finally {

      setSendingIds((prev) => {

        const next = {
          ...prev,
        };

        delete next[id];

        return next;
      });
    }
  };


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="
      w-full
      bg-white
      rounded-2xl
      border
      border-sky-100
      dark:bg-zinc-800
      dark:border-slate-700
      dark:text-white
      shadow-sm
      p-5
    ">

      {/* ================= HEADER ================= */}

      <div className="mb-4">

        <h2 className="
          text-base
          font-semibold
          text-slate-800
          dark:text-white
        ">
          People You May Know
        </h2>

        <p className="
          mt-1
          text-xs
          text-slate-500
          dark:text-white
        ">
          Connect with people in your network.
        </p>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-3
          py-2
          text-xs
          text-red-700
          dark:text-white
          mb-3
        ">
          {error}
        </div>
      )}


      {/* ================= LOADING ================= */}

      {loading ? (

        <div className="
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-3
          py-4
          text-sm
          text-slate-500
          dark:text-white
          text-center
        ">
          Loading suggestions...
        </div>

      ) : people.length === 0 ? (

        /* ================= EMPTY ================= */

        <div className="
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          dark:text-white
          px-3
          py-4
          text-sm
          text-slate-500
          text-center
        ">
          No suggestions available right now.
        </div>

      ) : (

        /* ================= PEOPLE LIST ================= */

        <div className="
          max-h-80
          overflow-y-auto
          flex
          flex-col
          gap-1.5
          dark:text-white
          pr-1
        ">

          {people.map((person) => {

            const sent =
              !!sentRequests[person.id];

            const sending =
              !!sendingIds[person.id];


            return (

              <div
                key={person.id}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  dark:text-white
                  gap-2
                  p-2
                  rounded-xl
                  border
                  border-transparent
                  hover:bg-slate-50
                  hover:border-slate-100
                  transition-all
                  duration-200
                "
              >

                {/* ================= USER ================= */}

                <div className="
                  flex
                  items-center
                  dark:text-white
                  gap-3
                  min-w-0
                  flex-1
                ">

                  {/* Avatar */}

                  <div className="
                    w-10
                    h-10
                    shrink-0
                    rounded-full
                    bg-sky-100
                    text-sky-700
                    
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-semibold
                  ">
                    {getInitials(person.username)}
                  </div>


                  {/* User information */}

                  <div className="
                    min-w-0
                    flex-1
                    dark:text-white
                  ">

                    <p className="
                      text-sm
                      font-semibold
                      text-slate-800
                      dark:text-white
                      dark:group-hover:text-black
                      truncate
                    ">
                      {person.username}
                    </p>

                    <p className="
                      text-[11px]
                      text-slate-500
                      
                      truncate
                    ">
                      {person.email}
                    </p>

                  </div>

                </div>


                {/* ================= CONNECT ================= */}

                <button
                  type="button"
                  onClick={() =>
                    requestConnect(person.id)
                  }
                  disabled={
                    sent || sending
                  }
                  className={`
                    shrink-0
                    h-8
                    px-3
                    rounded-lg
                    text-xs
                    font-semibold
                    transition
                    duration-200
                    active:scale-95

                    ${
                      sent
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : "bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
                    }

                    ${
                      sending
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }
                  `}
                >

                  {sent
                    ? "Sent"
                    : sending
                    ? "Sending..."
                    : "Connect"}

                </button>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
};

export default PeopleMayKnow;

