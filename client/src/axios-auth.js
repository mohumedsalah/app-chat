import axios from 'axios';

const URI =
  process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8000';

const AxiosInstance = axios.create({
  baseURL: URI
});

export const setAuthToken = token => {
  if (token) {
    // this apply to every request
    AxiosInstance.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default AxiosInstance;
