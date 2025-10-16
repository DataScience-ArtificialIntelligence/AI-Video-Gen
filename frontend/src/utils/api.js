
import axios from "axios";

export const generateSlides = async ({ topic, slideCount, contentStyle, includeImages }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/generate", {
      topic,
      slideCount,
      contentStyle,
      includeImages,
    }, {
      timeout: 60000, // 60 second timeout
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.data || !res.data.slides) {
      throw new Error("Invalid response format from server");
    }
    
    return res.data.slides;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data?.error || "Server error occurred");
    } else if (error.request) {
      // No response received
      throw new Error("No response from server. Please check if the backend is running.");
    } else {
      // Other errors
      throw new Error(error.message || "Failed to generate slides");
    }
  }
};
