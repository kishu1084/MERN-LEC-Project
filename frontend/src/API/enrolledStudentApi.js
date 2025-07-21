import { API_URL } from "../utills";

export const GetAllEnrolledStudent = async () => {
    const url = `${API_URL}/enrolledstudents`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Data of Enrolled student : ",data);
        return data;
    } catch (err) {
        console.error("Error in Fetching All EnrolledStudent:", err.message);
        return { success: false, message: "Failed to Fetch All EnrolledStudent", error: err.message };
    }
};

export const updateEnrolledStudent = async (studentId, updateData) => {
    const url = `${API_URL}/enrolledstudents/${studentId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return { success: true, data: data.data };
    } catch (error) {
        console.error("Error updating enrolled student:", error.message);
        return { success: false, message: error.message };
    }
};
