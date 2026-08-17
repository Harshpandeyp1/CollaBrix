import api from "../Services/api"
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const getUnreadNotifications = async () => {
  const response = await api.get("/notifications/unread");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.put(
    `/notifications/${notificationId}/read`
  );

  return response.data;
};