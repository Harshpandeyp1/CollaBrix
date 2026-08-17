import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashBoardHeader";
import Peoplemayknow from "../Components/Peoplemayknow";
import ProfileCard from "../Components/ProfileCard";
import DiscoveryFeed from "../Components/DiscoveryFeed";
import PostModal from "../Components/PostModal";
import { getAllPosts } from "../Services/Post";
import { getDiscoveryProjects } from "../Services/Project.js";
import ProjectModal from "../Components/ProjectModal.jsx";
const Mainpage = () => {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  // Posts for the main feed
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  // Feed loading state
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);

      const data = await getAllPosts();

      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };
  const fetchProjects = async () => {
  try {
    const data = await getDiscoveryProjects();

    setProjects(
      Array.isArray(data)
        ? data
        : data?.data ?? []
    );
  } catch (error) {
    console.error("Error fetching discovery projects:", error);
    setProjects([]);
  }
};

  // Load posts when Mainpage opens
  useEffect(() => {
  fetchPosts();
  fetchProjects();
}, []);

  // Called after creating/updating a post
  const handlePostSaved = async () => {
    await fetchPosts();
    setOpenPostModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-teal-200 via-teal-400 to-teal-00 dark:bg-black ">

      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard */}
      <main className="pt-6 px-6 min-h-screen bg-slate-50  transition-colors  bg-linear-to-b from-sky-100 via-teal-100 to-blue-100
  dark:from-black
  dark:via-black
  dark:to-black">

        <div className="max-w-7xl mx-auto">

          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-6">

            {/* ================= LEFT COLUMN ================= */}

            <aside className="col-span-3">

              <div className="space-y-6 sticky top-20 self-start">

                {/* Profile */}
                <ProfileCard />

                          
            {/* Your Space */}
            <div className="
              bg-white
              dark:bg-zinc-900
              rounded-2xl
              border
              border-sky-100
              dark:border-zinc-800
              shadow-sm
              p-5
            ">

              <h2 className="
                text-base
                font-semibold
                text-slate-800
                dark:text-white
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
                  dark:text-white
                  hover:bg-sky-50
                  dark:hover:bg-zinc-800
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
                  dark:text-white
                  hover:bg-sky-50
                  dark:hover:bg-zinc-800
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
                  dark:text-white
                  hover:bg-sky-50
                  dark:hover:bg-zinc-800
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
                  dark:text-white
                  hover:bg-sky-50
                  dark:hover:bg-zinc-800
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
                  dark:text-white
                  hover:bg-sky-50
                  dark:hover:bg-zinc-800
                  hover:text-sky-600
                  transition
                ">
                  <span>👥</span>
                  <span>My Connections</span>
                </button>

              </div>
            </div>
            </div>

            </aside>

            {/* ================= CENTER COLUMN ================= */}

            <section className="col-span-6 space-y-6">

              {/* Dashboard Header */}
              <DashboardHeader
                onShareIdea={() => setOpenPostModal(true)}
                onCreateProject={() => setCreateProjectOpen(true)}
              />
              <ProjectModal
                open={createProjectOpen}
                project={null}
                onClose={() => setCreateProjectOpen(false)}
                onSave={async () => {
                  setCreateProjectOpen(false);
                  await fetchProjects();
                }}
              />

              {/* Discovery Feed */}
             <DiscoveryFeed
              posts={posts}
              projects={projects}
              loading={loadingPosts}
              onPostDeleted={fetchPosts}
            />

            </section>

            {/* ================= RIGHT COLUMN ================= */}

            <aside className="col-span-3 space-y-10 sticky top-20 self-start">

              {/* People You May Know */}
              <Peoplemayknow />

              {/* Sidebar Footer */}
           <footer className="
            p-4
            rounded-2xl
            bg-white/60
            dark:bg-zinc-800
            border
            border-slate-200/60
            dark:border-slate-700
            text-slate-500
            dark:text-slate-400
          ">

                {/* Footer Links */}
               <div className="
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1.5
                  text-[11px]
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                ">

                  <a
                    href="#about"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    About
                  </a>

                  <a
                    href="#accessibility"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    Accessibility
                  </a>

                  <a
                    href="#help"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    Help Center
                  </a>

                  <a
                    href="#privacy"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    Privacy & Terms
                  </a>

                  <a
                    href="#ad-choices"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    Ad Choices
                  </a>

                  <a
                    href="#projects"
                    className="hover:text-sky-600 hover:underline transition-colors"
                  >
                    Projects
                  </a>

                </div>

                {/* Brand Copyright */}
                <div className="
                  mt-3
                  pt-3
                 border-t
              border-slate-200/60
              dark:border-slate-700/60
                  flex
                  items-center
                  justify-between
                  text-[11px]
                  text-slate-400
                ">

                  <div className="
                    flex
                    items-center
                    gap-1.5
                   font-semibold
                  text-slate-700
                  dark:text-slate-200
                  ">

                    <div className="
                      w-3.5
                      h-3.5
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

                    <span>Collabrix</span>

                  </div>

                  <span>
                    © {new Date().getFullYear()} All Rights Reserved
                  </span>

                </div>

              </footer>

            </aside>

          </div>

        </div>

      </main>

      {/* ================= POST MODAL ================= */}

      <PostModal
        open={openPostModal}
        onClose={() => setOpenPostModal(false)}
        onSave={handlePostSaved}
      />

    </div>
  );
};

export default Mainpage;