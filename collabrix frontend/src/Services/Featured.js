import axios from 'axios';
import api from '../Services/api';
export const getFeatured= async () => {
    const response = await api.get('/featured');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.featured)) return data.featured;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    return [];
}
export const getFeaturedById= async (id) => {
    const response = await api.get(`/featured/${id}`);
    return response.data;
}
export const createFeatured= async (data) => {
    const response = await api.post('/featured', data);
    return response.data;
}
export const updateFeatured= async (id, data) => {
    const response = await api.put(`/featured/${id}`, data);
    return response.data;
}
export const deleteFeatured= async (id) => {
    const response = await api.delete(`/featured/${id}`);
    return response.data;
}