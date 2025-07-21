// utills.js
import axios from 'axios';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/faqs', // adjust if needed
  headers: {
    'Content-Type': 'application/json',
  },
});


// other named exports
export const IMAGE_URL = process.env.BACKEND_URL ||"http://localhost:5000";
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const notify = (message, type = "info") => {
  switch (type) {
      case "success":
          toast.success(message);
          break;
      case "error":
          toast.error(message);
          break;
      case "warning":
          toast.warning(message);
          break;
      default:
          toast.info(message);
          break;
  }
}; // just an example

export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (err) {
    return false;
  }
};
