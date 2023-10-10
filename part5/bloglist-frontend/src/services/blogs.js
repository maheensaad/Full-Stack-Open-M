import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newBlog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.post(baseUrl, newBlog, config);
    return response.data; // Include the user data in the response
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

const update = async (id, updatedBlog) => {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export default { setToken, getAll, create, update };