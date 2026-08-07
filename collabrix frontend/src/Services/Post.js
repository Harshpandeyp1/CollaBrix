import api from "../Services/api";

const API = "/posts";

// ======================
// GET
// ======================

export const getAllPosts = async () => {
  const response = await api.get(API);
  return response.data;
};

export const getMyPosts = async () => {
  const response = await api.get(`${API}/me`);
  return response.data;
};

export const getPostsByUser = async (userId) => {
  const response = await api.get(`${API}/user/${userId}`);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`${API}/${id}`);
  return response.data;
};

// ======================
// CREATE
// ======================

export const createPost = async (data) => {
  const response = await api.post(API, data);
  return response.data;
};

// ======================
// UPDATE
// ======================

export const updatePost = async (id, data) => {
  const response = await api.put(`${API}/${id}`, data);
  return response.data;
};

// ======================
// DELETE
// ======================

export const deletePost = async (id) => {
  const response = await api.delete(`${API}/${id}`);
  return response.data;
};