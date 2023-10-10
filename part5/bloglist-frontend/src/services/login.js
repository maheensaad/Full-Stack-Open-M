import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
  } catch (error) {
    // Handle the error here
    if (error.response) {
      // The request was made, but the server responded with an error status
      console.error('Request failed with status code:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('Request made but no response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up the request:', error.message);
    }
    throw error; // Re-throw the error to be caught by the caller
  }
};


export default { login }