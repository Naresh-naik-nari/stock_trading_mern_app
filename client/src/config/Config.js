var config = {};

// Use environment variable first, then fallback to defaults
config.base_url = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://stock-trading-backend.onrender.com"  // Your Render backend URL
    : "http://localhost:5001");

console.log('API Base URL:', config.base_url);
console.log('Environment:', process.env.NODE_ENV);

export default config;
