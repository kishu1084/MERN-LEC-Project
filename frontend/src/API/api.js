import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data) => {
  return await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, 
      data, 
      { withCredentials: true }
  );
};

export const login = async (data) => {
  return await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, 
      data, 
      { withCredentials: true } // Enable cookies
  );
};
export const getDashboard = () => api.get("/dashboard");

// export const googleAuth = async () => {
//   try {
//     window.open(`${API_BASE_URL}/google`, "_self"); // Open Google Auth
//   } catch (error) {
//     console.error("Google Login Failed:", error);
//   }
// };
export default api;
