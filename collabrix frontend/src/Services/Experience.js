import api from '../Services/api';

export const getExperience=async () => {
    const response = await api.get('/experiences');
    return response.data.data;
}

export const createExperience=async (experiences) => {
    const response = await api.post('/experiences', experiences);
    return response.data.data;
}

export const getExperienceById=async (id) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data.data;
}
export const updateExperience=async (id, experiences) => {
    const response = await api.put(`/experiences/${id}`, experiences);
    return response.data.data;
}
export const deleteExperience=async (id) => {
    const response = await api.delete(`/experiences/${id}`);
    return response.data.data;
}
