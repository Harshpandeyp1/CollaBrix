
import React, { useEffect, useState } from "react";
import {
  sendProjectInterest,
  getMyProjectInterest,
  getComments,
  createComments,
  getCommentCount,
  likePost,
  unlikePost,
  getLikeCount,
  hasLiked,
} from "../Services/Post";

const DiscoveryFeed = ({
  posts = [],
  projects = [],
  loading = false,
}) => {

  // Currently selected filter
  const [activeFilter, setActiveFilter] = useState("all");

  // Local like state for now
  const [likedItems, setLikedItems] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  // Local interested state for projects
  const [interestedItems, setInterestedItems] = useState({});
  const [interestLoadingItems, setInterestLoadingItems] = useState({});

  // Comment data cache
  const [comments, setComments] = useState({});

  // Comment counts
  const [commentCounts, setCommentCounts] = useState({});

  // Currently opened comments
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  // Comment drafts
  const [commentDrafts, setCommentDrafts] = useState({});

 

  const handleCommentChange = (postId, value) => {
    setCommentDrafts((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };


const handleInterest = async (postId, projectId) => {
  if (!projectId || interestLoadingItems[postId]) return;

  try {
    setInterestLoadingItems((prev) => ({
      ...prev,
      [postId]: true,
    }));

    await sendProjectInterest(projectId);

    // Interest belongs to the PROJECT, not the post
    setInterestedItems((prev) => ({
      ...prev,
      [projectId]: true,
    }));

  } catch (error) {
    console.error("Failed to send project interest:", error);

    alert(
      error.response?.data?.message ||
      "Failed to send interest"
    );

  } finally {
    setInterestLoadingItems((prev) => ({
      ...prev,
      [postId]: false,
    }));
  }
};

 
 

  const fetchLikeData = async (postId) => {
  try {
    const [liked, count] = await Promise.all([
      hasLiked(postId),
      getLikeCount(postId)
    ]);

    setLikedItems((prev) => ({
      ...prev,
      [postId]: liked
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [postId]: count
    }));

  } catch (error) {
    console.error("Failed to fetch like data:", error);
  }
};

  const filters = [
    { key: "all", label: "All Feed" },
    { key: "idea", label: "Ideas" },
    { key: "project", label: "Projects" },
  ];

  const projectFeedItems = projects.map((project) => ({
  id: `project-${project.id}`,
  project: project,
  isProjectFeedItem: true,
  title: project.title,
  description: project.description,
  techStack: project.techStack
    ? project.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean)
    : [],
}));
  // --------------------------------
  // FILTER POSTS
  // --------------------------------
  const filteredPosts = (() => {
  if (activeFilter === "idea") {
    return posts.filter((post) => !post.project);
  }

  if (activeFilter === "project") {
    return projectFeedItems;
  }

  return [
    ...posts,
    ...projectFeedItems,
  ];
})();
  const fetchCommentCount = async (postId) => { 
    try { 
      const count = await getCommentCount(postId); 
      setCommentCounts((prev) => ({ ...prev, [postId]: count, })); } 
      catch (error) {
         console.error( "Failed to fetch comment count:", error ); 
        
        } };

  // --------------------------------
  // LIKE
  // --------------------------------

 const toggleLike = async (id) => {
  const currentlyLiked = !!likedItems[id];

  try {

    if (currentlyLiked) {
      await unlikePost(id);
    } else {
      await likePost(id);
    }

    // Get fresh count from backend
    const count = await getLikeCount(id);

    setLikedItems((prev) => ({
      ...prev,
      [id]: !currentlyLiked
    }));

    setLikeCounts((prev) => ({
      ...prev,
      [id]: count
    }));

  } catch (error) {
    console.error("Failed to update like:", error);
  }
};

  // --------------------------------
  // COMMENTS
  // --------------------------------

 
const toggleComments = async (id) => {
  // If already open, close it
  if (openCommentsFor === id) {
    setOpenCommentsFor(null);
    return;
  }

  try {
    const data = await getComments(id);

    const commentList = Array.isArray(data)
      ? data
      : [];

    setComments((prev) => ({
      ...prev,
      [id]: commentList,
    }));

    // Keep count synchronized
    setCommentCounts((prev) => ({
      ...prev,
      [id]: commentList.length,
    }));

    setOpenCommentsFor(id);

  } catch (error) {
    console.error(
      "Failed to fetch comments:",
      error
    );
  }
};



const fetchMyProjectInterests = async () => {
  try {
    const data = await getMyProjectInterest();

    console.log("My project interests:", data);

    const interestMap = {};

    if (Array.isArray(data)) {
      data.forEach((interest) => {
        const projectId =
          interest.projectId ??
          interest.project?.id;

        if (projectId) {
          interestMap[projectId] = true;
        }
      });
    }

    setInterestedItems(interestMap);
  } catch (error) {
    console.error(
      "Failed to fetch project interests:",
      error
    );
  }
};

useEffect(() => {
  fetchMyProjectInterests();
}, []);

  
const handleCommentSubmit = async (id, e) => {
  e.preventDefault();

  const content = (commentDrafts[id] || "").trim();

  if (!content) {
    return;
  }

  try {
    // Create comment
    await createComments(id, {
      content: content,
    });

    // Get updated comments
    const data = await getComments(id);

    setComments((prev) => ({
      ...prev,
      [id]: Array.isArray(data) ? data : [],
    }));

    // Get updated comment count
    const count = await getCommentCount(id);

    setCommentCounts((prev) => ({
      ...prev,
      [id]: count,
    }));

    // Clear input
    setCommentDrafts((prev) => ({
      ...prev,
      [id]: "",
    }));

  } catch (error) {
    console.error(
      "Failed to create comment:",
      error
    );
  }
};



useEffect(() => { 
  if (!Array.isArray(posts) || posts.length === 0) { 
    return; } posts.forEach((post) => {
       if (post?.id != null) { fetchLikeData(post.id);
         fetchCommentCount(post.id); 
        } }); }, [posts]);

  




  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <section className="
        w-full
        bg-white/90
        backdrop-blur-sm
        rounded-2xl
        border
        border-slate-200/80
        dark:border-slate-700/80
        
        shadow-sm
        p-5
        sm:p-6
      ">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">
            Loading feed...
          </p>
        </div>
      </section>
    );
  }

  
