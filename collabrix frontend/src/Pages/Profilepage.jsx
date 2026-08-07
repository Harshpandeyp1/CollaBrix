
import React, { useState, useEffect } from "react";

import ProfileHeader from "../Components/ProfileHeader";
import ProfileAbout from "../Components/ProfileAbout";
import ErrorBoundary from "../Components/ErrorBoundary";
import Navbar from "../Components/Navbar";
import EditProfile from "../Components/EditProfile";

import ExperienceSection from "../Components/ExperienceSection.jsx";
import EducationSection from "../Components/EducationSection.jsx";
import ProjectSection from "../Components/ProjectSection.jsx";
import FeaturedSection from "../Components/FeaturedSection.jsx";
import Activity from "../Components/Activity";
import Peoplemayknow from "../Components/Peoplemayknow.jsx";

import { getProfile } from "../Services/Profile.js";
import { getMyPosts } from "../Services/Post";


const ProfilePage = () => {

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [myPosts, setMyPosts] = useState([]);

  const [editOpen, setEditOpen] = useState(false);


  /* =====================================================
     FETCH PROFILE
  ===================================================== */

  const fetchProfile = async () => {

    setLoading(true);

    try {

      const data = await getProfile();

      setProfile(data);

    } catch (error) {

      console.error(
        "Failed to fetch profile",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {

    fetchProfile();

  }, []);


  /* =====================================================
     FETCH MY POSTS
  ===================================================== */

  useEffect(() => {

    const fetchMyPosts = async () => {

      try {

        const data = await getMyPosts();

        setMyPosts(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to fetch my posts:",
          error
        );

        setMyPosts([]);

      }

    };

    fetchMyPosts();

  }, []);


  /* =====================================================
     PROFILE UPDATED
  ===================================================== */

  const handleProfileUpdated = async () => {

    setEditOpen(false);

    await fetchProfile();

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-linear-to-b
        from-sky-200
        via-teal-100
        to-blue-100
      ">

        <p className="text-gray-600">
          Loading profile...
        </p>

      </div>
    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <div className="
      min-h-screen
      bg-linear-to-b
      from-sky-200
      via-teal-100
      to-blue-100
    ">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          MAIN PAGE CONTAINER
      ================================================= */}

      <div className="
        w-full
        px-4
        py-6
      ">

        <div className="
          max-w-7xl
          mx-auto
        ">


          {/* =================================================
              TWO MAIN CONTAINERS
          ================================================= */}

          <div className="
            flex
            items-start
            gap-6
          ">


            {/* =================================================
                LEFT CONTAINER
                All profile cards live here
            ================================================= */}

            <div className="
              w-full
              lg:w-3/4
              min-w-0
              flex
              flex-col
            
            ">


              {/* ================= PROFILE HEADER ================= */}

              <ErrorBoundary>

                <ProfileHeader
                  profile={profile}
                  onEdit={() => setEditOpen(true)}
                  onProfileImageUpdated={fetchProfile}
                  onCoverImageUpdated={fetchProfile}
                />

              </ErrorBoundary>


              {/* ================= ABOUT ================= */}

              <ProfileAbout
                profile={profile}
              />


              {/* ================= FEATURED ================= */}

              <FeaturedSection />


              {/* ================= EXPERIENCE ================= */}

              <ExperienceSection />


              {/* ================= EDUCATION ================= */}

              <EducationSection />


              {/* ================= ACTIVITY ================= */}

              <Activity
                posts={myPosts}
              />


              {/* ================= PROJECTS ================= */}

              <ProjectSection />


            </div>


            {/* =================================================
                RIGHT CONTAINER
                Only PeopleMayKnow + Footer
            ================================================= */}

            <div className="
             
              lg:w-1/4
              shrink-0
              flex-col
              gap-6
              sticky
              top-24
              self-start
            ">


              {/* ================= PEOPLE YOU MAY KNOW ================= */}

              <Peoplemayknow />


              {/* ================= FOOTER ================= */}
               <div className="
                  bg-white
                  rounded-2xl
                  border
                  border-sky-100
                  shadow-sm
                  p-4
                  mt-5
                ">

                  <h2 className="
                    text-base
                    font-semibold
                    text-slate-800
                    mb-4
                  ">
                    Your Space
                  </h2>

                  <div className="space-y-1">

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>🔖</span>
                      <span>Saved Ideas</span>
                    </button>

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>📁</span>
                      <span>Saved Projects</span>
                    </button>

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>💡</span>
                      <span>My Ideas</span>
                    </button>

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>🚀</span>
                      <span>My Projects</span>
                    </button>

                    <button className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-lg
                      text-sm
                      text-slate-600
                      hover:bg-sky-50
                      hover:text-sky-600
                      transition
                    ">
                      <span>👥</span>
                      <span>My Connections</span>
                    </button>

                  </div>
                </div>
              <footer className="
                w-full
                p-4
                mt-6
                rounded-2xl
                bg-white/70
                rounded-2xl
                bg-white/70
                backdrop-blur-sm
                border
                border-slate-200/70
                text-slate-500
              ">

                {/* Footer Links */}

                <div className="
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-2
                  text-[11px]
                  font-medium
                ">

                  <a
                    href="#about"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    About
                  </a>

                  <a
                    href="#accessibility"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    Accessibility
                  </a>

                  <a
                    href="#help"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    Help Center
                  </a>

                  <a
                    href="#privacy"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    Privacy & Terms
                  </a>

                  <a
                    href="#ad-choices"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    Ad Choices
                  </a>

                  <a
                    href="#projects"
                    className="
                      hover:text-sky-600
                      hover:underline
                      transition
                    "
                  >
                    Projects
                  </a>

                </div>


                {/* Copyright */}

                <div className="
                  mt-4
                  pt-3
                  border-t
                  border-slate-200/70
                  flex
                  items-center
                  justify-between
                  gap-2
                  text-[11px]
                  text-slate-400
                ">

                  <div className="
                    flex
                    items-center
                    gap-1.5
                    font-semibold
                    text-slate-700
                  ">

                    <div className="
                      w-4
                      h-4
                      rounded
                      bg-linear-to-tr
                      from-sky-600
                      to-teal-400
                      flex
                      items-center
                      justify-center
                      text-white
                      text-[8px]
                      font-bold
                    ">
                      C
                    </div>

                    <span>
                      Collabrix
                    </span>

                  </div>


                  <span>
                    © {new Date().getFullYear()}
                  </span>

                </div>

              </footer>


            </div>


          </div>

        </div>

      </div>


      {/* =================================================
          EDIT PROFILE MODAL
      ================================================= */}

      <EditProfile
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleProfileUpdated}
      />

    </div>
  );
};


export default ProfilePage;

