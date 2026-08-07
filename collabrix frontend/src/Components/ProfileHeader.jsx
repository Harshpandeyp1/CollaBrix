import React, { useRef, useState } from "react";
import { uploadProfileImage, uploadCoverImage } from "../Services/Profile";

// ------------------------------------------------------
// Helper Function
// If the user doesn't have a profile picture,
// generate initials from their name.
// Example:
// Harsh Kumar -> HK
// John -> J
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

// ------------------------------------------------------
// SVG Icons
// Keeping SVGs instead of react-icons because
// they're lightweight and fully customizable.
// ------------------------------------------------------

const SOCIAL_ICONS = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.25h4V23h-4V8.25zM8.5 8.25h3.83v2.01h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.85c0-1.63-.03-3.73-2.27-3.73-2.27 0-2.62 1.77-2.62 3.6V23h-4V8.25z" />
    </svg>
  ),

  github: (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.94c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  ),

  website: (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
    </svg>
  ),
};

const ProfileHeader = ({ profile, onEdit, onProfileImageUpdated, onCoverImageUpdated }) => {
  const safeProfile = profile || {}

  // ------------------------------------------------------
  // Object Destructuring
  // If any property is missing,
  // it'll become an empty string instead of undefined.
  // ------------------------------------------------------

  const {
    fullName = "",
    name = "",
    username = "",
    headline = "",
    location = "",
    website = "",
    github = "",
    linkedin = "",
    profileImage = "",
    coverImage = "",
  } = safeProfile;

  const displayName = fullName || name || username || "Profile";

  // ------------------------------------------------------
  // Create Social Links Dynamically
  // filter(Boolean) removes null values.
  // ------------------------------------------------------

  const socialLinks = [
    website && { type: "website", url: website },
    github && { type: "github", url: github },
    linkedin && { type: "linkedin", url: linkedin },
  ].filter(Boolean);

  const initials = getInitials(displayName);

  // ------------------------------------------------------
  // Profile Image Upload
  // Hidden file input is triggered by the camera button.
  // ------------------------------------------------------

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await uploadProfileImage(file);
      onProfileImageUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  // ------------------------------------------------------
  // Cover Image Upload
  // Same pattern as the profile image, separate input/button.
  // ------------------------------------------------------

  const coverInputRef = useRef(null);
  const [isCoverUploading, setIsCoverUploading] = useState(false);

  const handleCoverCameraClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCoverUploading(true);
      await uploadCoverImage(file);
      onCoverImageUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCoverUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-lg mr-80">

      {/* ==================================================
              COVER IMAGE
      =================================================== */}

      <div
        className="relative h-52 bg-linear-to-r from-indigo-600 via-violet-600 to-blue-600 bg-cover bg-center"
        style={
          coverImage
            ? {
                backgroundImage: `url(${coverImage})`,
              }
            : undefined
        }
      >
        {/* Dark overlay makes text visible on bright images */}
        <div className="absolute inset-0 bg-black/20"></div>

        {onEdit && (
          <button
            onClick={onEdit}
            className="absolute right-4 top-4 rounded-full bg-white/80 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white transition"
          >
            ✏ Edit Profile
          </button>
        )}

        {/* Hidden file input, triggered by the cover camera button */}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          onChange={handleCoverFileChange}
          className="hidden"
        />

        {/* Cover photo camera button overlay */}
        <button
          type="button"
          onClick={handleCoverCameraClick}
          disabled={isCoverUploading}
          aria-label="Change cover photo"
          className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white transition disabled:opacity-50"
        >
          {isCoverUploading ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          ) : (
            <span>📷</span>
          )}
          Change Cover
        </button>
      </div>

      <div className="px-6 pb-6">

        {/* ==================================================
              PROFILE IMAGE
              Negative margin pulls image over cover.
        =================================================== */}

        <div className="-mt-16 mb-4 flex justify-between items-end">

          <div className="relative">

            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-indigo-500 to-purple-600 text-4xl font-bold text-white shadow-lg">
                {initials}
              </div>
            )}

            {/* Hidden file input, triggered by the camera button */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Camera button overlay */}
            <button
              type="button"
              onClick={handleCameraClick}
              disabled={isUploading}
              aria-label="Change profile photo"
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50 transition disabled:opacity-50"
            >
              {isUploading ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              ) : (
                <span className="text-sm">📷</span>
              )}
            </button>
          </div>
        </div>

        {/* ==================================================
                  USER DETAILS
        =================================================== */}

        <div className="space-y-3">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {displayName}
            </h1>

            <p className="text-indigo-600 font-medium">
              {headline || "Add a professional headline"}
            </p>
          </div>

          {/* Show location only if available */}

          {location && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">

              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {location}
            </div>
          )}

          {/* ==================================================
                      SOCIAL LINKS
          =================================================== */}

          {socialLinks.length > 0 && (
            <div className="flex gap-3 pt-2">

              {socialLinks.map(({ type, url }) => (
                <a
                  key={`${type}-${url}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:scale-110 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
                >
                  {SOCIAL_ICONS[type]}
                </a>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
