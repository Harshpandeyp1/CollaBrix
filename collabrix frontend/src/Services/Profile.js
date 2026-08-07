import api from "../Services/api.js";

const normalizeProfile = (data) => {
  const payload = data?.data ?? data;
  const profile = payload?.profile ?? payload?.user ?? payload ?? {};

  return {
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
    profileImage:
      profile.profileImage || profile.avatar || profile.avatarUrl || profile.photo || profile.picture || "",
    coverImage:
      profile.coverImage || profile.cover || profile.coverUrl || profile.background || "",
    ...profile,
  };
};

export const getProfile = async () => {
  const response = await api.get("/profile/me");
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
