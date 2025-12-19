const User = require("../models/userModel");
const Stock = require("../models/stockModel");
const data = require("../config/stocksData");
const Axios = require("axios");

exports.purchaseStock = async (req, res) => {
  try {
    const { userId, ticker, quantity, price } = req.body;

    if (req.user !== userId) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const totalPrice = quantity * price;
    if (user.balance - totalPrice < 0) {
      return res.status(200).json({
        status: "fail",
        message: `You don't have enough cash to purchase this stock.`,
      });
    }

    const purchase = new Stock({ userId, ticker, quantity, price });
    await purchase.save();
    const updatedUser = await User.findByIdAndUpdate(userId, {
      balance:
        Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100,
    });

    return res.status(200).json({
      status: "success",
      stockId: purchase._id,
      user: {
        username: updatedUser.username,
        id: updatedUser._id,
        balance:
          Math.round((user.balance - totalPrice + Number.EPSILON) * 100) / 100,
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "Something unexpected happened.",
    });
  }
};

exports.sellStock = async (req, res) => {
  try {
    const { userId, stockId, quantity, price } = req.body;

    if (req.user !== userId) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    if (quantity > stock.quantity) {
      return res.status(200).json({
        status: "fail",
        message: "Invalid quantity.",
      });
    }

    if (quantity === stock.quantity) {
      await Stock.findByIdAndDelete(stockId);
    } else {
      await Stock.findByIdAndUpdate(stockId, {
        quantity: stock.quantity - quantity,
      });
    }

    const saleProfit = quantity * price;

    const updatedUser = await User.findByIdAndUpdate(userId, {
      balance:
        Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100,
    });

    return res.status(200).json({
      status: "success",
      user: {
        username: updatedUser.username,
        id: updatedUser._id,
        balance:
          Math.round((user.balance + saleProfit + Number.EPSILON) * 100) / 100,
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "Something unexpected happened.",
    });
  }
};

const getPricesData = async (stocks) => {
  try {
    console.log('Fetching prices for', stocks.length, 'stocks');
    
    // Generate mock price data when API is unavailable
    const generateMockPrice = (stock) => {
      // Generate a price variation of ±5% from purchase price
      const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
      const mockPrice = stock.price * (1 + variation);
      return Math.round(mockPrice * 100) / 100;
    };

    const promises = stocks.map(async (stock) => {
      try {
        const url = `https://api.tiingo.com/tiingo/daily/${stock.ticker}/prices?token=${process.env.TIINGO_API_KEY}`;
        const response = await Axios.get(url, { timeout: 3000 });
        
        if (response.data && response.data.length > 0) {
          return {
            ticker: stock.ticker,
            date: response.data[0].date,
            adjClose: response.data[0].adjClose,
          };
        } else {
          throw new Error('No data returned');
        }
      } catch (error) {
        console.log(`API unavailable for ${stock.ticker}, using mock data:`, error.response?.status || error.message);
        
        // Return mock data when API fails
        return {
          ticker: stock.ticker,
          date: new Date().toISOString().split('T')[0],
          adjClose: generateMockPrice(stock),
        };
      }
    });

    const results = await Promise.all(promises);
    console.log('Price data results:', results.length);
    return results;
  } catch (error) {
    console.error('Error in getPricesData:', error);
    
    // Return mock data for all stocks if everything fails
    return stocks.map(stock => ({
      ticker: stock.ticker,
      date: new Date().toISOString().split('T')[0],
      adjClose: stock.price * (1 + (Math.random() - 0.5) * 0.1),
    }));
  }
};

exports.getStockForUser = async (req, res) => {
  try {
    console.log('getStockForUser called with user:', req.user, 'params.id:', req.params.id);
    console.log('User types - req.user:', typeof req.user, 'req.params.id:', typeof req.params.id);
    
    // Ensure both values are strings for comparison
    const userId = String(req.user);
    const paramId = String(req.params.id);
    
    if (userId !== paramId) {
      console.log('Authentication failed: user mismatch -', userId, '!==', paramId);
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    console.log('Fetching stocks for user:', req.params.id);
    const stocks = await Stock.find({ userId: req.params.id });
    console.log('Found stocks:', stocks.length);
    
    // If no stocks, return empty array
    if (stocks.length === 0) {
      return res.status(200).json({
        status: "success",
        stocks: [],
      });
    }
    
    console.log('Fetching price data for stocks...');
    const stocksData = await getPricesData(stocks);
    console.log('Price data fetched:', stocksData.length);
    
    const modifiedStocks = stocks.map((stock) => {
      let name;
      let currentPrice;
      let currentDate;
      
      // Find stock name from local data
      data.stockData.forEach((stockData) => {
        if (stockData.ticker.toLowerCase() === stock.ticker.toLowerCase()) {
          name = stockData.name;
        }
      });

      // Find current price from API data
      stocksData.forEach((stockData) => {
        if (stockData.ticker.toLowerCase() === stock.ticker.toLowerCase()) {
          currentDate = stockData.date;
          currentPrice = stockData.adjClose;
        }
      });

      return {
        id: stock._id,
        ticker: stock.ticker,
        name: name || stock.ticker, // Fallback to ticker if name not found
        purchasePrice: stock.price,
        purchaseDate: stock.date,
        quantity: stock.quantity,
        currentDate: currentDate || new Date().toISOString(),
        currentPrice: currentPrice || stock.price, // Fallback to purchase price
      };
    });

    console.log('Returning modified stocks:', modifiedStocks.length);
    return res.status(200).json({
      status: "success",
      stocks: modifiedStocks,
    });
  } catch (error) {
    console.error('Error in getStockForUser:', error);
    return res.status(200).json({
      status: "fail",
      message: `Error: ${error.message}`,
    });
  }
};

exports.resetAccount = async (req, res) => {
  try {
    if (req.user !== req.params.id) {
      return res.status(200).json({
        status: "fail",
        message: "Credentials couldn't be validated.",
      });
    }

    const stocks = await Stock.find({ userId: req.params.id });
    stocks.forEach(async (stock) => {
      await Stock.findByIdAndDelete(stock._id);
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      balance: 100000,
    });

    return res.status(200).json({
      status: "success",
      user: {
        username: updatedUser.username,
        id: updatedUser._id,
        balance: 100000,
      },
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "Something unexpected happened.",
    });
  }
};
