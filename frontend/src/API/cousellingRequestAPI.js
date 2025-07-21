import { API_URL } from "../utills";

// export const submitCounselingInquiry = async (formData) => {
//     try {
//         const response = await fetch(`${API_URL}/counseling`, formData);
//         console.log(response);
//         return response.data; // return the data for further handling if needed
//     } catch (error) {
//         throw error; // propagate error for caller to handle
//     }
// };

export const submitCounselingInquiry = async (inquiryData) => {
    try {
        const response = await fetch(`${API_URL}/counseling`, {
            method: "POST",  // HTTP method for creating a resource
            headers: {
                "Content-Type": "application/json",  // Ensure the request body is JSON
            },
            body: JSON.stringify(inquiryData),  // Convert the inquiry data to a JSON string
        });

        if (!response.ok) throw new Error("Failed to submit inquiry");

        const data = await response.json();  // Parse the JSON response
        return data;  // Return the backend response (success message and the saved inquiry)
    } catch (error) {
        throw error;  // Throw any error that occurs
    }
};


export const fetchInquiries = async () => {
    try {
        const response = await fetch(`${API_URL}/counseling`);
        if (!response.ok) throw new Error("Failed to fetch inquiries");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteInquiry = async (id) => {
    try {
        const response = await fetch(`${API_URL}/counseling/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete inquiry");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateInquiryStatus = async (id, newStatus) => {
    try {
        const response = await fetch(`${API_URL}/counseling/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Failed to update status");
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const checkCounselingStatus = async (email) => {
    const response = await fetch(`${API_URL}/counseling/check?email=${email}`);
    return await response.json();
}