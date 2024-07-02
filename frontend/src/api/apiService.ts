import axios from 'axios';

// import dotenv from 'dotenv';

// dotenv.config();
const API_BASE_URL =import.meta.env.VITE_APP_API_BASE_URL_LIVE;
console.log(API_BASE_URL);

export const generateCaptions = async (image:any, vibe:string) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('vibe', vibe);

  const response = await axios.post(`${API_BASE_URL}/generate-caption`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(response.data,"response");
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An unexpected error occurred');
    }
  };
  
  export const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
      throw new Error('An unexpected error occurred');
    }
  };