var config = {};
config.base_url = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://stock-trading-mern-app.vercel.app"  // Update this with your backend URL
    : "http://localhost:5001");

export default config;
