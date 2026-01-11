import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add request interceptor to log
axios.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`, {
      withCredentials: config.withCredentials,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log
axios.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.config.method.toUpperCase()} ${response.config.url} (${response.status})`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`, error.response.data);
    } else {
      console.error('❌ Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axios;