return (
  <section className="text-black dark:text-white">

    <div className="space-y-4">

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`
              rounded-full
              px-4
              py-2
              text-xs
              font-semibold
              transition-all
              duration-200
              ${
                activeFilter === filter.key
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-100  dark:text-white dark:bg-black hover:bg-slate-200 dark:hover:bg-zinc-700 "
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-slate-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-sm text-slate-500 dark:text-slate-400">
          No {activeFilter === "idea" ? "ideas" : activeFilter === "project" ? "projects" : "posts"} found.
        </div>
      ) : (
        filteredPosts.map((post) => {
          const postId = post.id;
          const isProjectPost = !!post.project;
          const projectId =
            post.project?.id ?? post.projectId ?? post.project?._id;

          const isLiked = likedItems[postId] || false;
          const likeCount = likeCounts[postId] ?? post.likeCount ?? 0;

          const isCommentsOpen = openCommentsFor === postId;
          const postComments = comments[postId] || [];

          const isInterested = interestedItems[projectId] || false;

          const commentCount =
            commentCounts[postId] ?? post.commentCount ?? 0;

        return (

          <div
            key={postId}
            className="
              group
              p-5
              rounded-xl
              border
              border-slate-200/70
              dark:border-zinc-800
              bg-white
              dark:bg-zinc-900
              hover:border-sky-300/80
              dark:hover:border-sky-800
              hover:shadow-md
              hover:shadow-sky-500/5
              transition-all
              duration-200
            "
          >

            {/* ================= AUTHOR ================= */}

            <div className="
              flex
              items-center
              justify-between
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                {/* Avatar */}

                <div className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-linear-to-br
                  from-sky-500
                  to-teal-500
                  text-white
                  text-xs
                  font-bold
                  shadow-sm
                  ring-2
                  ring-white
                  dark:ring-zinc-900
                ">

                  {post.username?.fullName
                    ? post.username.fullName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U"}

                </div>

                {/* Author information */}

                <div>

                  <p className="
                    text-xs
                    font-bold
                    text-black
                    dark:text-white
                  ">
                    {post.username?.fullName ||
                      post.username?.username ||
                      "Unknown User"}
                  </p>

                  <p className="
                    text-[11px]
                    font-medium
                    text-black
                    dark:text-white
                  ">
                    {post.createdAt
                      ? new Date(
                          post.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </p>

                </div>

              </div>

              {/* ================= STATUS ================= */}

              {post.status && (

                <span className="
                  inline-flex
                  items-center
                  gap-1
                  px-2.5
                  py-0.5
                  rounded-full
                  text-[11px]
                  font-bold
                  tracking-wide
                  border
                  bg-sky-50
                  dark:bg-sky-950
                  text-sky-700
                  dark:text-sky-300
                  border-sky-200/60
                  dark:border-sky-800
                ">

                  <span className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-sky-500
                  " />

                  {post.status}

                </span>

              )}

            </div>


            {/* ================= TITLE ================= */}

            <h3 className="
              mt-3.5
              text-base
              font-bold
              text-black
              dark:text-white
              group-hover:text-sky-600
              transition-colors
              tracking-tight
            ">
              {post.title}
            </h3>


            {/* ================= DESCRIPTION ================= */}

            {post.description && (

              <p className="
                mt-1.5
                text-xs
                sm:text-sm
                leading-relaxed
                text-black
                dark:text-white
              ">
                {post.description}
              </p>

            )}

                        {/* ================= PROJECT ================= */}
{isProjectPost && post.project.lookingForCollaborators && (
  <div className="mb-3">
    <p className="text-xs font-semibold uppercase text-gray-500">
      Project
    </p>

    <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
      {post.project.title}
    </h3>

    {post.project.description && (
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
        {post.project.description}
      </p>
    )}

    {post.project.techStack && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {post.project.techStack}
      </p>
    )}

    <button
      onClick={() => handleInterest(postId, projectId)}
      disabled={
        !projectId ||
        interestLoadingItems[postId] ||
        interestedItems[projectId]
      }
      className={`mt-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
        interestedItems[projectId]
          ? "bg-emerald-100 text-emerald-700 cursor-default"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      }`}
    >
      {interestLoadingItems[postId]
        ? "Sending..."
        : interestedItems[projectId]
        ? "✓ Interest Sent"
        : "I'm Interested"}
    </button>
  </div>
)}

            {/* ================= TECH STACK ================= */}

            {post.techStack?.length > 0 && (

              <div className="
                mt-3
                flex
                flex-wrap
                gap-1.5
              ">

                {post.techStack.map((tech, index) => (

                  <span
                    key={`${postId}-tech-${index}`}
                    className="
                      px-2
                      py-1
                      rounded-md
                      bg-slate-100
                      dark:bg-zinc-800
                      text-black
                      dark:text-white
                      text-[10px]
                      font-medium
                    "
                  >
                    {tech}
                  </span>

                ))}

              </div>

            )}


            {/* ================= ACTIONS ================= */}

            <div className="
              mt-4
              pt-3.5
              border-t
              border-slate-100
              dark:border-zinc-800
              flex
              items-center
              gap-4
            ">

              {/* ================= LIKE ================= */}

              <button
                onClick={() =>
                  toggleLike(postId)
                }
                className={`
                  flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1.5
                  rounded-lg
                  text-xs
                  font-semibold
                  transition-all
                  active:scale-95

                  ${
                    isLiked
                      ? "text-sky-600"
                      : "text-black dark:text-white"
                  }
                `}
              >

                <svg
                  className={`
                    w-4
                    h-4
                    ${isLiked ? "scale-110" : ""}
                  `}
                  fill={
                    isLiked
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />

                </svg>

                <span>
                  {likeCount}
                </span>

              </button>


              {/* ================= COMMENTS ================= */}

              <button
                onClick={() =>
                  toggleComments(postId)
                }
                className={`
                  flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1.5
                  rounded-lg
                  text-xs
                  font-semibold
                  transition-all
                  active:scale-95

                  ${
                    isCommentsOpen
                      ? "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
                      : "text-black dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }
                `}
              >

                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />

                </svg>

                <span>
                  {commentCount}
                </span>

              </button>


              {/* ================= INTERESTED ================= */}

            {/* ================= COMMENTS ================= */}

            </div>

            {isCommentsOpen && (
              <div className="
                mt-3.5
                pt-3.5
                border-t
                border-slate-100
                dark:border-zinc-700
                bg-slate-50/50
                dark:bg-zinc-800/50
                p-3
                rounded-xl
              ">

                {/* Existing comments */}

                {postComments.length > 0 && (

                  <div className="
                    flex
                    flex-col
                    gap-2.5
                    mb-3
                  ">

                    {postComments.map(
                      (comment) => (

                        <div
                          key={comment.id}
                          className="
                            flex
                            items-start
                            gap-2
                          "
                        >

                          {/* Comment Avatar */}

                          <div className="
                            w-6
                            h-6
                            shrink-0
                            rounded-full
                            flex
                            items-center
                            justify-center
                            bg-linear-to-br
                            from-sky-400
                            to-teal-400
                            text-white
                            text-[9px]
                            font-bold
                          ">
                            {comment.username?.[0]}
                          </div>


                          {/* Comment */}

                          <div className="
                            bg-white
                            dark:bg-zinc-900
                            rounded-xl
                            p-2.5
                            flex-1
                            border
                            border-slate-100
                            dark:border-zinc-700
                          ">

                            <p className="
                              text-[11px]
                              font-bold
                              text-black
                              dark:text-white
                            ">
                              {comment.username ||
                                "Anonymous"}
                            </p>

                            <p className="
                              text-xs
                              text-black
                              dark:text-white
                              mt-0.5
                            ">
                              {comment.content}
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}


                {/* ================= COMMENT INPUT ================= */}

                <form
                  onSubmit={(e) =>
                    handleCommentSubmit(
                      postId,
                      e
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <input
                    type="text"
                    value={
                      commentDrafts[postId] ||
                      ""
                    }
                    onChange={(e) =>
                      handleCommentChange(
                        postId,
                        e.target.value
                      )
                    }
                    placeholder="Write a comment..."
                    className="
                      flex-1
                      text-xs
                      px-3
                      py-2
                      rounded-lg
                      bg-white
                      dark:bg-zinc-800
                      text-black
                      dark:text-white
                      placeholder-slate-400
                      border
                      border-slate-200
                      dark:border-zinc-700
                      outline-none
                      focus:ring-2
                      focus:ring-sky-500/20
                      focus:border-sky-500
                    "
                  />

                  <button
                    type="submit"
                    className="
                      px-3.5
                      py-2
                      rounded-lg
                      bg-slate-900
                      dark:bg-zinc-700
                      hover:bg-sky-600
                      text-white
                      text-xs
                      font-semibold
                      transition-colors
                    "
                  >
                    Post
                  </button>

                </form>

              </div>

            )}

          </div>

        );

      }))}

    </div>

  </section>
);


  
};

export default DiscoveryFeed;
