
import React, { useState } from "react";

const DiscoveryFeed = ({ posts = [], loading = false }) => {

  // Currently selected filter
  const [activeFilter, setActiveFilter] = useState("all");

  // Local like state for now
  const [likedItems, setLikedItems] = useState({});

  // Local interested state for projects
  const [interestedItems, setInterestedItems] = useState({});

  // Currently opened comments
  const [openCommentsFor, setOpenCommentsFor] = useState(null);

  // Comment drafts
  const [commentDrafts, setCommentDrafts] = useState({});

  // Local comments for now
  const [comments, setComments] = useState({});

  const filters = [
    { key: "all", label: "All Feed" },
    { key: "idea", label: "Ideas" },
    { key: "project", label: "Projects" },
  ];

  // --------------------------------
  // FILTER POSTS
  // --------------------------------

  const filteredPosts = posts.filter((post) => {

    if (activeFilter === "all") {
      return true;
    }

    /*
      Your backend Post entity has PostStatus.
      We currently treat posts as "idea".

      Later, when Project posts are integrated,
      we can use a proper post type/category.
    */

    if (activeFilter === "idea") {
      return true;
    }

    if (activeFilter === "project") {
      return false;
    }

    return true;
  });

  // --------------------------------
  // LIKE
  // --------------------------------

  const toggleLike = (id) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --------------------------------
  // INTERESTED
  // --------------------------------

  const toggleInterested = (id) => {
    setInterestedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --------------------------------
  // COMMENTS
  // --------------------------------

  const toggleComments = (id) => {
    setOpenCommentsFor((prev) =>
      prev === id ? null : id
    );
  };

  const handleCommentChange = (id, text) => {
    setCommentDrafts((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleCommentSubmit = (id, e) => {
    e.preventDefault();

    const text = (commentDrafts[id] || "").trim();

    if (!text) {
      return;
    }

    const newComment = {
      id: Date.now(),
      author: "You",
      text,
    };

    setComments((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        newComment,
      ],
    }));

    setCommentDrafts((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

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
    <section className="
      w-full
      bg-white/90
      backdrop-blur-sm
      rounded-2xl
      border
      border-slate-200/80
      shadow-sm
      p-5
      sm:p-6
    ">

      {/* ================= HEADER ================= */}

      <div className="
        mb-6
        flex
        items-center
        justify-between
        border-b
        border-slate-100
        pb-4
      ">

        <div>
          <h2 className="
            text-lg
            font-bold
            tracking-tight
            text-slate-800
          ">
            Discover Community
          </h2>

          <p className="
            mt-0.5
            text-xs
            font-medium
            text-slate-500
          ">
            Explore ideas, open-source builds, and collaborators across Collabrix
          </p>
        </div>

        <div className="
          hidden
          sm:flex
          w-10
          h-10
          rounded-xl
          bg-linear-to-tr
          from-sky-500
          via-sky-600
          to-teal-500
          items-center
          justify-center
          shadow-md
          shadow-sky-500/20
        ">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

      </div>

      {/* ================= FILTERS ================= */}

      <div className="
        flex
        items-center
        gap-1
        mb-6
        p-1
        bg-slate-100/80
        rounded-xl
        w-fit
        border
        border-slate-200/60
      ">

        {filters.map(({ key, label }) => (

          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`
              px-4
              py-1.5
              rounded-lg
              text-xs
              font-semibold
              transition-all
              duration-200

              ${
                activeFilter === key
                  ? "bg-white text-sky-700 shadow-sm ring-1 ring-slate-200/60"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }
            `}
          >
            {label}
          </button>

        ))}

      </div>

      {/* ================= EMPTY STATE ================= */}

      {filteredPosts.length === 0 && (

        <div className="
          text-center
          py-12
          bg-slate-50/50
          rounded-xl
          border
          border-dashed
          border-slate-200
        ">

          <p className="
            text-sm
            font-medium
            text-slate-400
          ">
            No posts to show right now.
          </p>

          <p className="
            text-xs
            text-slate-400
            mt-1
          ">
            Be the first person to share an idea.
          </p>

        </div>

      )}

      {/* ================= POSTS ================= */}

      <div className="space-y-4">

        {filteredPosts.map((post) => {

          /*
            Backend IDs can be numeric or UUID/string.
            Use id as the single identifier.
          */

          const postId = post.id;

          const isLiked = likedItems[postId];

          const isInterested =
            interestedItems[postId];

          const isCommentsOpen =
            openCommentsFor === postId;

          const postComments =
            comments[postId] || [];

          /*
            Backend may not have these counters yet.
            Therefore we safely fall back to zero.
          */

          const likeCount =
            (post.likeCount || 0) +
            (isLiked ? 1 : 0);

          const commentCount =
            (post.commentCount || 0) +
            postComments.length;

          return (

            <div
              key={postId}
              className="
                group
                p-5
                rounded-xl
                border
                border-slate-200/70
                bg-white
                hover:border-sky-300/80
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
                  ">

                    {post.author?.fullName
                      ? post.author.fullName
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
                      text-slate-800
                    ">
                      {post.author?.fullName ||
                        post.author?.username ||
                        "Unknown User"}
                    </p>

                    <p className="
                      text-[11px]
                      font-medium
                      text-slate-400
                    ">
                      {post.createdAt
                        ? new Date(
                            post.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>

                  </div>

                </div>

                {/* Status */}

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
                    text-sky-700
                    border-sky-200/60
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
                text-slate-800
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
                  text-slate-600
                ">
                  {post.description}
                </p>

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
                        text-slate-600
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
                flex
                items-center
                gap-4
              ">

                {/* Like */}

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
                        ? "bg-rose-50 text-rose-600"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
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

                {/* Comments */}

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
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
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

                {/* Interested */}

                <button
                  onClick={() =>
                    toggleInterested(postId)
                  }
                  className={`
                    ml-auto
                    px-3.5
                    py-1.5
                    rounded-lg
                    text-xs
                    font-bold
                    transition-all
                    duration-200
                    active:scale-95

                    ${
                      isInterested
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300/80"
                        : "bg-sky-600 hover:bg-sky-700 text-white"
                    }
                  `}
                >
                  {isInterested
                    ? "✓ Interested"
                    : "I'm Interested"}
                </button>

              </div>

              {/* ================= COMMENTS ================= */}

              {isCommentsOpen && (

                <div className="
                  mt-3.5
                  pt-3.5
                  border-t
                  border-slate-100
                  bg-slate-50/50
                  p-3
                  rounded-xl
                ">

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
                              {comment.author?.[0]}
                            </div>

                            <div className="
                              bg-white
                              rounded-xl
                              p-2.5
                              flex-1
                              border
                              border-slate-100
                            ">

                              <p className="
                                text-[11px]
                                font-bold
                                text-slate-800
                              ">
                                {comment.author}
                              </p>

                              <p className="
                                text-xs
                                text-slate-600
                                mt-0.5
                              ">
                                {comment.text}
                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                  {/* Comment input */}

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
                        border
                        border-slate-200
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
        })}

      </div>

    </section>
  );
};

export default DiscoveryFeed;
