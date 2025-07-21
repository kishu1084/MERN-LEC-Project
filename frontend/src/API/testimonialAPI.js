import { API_URL } from "../utills";

export const createTestimonial = async ( Obj ) => {
    const url = `${API_URL}/testimonial`;
    const formData = new FormData();
    for(const key in Obj) {
        if(Obj[key]){
            formData.append(key,Obj[key]);
        }
    }

    const options = {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
    };

    try {
        const result = await fetch(url, options);

        if (!result.ok) {
            throw new Error(`HTTP Error! Status: ${result.status}`);
        }

        const data = await result.json();

        return data;
    } catch(err) {
        return { success: false, message: "Failed to create Testimonial"};
    }
}

export const GetAllTestimonials = async () => {
    const url = `${API_URL}/testimonial`;

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
        console.error("Error in Fetching All Testimonials:", err.message);
        return { success: false, message: "Failed to Fetch All Testimonials", error: err.message };
    }
    
};

export const DeleteTestimonialById = async (id) => {
    const url = `${API_URL}/testimonial/${id}`;

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
        console.error("Error in Delete Testimonial:", err);
        return { success: false, message: "Failed to Delete Testimonial" };
    }
};

export const UpdateestimonialById = async (id, TestimonialObj) => {
    const url = `${API_URL}/testimonial/${id}`;
    const formData = new FormData();

    for (const key in TestimonialObj) {
        if (TestimonialObj[key]) {
            formData.append(key, TestimonialObj[key]);
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
        console.error("Error in Updating Testimonial:", err);
        return { success: false, message: "Failed to Update Testimonial" };
    }
};