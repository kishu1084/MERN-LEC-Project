import { API_URL } from "../utills";

export const submitCourseEnrollment = async (enrollmentData) => {
    const url = `${API_URL}/courseEnrollment`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(enrollmentData),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error("Error submitting enrollment:", error.message);
        return { success: false, message: "Error submitting enrollment form", error: error.message };
    }
};



// Function to get all course enrollments
export const getAllCourseEnrollments = async () => {
    const url = `${API_URL}/courseEnrollment`; // Assuming your endpoint to get all enrollments

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        // Assuming result has a success field to indicate success
        if (result.success) {
            // Assuming result.data contains the grouped enrollments with status
            return { success: true, data: result.data };  // Return the grouped data
        } else {
            return { success: false, message: result.message || "Failed to fetch enrollments" };
        }
    } catch (error) {
        console.error("Error fetching enrollments:", error.message);
        return { success: false, message: "Error fetching course enrollments", error: error.message };
    }
};



// PUT request to update enrollment status
export const updateEnrollmentStatus = async (id, status) => {
    const url = `${API_URL}/courseEnrollment/${id}/status`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update status");
        }

        return { success: true, data: result.data };
    } catch (error) {
        console.error("Error updating status:", error.message);
        return { success: false, message: error.message };
    }
};



// DELETE Enrollment by ID
export const deleteEnrollment = async (id) => {
    const url = `${API_URL}/courseEnrollment/${id}`;
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete enrollment with ID ${id}`);
        }

        const result = await response.json(); // Parse the JSON response
        return result; // Return the result (success or error message)
    } catch (error) {
        console.error("Error deleting enrollment:", error.message);
        return { success: false, message: error.message };
    }
};

export const checkEnrollmentStatus = async (email, courseId) => {
    const response = await fetch(`${API_URL}/courseEnrollment/check?email=${email}&courseId=${courseId}`);
    return await response.json();
};



