import axios from "axios";

const BASE_URL = "https://api.unsplash.com";
const ACCESS_KEY = "H-hlgg3zmmFh7kXw1G8VW3FzApspRP5Li2wA-dN4HJQ";

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
});

// Fetch photos implemenation
export const fetchPhotos = async (page = 1, perPage = 6) => {
  try {
    const response = await apiService.get("/photos", {
      params: { page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

// Fetch search implementation
export const searchPhotos = async (query, page = 1, perPage = 6) => {
  try {
    const response = await apiService.get("/search/photos", {
      params: { query, page, per_page: perPage },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching photos:", error);
    return [];
  }
};
