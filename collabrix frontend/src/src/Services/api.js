import axios from "axios";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://collabrix-1-bw34.onrender.com/api";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

export const getApiOrigin = () => {
  if (/^https?:\/\//i.test(API_BASE_URL)) {
    return new URL(API_BASE_URL).origin;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:8080";
  }

  return typeof window !== "undefined" ? window.location.origin : "";
};

export const getWebSocketUrl = () => {
  const apiOrigin = getApiOrigin();
  if (!apiOrigin) {
    return "";
  }

  const url = new URL("/ws", apiOrigin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
};

const api = axios.create({
    baseURL: API_BASE_URL,
});
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
}
)
export default api;
