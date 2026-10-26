import api from "./api";

export const shareItem = async (shareData) => {
  const response = await api.post("/shares", shareData);
  return response.data;
};

export const getReceivedShares = async () => {
  const response = await api.get("/shares/received");
  return response.data;
};

export const markShareSeen = async (shareId) => {
  await api.patch(`/shares/${shareId}/seen`);
};
