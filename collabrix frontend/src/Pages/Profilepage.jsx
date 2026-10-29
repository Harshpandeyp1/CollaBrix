
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
import YourSpace from "../Components/YourSpace";
import { ProfileModalProvider } from "../Components/ProfileModalContext.jsx";
import { useProfileModal } from "../Components/ProfileModalContext.js";

import { getProfile } from "../Services/Profile.js";
import { deletePost, getMyPosts } from "../Services/Post";


const ProfilePageContent = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [myPosts, setMyPosts] = useState([]);

  const { activeModal, openModal, closeModal } = useProfileModal();


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

    closeModal();

    await fetchProfile();

  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const postId = post.id ?? post._id;

    try {
      await deletePost(postId);
      setMyPosts((currentPosts) =>
        currentPosts.filter(
          (currentPost) => String(currentPost.id ?? currentPost._id) !== String(postId)
        )
      );
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert(error.response?.data?.message || "Failed to delete post");
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="
        page-background
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#FDFBD4]
        dark:bg-black
      ">

        <p className="text-gray-600 dark:text-zinc-300">
          Loading profile...
        </p>

      </div>
    );

  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <div className="page-background min-h-screen bg-[#FDFBD4] dark:bg-black">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          MAIN PAGE CONTAINER
      ================================================= */}

      <main className="min-h-screen px-6 pt-6 transition-colors">

        <div className="mx-auto max-w-7xl">


          {/* =================================================
              TWO MAIN CONTAINERS
          ================================================= */}

          <div className="grid grid-cols-12 items-start gap-6">


            {/* =================================================
                LEFT CONTAINER
                All profile cards live here
            ================================================= */}

            <section className="col-span-9 min-w-0 space-y-6">


              {/* ================= PROFILE HEADER ================= */}

              <ErrorBoundary>

                <ProfileHeader
                  profile={profile}
                  onEdit={() => openModal("profile")}
                  onProfileImageUpdated={fetchProfile}
                  onCoverImageUpdated={fetchProfile}
                />

              </ErrorBoundary>


              {/* ================= ABOUT ================= */}

              <ProfileAbout
                profile={profile}
                canEdit
                onSave={fetchProfile}
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
                onDeletePost={handleDeletePost}
              />


              {/* ================= PROJECTS ================= */}

              <ProjectSection />


            </section>


            {/* =================================================
                RIGHT CONTAINER
                Only PeopleMayKnow + Footer
            ================================================= */}

            <aside className="col-span-3 min-w-0 space-y-6 sticky top-20 self-start">


              {/* ================= PEOPLE YOU MAY KNOW ================= */}

              <Peoplemayknow />


              <YourSpace />

              <footer className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 text-slate-500 dark:border-slate-700 dark:bg-zinc-800 dark:text-slate-400">
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-medium">
                  <a href="#about" className="transition-colors hover:text-sky-600 hover:underline">About</a>
                  <a href="#accessibility" className="transition-colors hover:text-sky-600 hover:underline">Accessibility</a>
                  <a href="#help" className="transition-colors hover:text-sky-600 hover:underline">Help Center</a>
                  <a href="#privacy" className="transition-colors hover:text-sky-600 hover:underline">Privacy &amp; Terms</a>
                  <a href="#ad-choices" className="transition-colors hover:text-sky-600 hover:underline">Ad Choices</a>
                  <a href="#projects" className="transition-colors hover:text-sky-600 hover:underline">Projects</a>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] dark:border-slate-700/60">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Collabrix</span>
                  <span>© {new Date().getFullYear()} All Rights Reserved</span>
                </div>
              </footer>

            </aside>


          </div>

        </div>

      </main>


      {/* =================================================
          EDIT PROFILE MODAL
      ================================================= */}

      <EditProfile
        open={activeModal === "profile"}
        profile={profile}
        onClose={closeModal}
        onSave={handleProfileUpdated}
      />

    </div>
  );
};

const ProfilePage = () => (
  <ProfileModalProvider>
    <ProfilePageContent />
  </ProfileModalProvider>
);

export default ProfilePage;
