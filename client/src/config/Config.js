var config = {};

// Use your deployed backend URL
config.base_url = process.env.REACT_APP_API_URL || "https://stock-trading-mern-app.onrender.com";

console.log('API Base URL:', config.base_url);
console.log('Environment:', process.env.NODE_ENV);

export default config;
