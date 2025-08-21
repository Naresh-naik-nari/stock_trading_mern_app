import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Collapse,
  Fade,
  Zoom,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {
  Send as SendIcon,
  ChatBubble as ChatIcon,
  Close as CloseIcon,
  Android as BotIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalOffer as SellIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  EmojiObjectsOutlined as PsychologyIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Minimize as MinimizeIcon,
  ExpandMore as ExpandIcon,
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  ShowChart as ChartIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import UserContext from "../../context/UserContext";
import config from "../../config/Config";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 380,
    height: 550,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease-in-out',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
      height: '70vh',
      bottom: 10,
      right: 10,
      left: 10,
    },
    '&:hover': {
      boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
    }
  },
  chatHeader: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '12px 12px 0 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  chatBody: {
    flex: 1,
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#c1c1c1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#a8a8a8',
    },
  },
  chatFooter: {
    padding: theme.spacing(2),
    backgroundColor: 'white',
    display: 'flex',
    gap: theme.spacing(1),
    borderRadius: '0 0 12px 12px',
    borderTop: '1px solid #e0e0e0',
  },
  messageContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
    animation: '$slideIn 0.3s ease-out',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    padding: theme.spacing(1.5, 2),
    borderRadius: 20,
    maxWidth: '85%',
    wordWrap: 'break-word',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  userBubble: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    marginLeft: 'auto',
  },
  botBubble: {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
    marginRight: 'auto',
  },
  messageTimestamp: {
    fontSize: '0.7rem',
    opacity: 0.7,
    marginTop: theme.spacing(0.5),
    textAlign: 'right',
  },
  chatToggle: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    zIndex: 1001,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
    },
    transition: 'all 0.3s ease',
  },
  suggestedActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  quickActionChip: {
    margin: theme.spacing(0.5),
    '&:hover': {
      transform: 'scale(1.05)',
      transition: 'transform 0.2s ease',
    },
  },
  welcomeCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    border: '1px solid #e0e0e0',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    backgroundColor: 'white',
    borderRadius: 20,
    border: '1px solid #e0e0e0',
    maxWidth: 'fit-content',
    marginBottom: theme.spacing(1.5),
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#999',
    animation: '$typing 1.4s infinite ease-in-out',
    '&:nth-child(1)': { animationDelay: '-0.32s' },
    '&:nth-child(2)': { animationDelay: '-0.16s' },
  },
  featureList: {
    marginTop: theme.spacing(1),
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  '@keyframes slideIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes typing': {
    '0%, 60%, 100%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '30%': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
  },
  minimized: {
    height: '60px',
    overflow: 'hidden',
  },
  expandButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1002,
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export default function Chatbot() {
  const classes = useStyles();
  const { userData } = useContext(UserContext);
  const [messages, setMessages] = useState([
    { 
      user: 'Bot', 
      text: 'Hello! I\'m your AI Trading Assistant. I can help you with portfolio management, market analysis, trading strategies, and more!',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    stockPrices: {},
    portfolioValue: null,
    marketTrends: {},
    lastUpdate: null
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const quickActions = [
    { label: "Portfolio Analysis", icon: <AccountBalanceIcon />, action: "analyze portfolio" },
    { label: "Market Trends", icon: <TrendingUpIcon />, action: "market trends" },
    { label: "Buy Stocks", icon: <ShoppingCartIcon />, action: "how to buy stocks" },
    { label: "Sell Strategy", icon: <SellIcon />, action: "selling strategy" },
    { label: "Risk Management", icon: <WarningIcon />, action: "risk management tips" },
    { label: "Trading Tips", icon: <PsychologyIcon />, action: "trading psychology" },
    { label: "Education", icon: <SchoolIcon />, action: "trading education" },
    { label: "Market News", icon: <NotificationsIcon />, action: "latest market news" },
  ];

  // WebSocket connection setup
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const wsUrl = config.base_url.replace('http', 'ws') + '/ws';
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        // Subscribe to real-time updates
        wsRef.current.send(JSON.stringify({
          type: 'subscribe_stock',
          symbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    }
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    switch (data.type) {
      case 'stock_update':
        setRealTimeData(prev => ({
          ...prev,
          stockPrices: {
            ...prev.stockPrices,
            [data.data.symbol]: {
              price: data.data.price,
              timestamp: data.data.time
            }
          },
          lastUpdate: new Date()
        }));
        break;
      case 'portfolio_update':
        setRealTimeData(prev => ({
          ...prev,
          portfolioValue: data.data.totalValue,
          lastUpdate: new Date()
        }));
        break;
      case 'notification':
        if (!isOpen) {
          setNotificationCount(prev => prev + 1);
        }
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }, [isOpen]);

  // Fetch real-time stock data via API
  const fetchStockData = useCallback(async (symbol) => {
    setIsLoadingData(true);
    try {
      const response = await Axios.get(`${config.base_url}/api/stock/price?symbol=${symbol}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return null;
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch portfolio data
  const fetchPortfolioData = useCallback(async () => {
    if (!userData?.user?.id || !userData?.token) return null;
    
    setIsLoadingData(true);
    try {
      const response = await Axios.get(
        `${config.base_url}/api/stock/adduser/${userData.user.id}`,
        {
          headers: {
            "x-auth-token": userData.token,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      return null;
    } finally {
      setIsLoadingData(false);
    }
  }, [userData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && notificationCount > 0) {
      setNotificationCount(0);
    }
  }, [isOpen, notificationCount]);

  // Initialize WebSocket connection when component mounts
  useEffect(() => {
    if (userData?.token) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userData?.token, connectWebSocket]);

  const getBotResponse = async (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for specific stock symbols
    const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA'];
    const mentionedStock = stockSymbols.find(symbol => 
      input.includes(symbol.toLowerCase()) || input.includes(symbol)
    );

    // Real-time stock price query
    if (mentionedStock || input.includes('price') || input.includes('stock price')) {
      const symbol = mentionedStock || 'AAPL';
      const stockData = realTimeData.stockPrices[symbol];
      
      if (stockData) {
        const timeAgo = realTimeData.lastUpdate ? 
          Math.floor((new Date() - realTimeData.lastUpdate) / 1000) : 'unknown';
        return {
          text: `📈 Real-time ${symbol} Data:\n\n💰 Current Price: $${stockData.price}\n⏰ Last Updated: ${timeAgo}s ago\n${isConnected ? '🟢 Live data connected' : '🔴 Offline mode'}\n\n💡 This data updates in real-time via WebSocket connection!`,
          type: 'stock_data',
          requiresApi: false
        };
      } else {
        return {
          text: `🔍 Fetching real-time data for ${symbol}...\n\n📊 Please wait while I get the latest market information.`,
          type: 'stock_data',
          requiresApi: true,
          symbol: symbol
        };
      }
    }

    // Portfolio analysis with real-time data
    if (input.includes('portfolio') || input.includes('balance') || input.includes('analyze')) {
      const portfolioValue = realTimeData.portfolioValue;
      const cashBalance = userData?.user?.balance;
      
      let portfolioText = `📊 Your Portfolio Analysis:\n\n`;
      
      if (cashBalance) {
        portfolioText += `💰 Cash Balance: $${cashBalance.toLocaleString()}\n`;
      }
      
      if (portfolioValue) {
        portfolioText += `📈 Portfolio Value: $${parseFloat(portfolioValue).toLocaleString()}\n`;
        portfolioText += `⏰ Last Update: ${realTimeData.lastUpdate ? 
          realTimeData.lastUpdate.toLocaleTimeString() : 'Not available'}\n`;
      }
      
      portfolioText += `\n💡 Tips:\n• Diversify across different sectors\n• Monitor your positions regularly\n• Consider rebalancing quarterly\n\n${isConnected ? '🟢 Real-time updates active' : '🔴 Connect for live updates'}`;
      
      return {
        text: portfolioText,
        type: 'analysis',
        requiresApi: !portfolioValue
      };
    }

    // Market trends with real-time data
    if (input.includes('market') || input.includes('trend')) {
      const stockPrices = realTimeData.stockPrices;
      let marketText = `📊 Current Market Analysis:\n\n`;
      
      if (Object.keys(stockPrices).length > 0) {
        marketText += `📈 Live Stock Prices:\n`;
        Object.entries(stockPrices).forEach(([symbol, data]) => {
          marketText += `• ${symbol}: $${data.price}\n`;
        });
        marketText += `\n⏰ Last Update: ${realTimeData.lastUpdate ? 
          realTimeData.lastUpdate.toLocaleTimeString() : 'Not available'}\n\n`;
      }
      
      marketText += `💡 Market Insights:\n• Check the charts section for technical analysis\n• Stay updated with the news feed\n• Research before making decisions\n\n🔍 Pro tip: Look for patterns in volume and price movements`;
      
      return {
        text: marketText,
        type: 'market'
      };
    }

    // Connection status
    if (input.includes('connection') || input.includes('status') || input.includes('connected')) {
      return {
        text: `🔌 Connection Status:\n\n${isConnected ? '🟢 WebSocket Connected' : '🔴 WebSocket Disconnected'}\n📊 Real-time data: ${isConnected ? 'Active' : 'Inactive'}\n⏰ Last update: ${realTimeData.lastUpdate ? realTimeData.lastUpdate.toLocaleTimeString() : 'None'}\n\n${isConnected ? '✅ You\'re receiving live market data!' : '⚠️ Reconnecting to live data...'}`,
        type: 'status'
      };
    }

    // Standard responses
    if (input.includes('buy') || input.includes('purchase')) {
      return {
        text: `🛒 How to buy stocks:\n\n1️⃣ Search for stocks using the search bar\n2️⃣ Review the stock's performance and charts\n3️⃣ Click "Buy" and enter quantity\n4️⃣ Confirm your purchase\n\n⚠️ Remember: Only invest what you can afford to lose!\n\n💡 Use real-time data to make informed decisions!`,
        type: 'instruction'
      };
    }
    
    if (input.includes('sell') || input.includes('strategy')) {
      return {
        text: `📈 Selling Strategy Tips:\n\n🎯 Set profit targets (e.g., 20% gain)\n🛑 Use stop-loss orders to limit losses\n📊 Monitor technical indicators\n⏰ Don't let emotions drive decisions\n\n💡 Consider selling when:\n• Stock reaches your target price\n• Fundamentals change significantly\n• You need to rebalance your portfolio\n\n📊 Use our real-time data for timing!`,
        type: 'strategy'
      };
    }
    
    if (input.includes('risk')) {
      return {
        text: `🛡️ Risk Management Essentials:\n\n💰 Never invest more than you can afford to lose\n📊 Diversify across multiple stocks and sectors\n⏰ Set clear entry and exit points\n📈 Use stop-loss orders\n💵 Keep some cash for opportunities\n\n🎯 Remember: Preservation of capital is key!\n\n📊 Monitor risk with our real-time portfolio tracking!`,
        type: 'risk'
      };
    }
    
    if (input.includes('psychology')) {
      return {
        text: `🧠 Trading Psychology Tips:\n\n😤 Control your emotions - fear and greed are your enemies\n📋 Stick to your trading plan\n⏰ Don't chase losses or overtrade\n📈 Celebrate small wins, learn from losses\n💪 Build confidence through education and practice\n\n🎯 Success comes from discipline, not luck!`,
        type: 'psychology'
      };
    }
    
    if (input.includes('education') || input.includes('learn')) {
      return {
        text: `📚 Trading Education Resources:\n\n📖 Start with the basics: P/E ratios, market cap, volume\n📊 Learn technical analysis: charts, indicators, patterns\n📰 Follow financial news and market updates\n🎓 Practice with paper trading first\n💬 Join trading communities and forums\n\n🚀 Knowledge is your best investment!`,
        type: 'education'
      };
    }
    
    if (input.includes('news')) {
      return {
        text: `📰 Stay informed with:\n\n📺 Check the News section for latest updates\n📊 Monitor earnings reports and economic data\n🌍 Follow global market trends\n💼 Watch for sector-specific news\n⏰ Set up alerts for your holdings\n\n📈 Information is power in trading!`,
        type: 'news'
      };
    }
    
    if (input.includes('help')) {
      return {
        text: `🤖 I can help you with:\n\n📊 Real-time portfolio analysis\n💰 Live stock prices and data\n📈 Market trends and analysis\n🛡️ Risk management techniques\n🧠 Trading psychology tips\n📚 Educational resources\n📰 Market news and updates\n🔌 Connection status\n\n💡 Try asking: "What's AAPL price?" or "Analyze my portfolio"`,
        type: 'help'
      };
    }
    
    if (input.includes('hello') || input.includes('hi')) {
      return {
        text: `Hello! 👋 Ready to make some smart investment decisions today?\n\n🚀 I'm your AI Trading Assistant with real-time market data!\n${isConnected ? '🟢 Live data connection active' : '🔴 Connecting to live data...'}\n\n💡 Ask me about stock prices, portfolio analysis, or market trends!`,
        type: 'greeting'
      };
    }
    
    return {
      text: `🤔 I understand you're asking about "${userInput}".\n\nHere are some topics I can help with:\n\n📊 Real-time stock prices (try "AAPL price")\n💰 Portfolio analysis and management\n📈 Market trends and analysis\n🛡️ Risk management\n🧠 Trading psychology\n📚 Educational resources\n\n💡 Try asking about specific stocks or say "help" for more options!`,
      type: 'general'
    };
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { 
        user: 'You', 
        text: input,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      const currentInput = input;
      setInput("");
      
      try {
        // Get bot response (now async)
        const response = await getBotResponse(currentInput);
        
        // If response requires API call and we don't have real-time data
        if (response.requiresApi) {
          let apiResponse = null;
          
          if (response.symbol) {
            // Fetch specific stock data
            apiResponse = await fetchStockData(response.symbol);
          } else if (response.type === 'analysis') {
            // Fetch portfolio data
            apiResponse = await fetchPortfolioData();
          }
          
          // Update response with API data
          if (apiResponse) {
            let updatedText = response.text;
            
            if (response.symbol && apiResponse.price) {
              updatedText = `📈 Real-time ${response.symbol} Data:\n\n💰 Current Price: $${apiResponse.price}\n⏰ Updated: ${new Date(apiResponse.time).toLocaleTimeString()}\n🔄 Fetched via API\n\n💡 This data was fetched in real-time for you!`;
            } else if (response.type === 'analysis' && apiResponse) {
              updatedText += `\n\n📊 Fresh portfolio data loaded!`;
            }
            
            response.text = updatedText;
          }
        }
        
        // Add delay for more natural conversation feel
        const delay = 800 + Math.random() * 800; // 0.8-1.6 seconds
        setTimeout(() => {
          const botResponse = { 
            user: 'Bot', 
            text: response.text,
            timestamp: new Date(),
            type: response.type
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, delay);
        
      } catch (error) {
        console.error('Error getting bot response:', error);
        
        // Fallback error response
        setTimeout(() => {
          const errorResponse = { 
            user: 'Bot', 
            text: `⚠️ Sorry, I encountered an error processing your request. Please try again or check your connection.\n\n🔄 Connection status: ${isConnected ? 'Connected' : 'Disconnected'}`,
            timestamp: new Date(),
            type: 'error'
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsTyping(false);
        }, 1000);
      }
    }
  };

  const handleQuickAction = async (action) => {
    if (action.trim()) {
      const userMessage = { 
        user: 'You', 
        text: action,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      
      try {
        // Get bot response (now async)
        const response = await getBotResponse(action);
        
        // If response requires API call and we don't have real-time data
        if (response.requiresApi) {
          let apiResponse = null;
          
          if (response.symbol) {
            // Fetch specific stock data
            apiResponse = await fetchStockData(response.symbol);
          } else if (response.type === 'analysis') {
            // Fetch portfolio data
            apiResponse = await fetchPortfolioData();
          }
          
          // Update response with API data
          if (apiResponse) {
            let updatedText = response.text;
            
            if (response.symbol && apiResponse.price) {
              updatedText = `📈 Real-time ${response.symbol} Data:\n\n💰 Current Price: $${apiResponse.price}\n⏰ Updated: ${new Date(apiResponse.time).toLocaleTimeString()}\n🔄 Fetched via API\n\n💡 This data was fetched in real-time for you!`;
            } else if (response.type === 'analysis' && apiResponse) {
              updatedText += `\n\n📊 Fresh portfolio data loaded!`;
            }
            
            response.text = updatedText;
          }
        }
        
        // Add delay for more natural conversation feel
        const delay = 800 + Math.random() * 800;
        setTimeout(() => {
          const botResponse = { 
            user: 'Bot', 
            text: response.text,
            timestamp: new Date(),
            type: response.type
          };
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
        }, delay);
        
      } catch (error) {
        console.error('Error in quick action:', error);
        
        setTimeout(() => {
          const errorResponse = { 
            user: 'Bot', 
            text: `⚠️ Sorry, I encountered an error processing "${action}". Please try again.`,
            timestamp: new Date(),
            type: 'error'
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsTyping(false);
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <Tooltip title="Chat with Trading Assistant" placement="left">
        <IconButton
          className={classes.chatToggle}
          onClick={() => setIsOpen(true)}
        >
          <Badge badgeContent={notificationCount} color="secondary">
            <ChatIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Fade in={isOpen} timeout={300}>
      <Paper className={`${classes.chatContainer} ${isMinimized ? classes.minimized : ''}`} elevation={12}>
        <div className={classes.chatHeader}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <BotIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Trading Assistant
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" style={{ opacity: 0.8 }}>
                  AI-powered trading support
                </Typography>
                <Tooltip title={isConnected ? "Real-time data connected" : "Connecting to real-time data..."} placement="bottom">
                  <Box display="flex" alignItems="center">
                    {isConnected ? (
                      <ConnectedIcon style={{ fontSize: 12, color: '#4caf50', marginLeft: 4 }} />
                    ) : (
                      <DisconnectedIcon style={{ fontSize: 12, color: '#f44336', marginLeft: 4 }} />
                    )}
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box display="flex" gap={0.5}>
            <Tooltip title={isMinimized ? "Expand" : "Minimize"}>
              <IconButton
                color="inherit"
                onClick={toggleMinimize}
                size="small"
              >
                {isMinimized ? <ExpandIcon /> : <MinimizeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton
                color="inherit"
                onClick={() => setIsOpen(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </div>

        <Collapse in={!isMinimized}>
          <div className={classes.chatBody}>
            {messages.map((msg, index) => (
              <Zoom in={true} timeout={300} key={index}>
                <div
                  className={`${classes.messageContainer} ${
                    msg.user === 'You' ? classes.userMessage : ''
                  }`}
                >
                  {msg.user === 'Bot' && (
                    <Avatar style={{ backgroundColor: '#667eea' }}>
                      <BotIcon />
                    </Avatar>
                  )}
                  <div
                    className={`${classes.messageBubble} ${
                      msg.user === 'You' ? classes.userBubble : classes.botBubble
                    }`}
                  >
                    <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                      {msg.text}
                    </Typography>
                    <Typography className={classes.messageTimestamp}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </div>
                  {msg.user === 'You' && (
                    <Avatar style={{ backgroundColor: '#764ba2' }}>
                      <PersonIcon />
                    </Avatar>
                  )}
                </div>
              </Zoom>
            ))}
            
            {isTyping && (
              <div className={classes.typingIndicator}>
                <div className={classes.typingDot}></div>
                <div className={classes.typingDot}></div>
                <div className={classes.typingDot}></div>
                <Typography variant="caption" style={{ marginLeft: 8, color: '#666' }}>
                  Assistant is typing...
                </Typography>
              </div>
            )}
            
            {messages.length === 1 && (
              <Card className={classes.welcomeCard}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🚀 Welcome to Your Trading Assistant!
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: 16 }}>
                    I'm here to help you make informed trading decisions. Try these quick actions:
                  </Typography>
                  <div className={classes.suggestedActions}>
                    {quickActions.slice(0, 4).map((action, index) => (
                      <Chip
                        key={index}
                        label={action.label}
                        icon={action.icon}
                        className={classes.quickActionChip}
                        onClick={() => handleQuickAction(action.action)}
                        clickable
                        size="small"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className={classes.chatFooter}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Ask me anything about trading..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              multiline
              maxrows={3}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              startIcon={<SendIcon />}
              style={{ minWidth: 'auto' }}
            >
              Send
            </Button>
          </div>
        </Collapse>
      </Paper>
    </Fade>
  );
}
