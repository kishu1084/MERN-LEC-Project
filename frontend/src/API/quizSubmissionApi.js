import axios from 'axios';

export const submitQuizResult = async (data) => {
    const res = await axios.post('http://localhost:5000/api/quizSubmission/submit', data);

    return res.data;
};
export const fetchAllQuizSubmissions = async () => {
    const res = await axios.get("http://localhost:5000/api/quizSubmission/all");
    return res.data;
  };

  export const deleteQuizzesByIds = async (ids) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/quizSubmission/bulk-delete`,
        { data: { ids } }
      );
      return response.data; // Assuming the backend sends a success message
    } catch (error) {
      throw error; // Throw error to be caught in the component
    }
  };
  