// import axios from "axios";
import api from "app/apis/axios";
const api = api.create({
  baseURL: process.env.REACT_APP_SERVER_IP_ADDRESS,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh_token");

        const res = await api.post(
          `${process.env.REACT_APP_SERVER_IP_ADDRESS}/api/token/refresh/`,
          { refresh }
        );

        localStorage.setItem("token", res.data.access);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
