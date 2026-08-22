import api from "./api";

// ==========================================
// NORMALIZE API RESPONSE
// ==========================================

const normalizeResponseData = (response) => {
  const data = response?.data;

  return (
    data?.data ??
    data?.projects ??
    data?.project ??
    data ??
    []
  );
};


// ==========================================
// MY PROJECTS
// ==========================================

export const getProjects = async () => {
  const response = await api.get("/projects");

  return normalizeResponseData(response);
};


// ==========================================
// GET SINGLE PROJECT
// ==========================================

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);

  return normalizeResponseData(response);
};


// ==========================================
// CREATE PROJECT
// ==========================================

export const createProject = async (projectData) => {
  const response = await api.post(
    "/projects",
    projectData
  );

  return normalizeResponseData(response);
};


// ==========================================
// DISCOVERY PROJECTS
// ==========================================

export const getDiscoveryProjects = async () => {
  const response = await api.get("/projects/discovery");

  return normalizeResponseData(response);
};

// ==========================================
// PROJECT INTERESTS
// ==========================================

// Get people interested in my project

export const getProjectInterests = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/interests`
  );

  return normalizeResponseData(response);
};


// ==========================================
// ACCEPT / REJECT PROJECT INTEREST
// ==========================================

export const updateProjectInterestStatus = async (
  interestId,
  status
) => {
  const response = await api.put(
    `/projects/interests/${interestId}`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return normalizeResponseData(response);
};


// ==========================================
// UPDATE PROJECT
// ==========================================

export const updateProject = async (
  id,
  projectData
) => {
  const response = await api.put(
    `/projects/${id}`,
    projectData
  );

  return normalizeResponseData(response);
};


// ==========================================
// DELETE PROJECT
// ==========================================

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};

export const removeProjectInterest = async (interestId) => {
  const response = await api.delete(`/projects/interests/${interestId}`);
  return response.data;
};