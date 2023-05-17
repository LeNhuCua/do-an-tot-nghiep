import axios from "axios";
import {API} from "./API.js";

const axiosClient = axios.create({
  baseURL: `${API}/api`
})

axiosClient.interceptors.request.use((config) => {
  const tokenCustomer = localStorage.getItem('ACCESS_TOKEN_CUSTOMER');
  config.headers.Authorization = `Bearer ${tokenCustomer}`
  // config.headers.Accept = 'Access-Control-Allow-Origin'
  // config.headers['Access-Control-Allow-Origin'] = '*';
  return config;
})

axiosClient.interceptors.response.use((response) => {
  return response
}, (error) => {
  const {response} = error;
  if (response.status === 401) {
    localStorage.removeItem('ACCESS_TOKEN_CUSTOMER')
    // window.location.reload();
  } else if (response.status === 404) {
    //Show not found
  }

  throw error;
})

export default axiosClient
