import { API_URL } from "../utills";

export const createNews = async (newsObj) => {
    
    const url = `${API_URL}/news`;
    console.log(newsObj);
    // Convert newsObj to FormData
    const formData = new FormData();
    for (const key in newsObj) {
        if (newsObj[key]) {
            formData.append(key, newsObj[key]);
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
        console.error("Error in createNews:", err);
        return { success: false, message: "Failed to create news" };
    }
};


export const GetAllNews = async () => {
    const url = `${API_URL}/news`;

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
        console.error("Error in Fetching All News:", err.message);
        return { success: false, message: "Failed to Fetch All News", error: err.message };
    }
};


export const DeleteNewsById = async (id) => {
    const url = `${API_URL}/news/${id}`;

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
        console.error("Error in Delete News:", err);
        return { success: false, message: "Failed to Delete News" };
    }
};

export const UpdateNewsById = async (id, newsObj) => {
    const url = `${API_URL}/news/${id}`;
    const formData = new FormData();

    for (const key in newsObj) {
        if (newsObj[key]) {
            formData.append(key, newsObj[key]);
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
        console.error("Error in Updating News:", err);
        return { success: false, message: "Failed to Update News" };
    }
};
