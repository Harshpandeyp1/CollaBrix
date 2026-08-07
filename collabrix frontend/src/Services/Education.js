import api from './api.js';

export const getEducation = async () => {
    const response = await api.get('/education');
    return response.data?.data ?? response.data ?? [];
}

export const createEducation = async (education) => {
    const response = await api.post('/education', education);
    return response.data?.data ?? response.data;
}

export const getEducationById = async (id) => {
    const response = await api.get(`/education/${id}`);
    return response.data?.data ?? response.data;
}

export const updateEducation = async (id, education) => {
    const response = await api.put(`/education/${id}`, education);
    return response.data?.data ?? response.data;
}

export const deleteEducation = async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data?.data ?? response.data;
}