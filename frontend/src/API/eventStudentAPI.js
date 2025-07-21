import { API_URL } from "../utills";

// Get all registered students
export const GetAllRegisteredStudents = async () => {
    const url = `${API_URL}/eventregisterstudents`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Registered Students:", data);
        return data;
    } catch (error) {
        console.error("Error Fetching Registered Students:", error.message);
        return { success: false, message: "Failed to fetch registered students", error: error.message };
    }
};

// Update event status
export const UpdateRegisteredStudentStatus = async (studentId, eventId, status, paymentStatus, fees) => {
    const url = `${API_URL}/eventregisterstudents/update-status/${studentId}/${eventId}`;

    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, paymentStatus, fees }),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Updated Student Event Status:", data);
        return data;
    } catch (error) {
        console.error("Error Updating Student Event Status:", error.message);
        return { success: false, message: "Failed to update event status", error: error.message };
    }
};

// Delete a registered student
export const DeleteRegisteredStudent = async (id) => {
    const url = `${API_URL}/eventregisterstudents/${id}`;

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Deleted Registered Student:", data);
        return data;
    } catch (error) {
        console.error("Error Deleting Registered Student:", error.message);
        return { success: false, message: "Failed to delete registered student", error: error.message };
    }
};

// Delete a particular event for a student
export const DeleteParticularEventForStudent = async (studentId, eventId) => {
    const url = `${API_URL}/eventregisterstudents/${studentId}/events/${eventId}`;

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Deleted Particular Event for Student:", data);
        return data;
    } catch (error) {
        console.error("Error Deleting Particular Event:", error.message);
        return { success: false, message: "Failed to delete particular event", error: error.message };
    }
};

// Update student status
export const UpdateStudentStatus = async (studentId, status) => {
  const url = `${API_URL}/eventregisterstudents/update-status/${studentId}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
  });

      if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      const data = await response.json();
      return { success: true, data: data.data };
  } catch (error) {
      console.error("Error Updating Student Status:", error.message);
      return { success: false, message: "Failed to update student status", error: error.message };
  }
};