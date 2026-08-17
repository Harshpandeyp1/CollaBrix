import React, { useEffect, useState } from 'react'
import { getProfile } from '../Services/Profile';

// ------------------------------------------------------
// Same initials helper as ProfileHeader, kept local so
// this card has no dependency on that component.
// ------------------------------------------------------
const getInitials = (name) => {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

const ProfileCard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setloading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 dark:">
        <div className="p-6 animate-pulse">
          Loading Profile...
        </div>
      </section>
    );
  }

  const safeProfile = profile || {};

  const {
    fullName = "",
    name = "",
    username = "",
    headline = "",
    bio = "",
    profileImage = "",
    coverImage = "",
  } = safeProfile;

  const displayName = fullName || name || username || "Profile";
  const initials = getInitials(displayName);

  return (
    <section className="bg-white rounded-2xl border border-sky-100  dark:text-white shadow-sm overflow-hidden  dark:bg-linear-to-br
      dark:from-zinc-800
      dark:via-teal-900
      dark:to-zinc-800">

      {/* Cover Image */}
      <div
        className="h-24 bg-linear-to-r from-sky-400 via-cyan-400 to-teal-400 bg-cover bg-center"
        style={coverImage ? { backgroundImage: `url(${coverImage})` } : undefined}
      >
      </div>

      {/* Profile Content */}
      <div className="px-5 pb-5">

        {/* Profile Image */}
        <div className="-mt-10 mb-3">

          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName}
              className="
                w-20
                h-20
                rounded-full
                border-4
                border-white
                object-cover
                bg-white
              "
            />
          ) : (
            <div className="
              w-20
              h-20
              rounded-full
              border-4
              border-white
              bg-linear-to-br
              from-sky-400
              to-teal-400
              flex
              items-center
              dark:text-white
              justify-center
              text-white
              text-xl
              font-bold
            ">
              {initials}
            </div>
          )}

        </div>

        {/* Name */}
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {displayName}
        </h2>

        {/* Headline */}
        <p className="text-sm text-sky-600 mt-1 dark:text-white/25">
          {headline || "Add a headline"}
        </p>

        {/* About / Bio */}
        <p className="text-sm text-slate-500 mt-3 leading-5 dark:text-black">
          {bio || "Tell people about yourself."}
        </p>

        {/* Divider */}
        <div className="border-t border-zinc-900 my-4"></div>

        {/* Profile Stats */}
        <div className="flex justify-between text-center dark:text-white">

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              12
            </p>

            <p className="text-xs text-slate-500 dark:text-white/25">
              Projects
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              248
            </p>

            <p className="text-xs text-slate-500 dark:text-white/25">
              Connections
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              8
            </p>

            <p className="text-xs text-slate-500 dark:text-white/25">
              Ideas
            </p>
          </div>

        </div>

      </div>

    </section>
  )
}

export default ProfileCard