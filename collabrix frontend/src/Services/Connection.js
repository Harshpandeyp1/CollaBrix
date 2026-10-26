import api from "./api.js";

const normalizeConnections = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.connections)) return payload.connections;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

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

  return normalizeConnections(response.data);
};