import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashBoardHeader";
import Peoplemayknow from "../Components/Peoplemayknow";
import ProfileCard from "../Components/ProfileCard";
import YourSpace from "../Components/YourSpace";
import DiscoveryFeed from "../Components/DiscoveryFeed";
import PostModal from "../Components/PostModal";
import { getAllPosts, getMyPosts } from "../Services/Post";
import { getProjects, getDiscoveryProjects } from "../Services/Project.js";
import { getMyConnections } from "../Services/Connection.js";
import { getProfile } from "../Services/Profile.js";
import ProjectModal from "../Components/ProjectModal.jsx";

const getItems = (response, keys) => {
  if (Array.isArray(response)) return response;

  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }

  return [];
};

const Mainpage = () => {
  const [openPostModal, setOpenPostModal] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileStats, setProfileStats] = useState({
    projects: null,
    connections: null,
    ideas: null,
  });

  // Posts for the main feed
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  // Feed loading state
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching dashboard profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchProfileStats = async () => {
    const [projectsResult, connectionsResult, ideasResult] =
      await Promise.allSettled([
        getProjects(),
        getMyConnections(),
        getMyPosts(),
      ]);

    if (projectsResult.status === "rejected") {
      console.error(
        "Error fetching profile project count:",
        projectsResult.reason
      );
    }
    if (connectionsResult.status === "rejected") {
      console.error(
        "Error fetching profile connection count:",
        connectionsResult.reason
      );
    }
    if (ideasResult.status === "rejected") {
      console.error("Error fetching profile idea count:", ideasResult.reason);
    }

    setProfileStats({
      projects:
        projectsResult.status === "fulfilled"
          ? getItems(projectsResult.value, ["projects", "data"]).length
          : null,
      connections:
        connectionsResult.status === "fulfilled"
          ? getItems(connectionsResult.value, ["connections", "data"]).length
          : null,
      ideas:
        ideasResult.status === "fulfilled"
          ? getItems(ideasResult.value, ["posts", "ideas", "data"]).filter(
              (idea) => !idea.project
            ).length
          : null,
    });
  };

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
    fetchProfile();
    fetchPosts();
    fetchProjects();
    fetchProfileStats();

    window.addEventListener("profile-updated", fetchProfile);
    return () => window.removeEventListener("profile-updated", fetchProfile);
  }, []);

  // Called after creating/updating a post
  const handlePostSaved = async () => {
    await Promise.all([fetchPosts(), fetchProfileStats()]);
    setOpenPostModal(false);
  };

  const refreshDashboardContent = async () => {
    await Promise.all([fetchPosts(), fetchProjects(), fetchProfileStats()]);
  };

  return (
    <div className="min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard */}
      <main className="pt-6 px-6 min-h-screen transition-colors">

        <div className="mx-auto max-w-7xl">

          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-6">

            {/* ================= LEFT COLUMN ================= */}

            <aside className="col-span-3">

              <div className="space-y-6 sticky top-20 self-start">

                {/* Profile */}
                <ProfileCard
                  profile={profile}
                  loading={loadingProfile}
                  stats={profileStats}
                />

                          
            <YourSpace />
            </div>

            </aside>

            {/* ================= CENTER COLUMN ================= */}

            <section className="col-span-6 space-y-6">

              {/* Dashboard Header */}
              <DashboardHeader
                profile={profile}
                onShareIdea={() => setOpenPostModal(true)}
                onCreateProject={() => setCreateProjectOpen(true)}
              />
              <ProjectModal
                open={createProjectOpen}
                project={null}
                onClose={() => setCreateProjectOpen(false)}
                onSave={async () => {
                  setCreateProjectOpen(false);
                  await Promise.all([fetchProjects(), fetchProfileStats()]);
                }}
              />

              {/* Discovery Feed */}
             <DiscoveryFeed
              posts={posts}
              projects={projects}
              loading={loadingPosts}
              onPostDeleted={refreshDashboardContent}
              onFeedUpdated={refreshDashboardContent}
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