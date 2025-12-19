var config = {};

<<<<<<< HEAD
// Use environment variable first, then fallback to defaults
config.base_url = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? "https://stock-trading-mern-app.vercel.app"  // Update this with your backend URL
    : "http://localhost:5000");
=======
config.base_url = "http://localhost:5001";
>>>>>>> 441f0ff17047d4ab7f1f0185b7404fd4a7156a9d

export default config;
