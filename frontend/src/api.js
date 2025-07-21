import { API_URL } from "./utills";

export const createCourses = async (courseObj) => {
    
    const url = `${API_URL}/courses`;
    console.log(courseObj);
    // Convert courseObj to FormData
    const formData = new FormData();
    for (const key in courseObj) {
        if (courseObj[key]) {
            formData.append(key, courseObj[key]);
        }
    }

    const options = {
        method: "POST",
        body: formData, // Don't set 'Content-Type', it is auto-set for FormData
        headers: { "Accept": "application/json" }
    };

    try {
        const result = await fetch(url, options);

        if (!result.ok) {
            throw new Error(`HTTP Error! Status: ${result.status}`);
        }

        const data = await result.json();

        return data;
    } catch (err) {
        console.error("Error in createCourses:", err);
        return { success: false, message: "Failed to create course" };
    }
};


export const GetAllCourses = async () => {
    const url = `${API_URL}/courses`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error in Fetching All Courses:", err.message);
        return { success: false, message: "Failed to Fetch All Courses", error: err.message };
    }
};


export const DeleteCourseById = async (id) => {
    const url = `${API_URL}/courses/${id}`;

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",  // Ensure correct headers
        }
    };

    try {
        const result = await fetch(url, options);

        if (!result.ok) {
            throw new Error(`HTTP Error! Status: ${result.status}`);
        }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Error in Delete Course:", err);
        return { success: false, message: "Failed to Delete Course" };
    }
};

export const UpdateCourseById = async (id, courseObj) => {
    const url = `${API_URL}/courses/${id}`;
    const formData = new FormData();

    for (const key in courseObj) {
        if (courseObj[key]) {
            formData.append(key, courseObj[key]);
        }
    }

    const options = {
        method: "PUT",
        body: formData
    };

    try {
        const result = await fetch(url, options);

        if (!result.ok) {
            throw new Error(`HTTP Error! Status: ${result.status}`);
        }

        const data = await result.json();
        return data;
    } catch (err) {
        console.error("Error in Updating Course:", err);
        return { success: false, message: "Failed to Update Course" };
    }
};
