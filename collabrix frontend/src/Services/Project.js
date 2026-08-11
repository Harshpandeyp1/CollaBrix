import api from './api';

const normalizeResponseData = (response) => {
  const data = response.data;
  return data?.data ?? data?.projects ?? data?.project ?? data;
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return normalizeResponseData(response);
}

// GET one project
export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return normalizeResponseData(response);
};

// CREATE project
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return normalizeResponseData(response);
};


// ======================
// PROJECT INTEREST MANAGEMENT
// ======================

// Get all users interested in my project

// ======================
// PROJECT INTERESTS
// ======================

// Get all users interested in a project
export const getProjectInterests = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/interests`
  );

  return response.data;
};
export const getDiscoveryProjects = async () => {
  const response = await api.get("/projects/discovery");
  return response.data;
};


// Accept / Reject project interest
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

  return response.data;
};





// UPDATE project
export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return normalizeResponseData(response);
};

// DELETE project
export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};