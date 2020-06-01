import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // Don't include trailing backslash
  timeout: 1000,
});
