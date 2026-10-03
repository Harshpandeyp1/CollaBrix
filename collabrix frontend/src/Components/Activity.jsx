
import React from "react";

const Activity = ({ posts = [] }) => {
  return (
    <section className="mt-2 w-full max-w-4xl rounded-2xl border border-slate-200/80 bg-slate-100 px-6 py-5 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-800 dark:hover:border-zinc-700">

      {/* ================================
          HEADER
      ================================= */}

      <div className="flex items-start justify-between gap-4 mb-5">

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Your recent posts and ideas
          </p>
        </div>

        <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-zinc-400">
          {posts.length}{" "}
          {posts.length === 1 ? "post" : "posts"}
        </span>

      </div>

      {/* ================================
          EMPTY STATE
      ================================= */}

      {posts.length === 0 ? (

        <div className="border-t border-slate-100 py-10 text-center dark:border-zinc-800">

          <p className="text-sm text-slate-500 dark:text-zinc-400">
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
            border-slate-100
            scroll-smooth
            snap-x
            snap-mandatory
            dark:border-zinc-800
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
                border
                border-slate-200/80
                bg-white
                rounded-2xl
                p-5
                shadow-xs
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-slate-300
                hover:shadow-xl
                dark:border-zinc-800
                dark:bg-zinc-900
                dark:hover:border-zinc-700
              "
            >

              {/* ================================
                  POST HEADER
              ================================= */}

              <div className="flex items-center justify-between gap-3 ">

                <span className="
                  text-xs
                  font-medium
                  border
                  border-sky-100
                  bg-sky-50
                  text-sky-700
                  px-2.5
                  py-1
                  rounded-lg
                  dark:border-sky-900
                  dark:bg-sky-950/40
                  dark:text-sky-300
                ">
                  Idea
                </span>

                {post.createdAt && (
                  <span className="text-xs text-slate-400 dark:text-zinc-500">
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
                text-slate-900
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
                  text-slate-600
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
                    rounded-lg
                    text-xs
                    font-medium
                    border
                    border-slate-200
                    bg-slate-50
                    text-slate-700
                    dark:border-zinc-700
                    dark:bg-zinc-800
                    dark:text-zinc-300
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

