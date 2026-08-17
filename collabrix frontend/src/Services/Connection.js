import api from "./api.js";

export const sendConnectionRequest = async (receiverId) => {
  const response = await api.post(
    "/connections/request",
    {
      receiverId,
    }
  );

  return response.data;
};


export const getConnectionRequests = async () => {
  const response = await api.get(
    "/connections/requests"
  );

  return response.data;
};


export const updateConnectionStatus = async (connectionId, status) => {
    const response = await api.put(
        `/connections/${connectionId}/status`,
        null,
        {
            params: {
                status: status
            }
        }
    );

    return response.data;
};

export const getMyConnections = async () => {
  const response = await api.get(
    "/connections"
  );

  return response.data;
};