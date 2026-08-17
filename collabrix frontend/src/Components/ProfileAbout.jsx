
import React from "react";

export default function ProfileAbout({ profile = {} }) {

  const {
    bio = "",
    description = "",
    about = "",
    skills = []
  } = profile;

  const profileBio = bio || description || about;

  return (
    <section className="
           w-full max-w-4xl mt-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80 dark:bg-zinc-800 dark:hover:bg-zinc-900

    ">

      {/* ================= ABOUT ================= */}

      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        About
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-gray-400">
        {profileBio || "Building Projecter..."}
      </p>


      {/* ================= SKILLS ================= */}

      <div className="mt-6">

        <h3 className="text-base font-semibold text-gray-400 dark:text-white">
          Skills
        </h3>

        {Array.isArray(skills) && skills.length > 0 ? (

          <div className="flex flex-wrap gap-2 mt-3">

            {skills.map((skill, index) => (

              <span
                key={`${skill}-${index}`}
                className="
                  px-3
                  py-1.5
                  rounded-full
                  bg-sky-50
                  text-sky-700
                  border
                  border-sky-100
                  text-xs
                  font-semibold

                "
              >
                {skill}
              </span>

            ))}

          </div>

        ) : (

          <p className="mt-2 text-sm text-gray-500">
            No skills added yet.
          </p>

        )}

      </div>

    </section>
  );
}

