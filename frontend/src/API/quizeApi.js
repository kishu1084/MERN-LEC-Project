// services/quizApi.js
import axios from 'axios';
const API_URL = "http://localhost:5000/api/quiz"; // Update this as per your backend

export const uploadQuiz = async ({ quizFile, title, course, password, status }) => {
  if (!quizFile) throw new Error("Quiz file not provided");

  const formData = new FormData();
  formData.append("quizFile", quizFile);
  formData.append("title", title);
  formData.append("course", course);
  formData.append("password", password);
  formData.append("status", status);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(`${API_URL}/upload`, formData, config);
  return response.data;
};

export const deleteQuizById = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  };

// UPDATE quiz by ID
export const updateQuizById = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  };

export const getAllQuizzes = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

export const getQuizById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};



  
  