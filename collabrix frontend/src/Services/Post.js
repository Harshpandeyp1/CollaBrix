import api from "../Services/api";

const API = "/posts";

// ======================
// GET
// ======================

export const getAllPosts = async () => {
  const response = await api.get(API);
  return response.data;
};

export const getComments=async(postId)=>{
  const response = await api.get(`${API}/${postId}/comments`);
  return response.data;
}
export const createComments=async(postId,data)=>{
  const response = await api.post(`${API}/${postId}/comments`,data);
  return response.data;
}
export const deletecomments=async(commentId)=>{
  const response = await api.delete(`${API}/comments/${commentId}`);
  return response.data;

}
 export const getCommentCount = async (postId) => {
   const response = await api.get( `${API}/${postId}/comments/count` );
    return response.data.commentCount; };
// ======================
// PROJECT INTEREST
// ======================

export const sendProjectInterest = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/interest`);
  return response.data;
};

export const getMyProjectInterest = async () => { 
  const response = await api.get("/projects/interests/me"); 
    return response.data; 
  };

export const likePost=async(postId)=>{
  const response=await api.post(`${API}/${postId}/like`);
  return response.data; 
};
export const unlikePost = async (postId) => {
  const response = await api.delete(`${API}/${postId}/like`);
  return response.data;
};
export const getLikeCount=async(postId)=>{
  const response =await api.get(`${API}/${postId}/likes`);
  return response.data; 
}
export const hasLiked = async (postId) => {
  const response = await api.get(`${API}/${postId}/liked`);
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