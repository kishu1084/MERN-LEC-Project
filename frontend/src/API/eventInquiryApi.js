import { API_URL } from '../utills';
export const SendEventInquiry = async (inquiryData) => {
    
        const response = await fetch(`${API_URL}/event-inquiries`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inquiryData),
        });

        const data = await response.json(); // Always parse the JSON response

        if (!response.ok) {
            // Throw with message from backend if available
            const error = new Error(data.message || "Failed to submit inquiry");
            error.status = response.status; // attach status manually
            throw error;
        }

        return data;
    
};


// API for fetching all event inquiries
export const GetAllEventInquiries = async () => {
    try {
        const response = await fetch(`${API_URL}/event-inquiries`);
        if (!response.ok) throw new Error("Failed to fetch inquiries");

        const data = await response.json();
        return data;  // Return the list of all event inquiries
    } catch (error) {
        throw error;
    }
};

// API for updating an event inquiry
export const UpdateEventInquiry = async (inquiryId, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/event-inquiries/${inquiryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Failed to update inquiry");

        const data = await response.json();
        return data;  // Return updated inquiry data
    } catch (error) {
        throw error;
    }
};

// API for deleting an event inquiry
export const DeleteEventInquiry = async (inquiryId) => {
    try {
        const response = await fetch(`${API_URL}/event-inquiries/${inquiryId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete inquiry");

        const data = await response.json();
        return data;  // Return success message after deletion
    } catch (error) {
        throw error;
    }
};


