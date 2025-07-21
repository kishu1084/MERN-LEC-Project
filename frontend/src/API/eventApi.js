import { API_URL } from "../utills";

export const createEvent = async (eventObj) => {
    const url = `${API_URL}/events`;
    const formData = new FormData();
    for(const key in eventObj) {
        if(eventObj[key]){
            formData.append(key,eventObj[key]);
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
        console.error("Error in createEvent:", err);
        return { success: false, message: "Failed to create event" };
    }
}

export const GetAllEvents = async () => {
    const url = `${API_URL}/events`;

    const options = {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
        }
    };

    try {
        const response = await fetch(url, options);

        if(!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error in Fetching All Events:", err.message);
        return { success: false, message: "Failed to Fetch All Events", error: err.message };
    }
    
};

export const DeleteEventById = async (id) => {
    const url = `${API_URL}/events/${id}`;

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
        console.error("Error in Delete Event:", err);
        return { success: false, message: "Failed to Delete Event" };
    }
};

export const UpdateEventById = async (id, eventObj) => {
    const url = `${API_URL}/events/${id}`;
    const formData = new FormData();

    for (const key in eventObj) {
        if (eventObj[key]) {
            formData.append(key, eventObj[key]);
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
        console.error("Error in Updating Event:", err);
        return { success: false, message: "Failed to Update Event" };
    }
};