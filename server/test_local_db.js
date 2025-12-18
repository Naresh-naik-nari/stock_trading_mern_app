const mongoose = require('mongoose');
const uri = "mongodb://127.0.0.1:27017/stock_trading_app";
mongoose.connect(uri)
    .then(() => { console.log("Local DB Connected"); process.exit(0); })
    .catch(err => { console.error("Local DB Failed", err.code); process.exit(1); });
