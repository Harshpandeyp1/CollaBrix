import api from "./api";

// ==========================================
// NORMALIZE API RESPONSE
// ==========================================

const normalizeResponseData = (response) => {
  const data = response?.data;

  return (
    data?.data ??
    data?.ideas ??
    data?.idea ??
    data ??
    []
  );
};

// ==========================================
// GET IDEAS BY PROJECT
// ==========================================

export const getIdeas = async (projectId) => {
  const response = await api.get(`/playground/${projectId}/ideas`);

  return normalizeResponseData(response);
};

// ==========================================
// CREATE IDEA
// ==========================================

export const createIdea = async (projectId, ideaData) => {
  const response = await api.post(
    `/playground/${projectId}/ideas`,
    ideaData
  );

  return normalizeResponseData(response);
};

// ==========================================
// UPDATE IDEA
// ==========================================

export const updateIdea = async (ideaId, ideaData) => {
  const response = await api.put(
    `/playground/ideas/${ideaId}`,
    ideaData
  );

  return normalizeResponseData(response);
};

// ==========================================
// DELETE IDEA
// ==========================================

export const deleteIdea = async (ideaId) => {
  await api.delete(`/playground/ideas/${ideaId}`);
};

// ==========================================
// SAVED IDEAS (per-user bookmarks)
// ==========================================

export const saveIdea = async (ideaId) => {
  await api.post(`/saved-ideas/${ideaId}`);
};

export const unsaveIdea = async (ideaId) => {
  await api.delete(`/saved-ideas/${ideaId}`);
};

export const getSavedIdeas = async () => {
  const response = await api.get("/saved-ideas");

  return normalizeResponseData(response);
};

export const toggleSaveIdea = async (ideaId, saved) => {
  if (saved) {
    return saveIdea(ideaId);
  }

  return unsaveIdea(ideaId);
};