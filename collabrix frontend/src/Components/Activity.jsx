
import React from "react";

const Activity = ({ posts = [] }) => {
  return (
    <section className="     w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80 dark:bg-zinc-800 dark:hover:bg-zinc-900
">

      {/* ================================
          HEADER
      ================================= */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Activity
          </h2>

          <p className="text-sm text-gray-500 mt-1 dark:text-zinc-400">
            Your recent posts and ideas
          </p>
        </div>

        <span className="shrink-0 text-sm text-gray-500">
          {posts.length}{" "}
          {posts.length === 1 ? "post" : "posts"}
        </span>

      </div>

      {/* ================================
          EMPTY STATE
      ================================= */}

      {posts.length === 0 ? (

        <div className="py-10 text-center border-t border-gray-100">

          <p className="text-sm text-gray-500">
            You haven't posted anything yet.
          </p>

        </div>

      ) : (

        /* ================================
           HORIZONTAL POSTS
        ================================= */

        <div
          className="
            flex
            gap-4
            w-full
            overflow-x-auto
            overflow-y-hidden
            pb-2
            pt-5
            border-t
            border-gray-100
            scroll-smooth
            snap-x
            snap-mandatory
            
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {posts.map((post) => (

            <article
              key={post.id ?? post._id}
              className="
                min-w-[320px]
                max-w-[320px]
                shrink-0
                snap-start
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition-shadow
                dark:bg-linear-to-br
              dark:from-zinc-800
              dark:via-teal-900
              dark:to-zinc-800
                      "
            >

              {/* ================================
                  POST HEADER
              ================================= */}

              <div className="flex items-center justify-between gap-3 ">

                <span className="
                  text-xs
                  font-medium
                  text-sky-600
                  bg-sky-50
                  px-2.5
                  py-1
                  rounded-full
                ">
                  Idea
                </span>

                {post.createdAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}

              </div>

              {/* ================================
                  TITLE
              ================================= */}

              <h3 className="
                mt-4
                text-base
                font-bold
                text-gray-900
                line-clamp-2
                dark:text-white
              ">
                {post.title}
              </h3>

              {/* ================================
                  DESCRIPTION
              ================================= */}

              {post.description && (
                <p className="
                  mt-2
                  text-sm
                  text-gray-600
                  leading-relaxed
                  line-clamp-5
                  dark:text-zinc-400
                ">
                  {post.description}
                </p>
              )}

              {/* ================================
                  STATUS
              ================================= */}

              {post.status && (
                <div className="mt-4">

                  <span className="
                    inline-flex
                    items-center
                    px-2.5
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    bg-gray-100
                    text-gray-700
                  ">
                    {post.status}
                  </span>

                </div>
              )}

            </article>

          ))}

        </div>

      )}

    </section>
  );
};

export default Activity;

