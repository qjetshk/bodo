import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth`,
  withCredentials: true,
});

let isRefreshing = false;
let failedRequests: Array<() => void> = [];

const refreshAccessToken = async () => {
  try {
    const result = await api.post("/refresh");
    const {data} = result
    localStorage.setItem("accessToken", data.accessToken);
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequests.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        localStorage.removeItem('user')
        console.log('sdfsd')
        await refreshAccessToken();
        failedRequests.forEach((cb) => cb());
        failedRequests = [];
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
