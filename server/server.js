const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require('http');
const WebSocket = require('ws');

// SETUP
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001","https://stock-trading-mern-app.vercel.app"],
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("secretcode"));

// DATABASE
const DB = process.env.MONGO_URI;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.error("Connection string (masked):", DB ? DB.replace(/\/\/[^:]+:[^@]+@/, "//***:***@") : "undefined");
  });

// ROUTES
const authRouter = require("./routes/authRoutes");
const dataRouter = require("./routes/dataRoutes");
const newsRouter = require("./routes/newsRoutes");
const stockRouter = require("./routes/stockRoutes");

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Initialize WebSocket server with ping-pong
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'  // Specify a path for WebSocket connections
});

// Broadcast function for WebSocket
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(data));
      } catch (error) {
        console.error('Broadcast error:', error);
      }
    }
  });
};

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`New WebSocket connection established from ${clientIP}`);
  console.log('Request headers:', req.headers);

  // Send initial data
  const initialData = {
    type: 'connection_established',
    message: 'Connected to WebSocket server'
  };
  ws.send(JSON.stringify(initialData));

  // Set up ping-pong to keep connection alive
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      // Handle different message types
      switch (data.type) {
        case 'subscribe_stock':
          // Handle stock subscription
          break;
        case 'subscribe_portfolio':
          // Handle portfolio subscription
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Message handling error:', error);
    }
  });

  // Handle client disconnection
  ws.on('close', (code, reason) => {
    const reasonStr = reason ? reason.toString() : '';
    console.log(`Client disconnected with code: ${code}, reason: ${reasonStr}`);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Ping all clients every 60 seconds
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log('Terminating inactive connection');
      return ws.terminate();
    }
    ws.isAlive = false;
    console.log('Sending ping to client');
    ws.ping();
  });
}, 60000);

// Clean up on server close
wss.on('close', () => {
  console.log('WebSocket server closed');
  clearInterval(interval);
});

// Example: Send random stock price every second via WebSocket
setInterval(() => {
  const stockData = {
    type: 'stock_update',
    data: {
      symbol: 'AAPL',
      price: (100 + Math.random() * 50).toFixed(2),
      time: new Date().toISOString()
    }
  };
  broadcast(stockData);
}, 1000);

// Example: Send portfolio updates every 5 seconds
setInterval(() => {
  const portfolioData = {
    type: 'portfolio_update',
    data: {
      totalValue: (10000 + Math.random() * 1000).toFixed(2),
      holdings: [
        { symbol: 'AAPL', shares: 10, price: (150 + Math.random() * 10).toFixed(2) },
        { symbol: 'GOOGL', shares: 5, price: (2800 + Math.random() * 50).toFixed(2) }
      ],
      time: new Date().toISOString()
    }
  };
  broadcast(portfolioData);
}, 5000);

// Example: Send random notifications
setInterval(() => {
  const notifications = [
    'Stock AAPL is up 5%',
    'Market volatility alert',
    'New trading opportunity detected',
    'Portfolio rebalancing recommended'
  ];
  const notification = {
    type: 'notification',
    message: notifications[Math.floor(Math.random() * notifications.length)],
    timestamp: new Date().toISOString()
  };
  broadcast(notification);
}, 10000);

// Polling endpoint for stock data
app.get('/api/stock/price', (req, res) => {
  const symbol = req.query.symbol || 'AAPL';
  const stockData = {
    symbol,
    price: (100 + Math.random() * 50).toFixed(2),
    time: new Date().toISOString()
  };
  res.json(stockData);
});

// SSE endpoint for stock data
app.get('/api/stream/stock', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  const sendStock = () => {
    const stockData = {
      symbol: 'AAPL',
      price: (100 + Math.random() * 50).toFixed(2),
      time: new Date().toISOString()
    };
    res.write(`data: ${JSON.stringify(stockData)}\n\n`);
  };

  const interval = setInterval(sendStock, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/data", dataRouter);
app.use("/api/news", newsRouter);
app.use("/api/stock", stockRouter);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname + "/../client/build/index.html"));
//   });
// }

// Replace app.listen with server.listen
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
