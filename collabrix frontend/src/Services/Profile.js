import api from "../Services/api.js";

const PROFILE_IMAGE_FIELDS = [
  "profileImage",
  "profile_image",
  "profilePicture",
  "profile_picture",
  "createdByProfileImage",
  "senderProfileImage",
  "userProfileImage",
  "avatar",
  "avatarUrl",
  "avatar_url",
  "photo",
  "photoUrl",
  "photo_url",
  "picture",
  "image",
];

export const getProfileImage = (profile) => {
  if (typeof profile === "string") {
    return profile.trim();
  }

  if (!profile || typeof profile !== "object") {
    return "";
  }

  for (const field of PROFILE_IMAGE_FIELDS) {
    const image = profile[field];
    if (typeof image === "string" && image.trim()) {
      return image.trim();
    }
  }

  return "";
};

export const getProfileImageUrl = (profileOrImage) => {
  const image = getProfileImage(profileOrImage);
  if (!image || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(image)) {
    return image;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const apiOrigin =
    apiBaseUrl && /^https?:\/\//i.test(apiBaseUrl)
      ? new URL(apiBaseUrl).origin
      : import.meta.env.DEV
        ? "http://localhost:8080"
        : typeof window !== "undefined"
          ? window.location.origin
          : "";

  if (!apiOrigin) {
    return image;
  }

  return new URL(image.startsWith("/") ? image : `/${image}`, `${apiOrigin}/`).toString();
};

const normalizeProfile = (data) => {
  const payload = data?.data ?? data;
  const profile = payload?.profile ?? payload?.user ?? payload ?? {};

  return {
    ...profile,
    fullName:
      profile.fullName || profile.full_name || profile.name || profile.displayName || profile.display_name || "",
    username: profile.username || profile.userName || profile.user_name || profile.handle || "",
    headline:
      profile.headline || profile.title || profile.tagline || profile.profession || profile.summary || "",
    bio:
      profile.bio || profile.description || profile.about || profile.aboutMe || profile.about_me || "",
    location:
      profile.location || profile.city || profile.address || profile.country || "",
    website:
      profile.website || profile.url || profile.websiteUrl || profile.website_url || "",
    github:
      profile.github || profile.githubUrl || profile.github_url || profile.github_link || "",
    linkedin:
      profile.linkedin || profile.linkedinUrl || profile.linkedin_url || profile.linkedin_link || "",
    profileImage: getProfileImage(profile),
    coverImage:
      profile.coverImage || profile.cover || profile.coverUrl || profile.background || "",
  };
};

export const getProfile = async () => {
  const response = await api.get("/profile/me");
  return normalizeProfile(response.data);
};

export const getProfileByUserId = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return normalizeProfile(response.data);
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);
  return response.data;
};

export const uploadProfileImage=async(file)=>{
    const formData=new FormData();

    formData.append("file",file);

    const response=await api.post("/profile/profile-image",formData,);
    return response.data;
}

export const uploadCoverImage = async (file) => {
   const formData=new FormData();
   formData.append("file",file);
   const response=await api.post("/profile/cover-image",formData);
   return response.data;
}
