import React from "react";

export default function ProfileAbout({ profile = {} }) {
  const { bio = "", description = "", about = "" } = profile;
  const profileBio = bio || description || about;

  return (
    <section className="w-full max-w-4xl mt-6 rounded-2xl bg-white border border-gray-200 shadow-lg px-6 py-5 mr-80">
      <h2 className="text-lg font-bold text-gray-900">About</h2>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        {profileBio || "Building Projecter..."}
      </p>

      {/* Future sections — keep this component focused for now:
      <ul className="mt-4 space-y-1 text-sm text-gray-600">
        <li>Interests</li>
        <li>Languages</li>
        <li>Personal website</li>
        <li>Other details</li>
      </ul>
      */}
    </section>
  );
}
