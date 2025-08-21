import React, { useState, useRef, useEffect, useContext } from "react";
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
  LinearProgress
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
  ExpandMore as ExpandIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import UserContext from "../../context/UserContext";

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
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  quickActionChip: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: 500,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    transition: 'all 0.2s ease',
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
  welcomeCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
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
    '0%, 80%, 100%': {
      transform: 'scale(0.8)',
      opacity: 0.5,
    },
    '40%': {
      transform: 'scale(1)',
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
  const messagesEndRef = useRef(null);

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

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Enhanced response system with more sophisticated answers
    if (input.includes('portfolio') || input.includes('balance') || input.includes('analyze')) {
      return {
        text: `Your portfolio analysis shows:\n\n💰 Cash Balance: $${userData?.user?.balance?.toLocaleString() || '---'}\n📊 Portfolio Value: Check your dashboard for real-time updates\n\n💡 Tips:\n• Diversify across different sectors\n• Monitor your positions regularly\n• Consider rebalancing quarterly`,
        type: 'analysis'
      };
    }
    if (input.includes('buy') || input.includes('purchase')) {
      return {
        text: `Here's how to buy stocks:\n\n1️⃣ Search for stocks using the search bar\n2️⃣ Review the stock's performance and charts\n3️⃣ Click "Buy" and enter quantity\n4️⃣ Confirm your purchase\n\n⚠️ Remember: Only invest what you can afford to lose!`,
        type: 'instruction'
      };
    }
    if (input.includes('sell') || input.includes('strategy')) {
      return {
        text: `Selling Strategy Tips:\n\n📈 Set profit targets (e.g., 20% gain)\n🛑 Use stop-loss orders to limit losses\n📊 Monitor technical indicators\n⏰ Don't let emotions drive decisions\n\n💡 Consider selling when:\n• Stock reaches your target price\n• Fundamentals change significantly\n• You need to rebalance your portfolio`,
        type: 'strategy'
      };
    }
    if (input.includes('market') || input.includes('trend')) {
      return {
        text: `Current Market Analysis:\n\n📊 Market trends can be volatile\n📈 Check the charts section for technical analysis\n📰 Stay updated with the news feed\n🔍 Research before making decisions\n\n💡 Pro tip: Look for patterns in volume and price movements`,
        type: 'market'
      };
    }
    if (input.includes('risk')) {
      return {
        text: `Risk Management Essentials:\n\n🛡️ Never invest more than you can afford to lose\n📊 Diversify across multiple stocks and sectors\n⏰ Set clear entry and exit points\n📈 Use stop-loss orders\n💰 Keep some cash for opportunities\n\n🎯 Remember: Preservation of capital is key!`,
        type: 'risk'
      };
    }
    if (input.includes('psychology')) {
      return {
        text: `Trading Psychology Tips:\n\n🧠 Control your emotions - fear and greed are your enemies\n📊 Stick to your trading plan\n⏰ Don't chase losses or overtrade\n📈 Celebrate small wins, learn from losses\n💪 Build confidence through education and practice\n\n🎯 Success comes from discipline, not luck!`,
        type: 'psychology'
      };
    }
    if (input.includes('education') || input.includes('learn')) {
      return {
        text: `Trading Education Resources:\n\n📚 Start with the basics: P/E ratios, market cap, volume\n📊 Learn technical analysis: charts, indicators, patterns\n📰 Follow financial news and market updates\n🎓 Practice with paper trading first\n💡 Join trading communities and forums\n\n🚀 Knowledge is your best investment!`,
        type: 'education'
      };
    }
    if (input.includes('news')) {
      return {
        text: `Stay informed with:\n\n📰 Check the News section for latest updates\n📊 Monitor earnings reports and economic data\n🌍 Follow global market trends\n💼 Watch for sector-specific news\n⏰ Set up alerts for your holdings\n\n📈 Information is power in trading!`,
        type: 'news'
      };
    }
    if (input.includes('help')) {
      return {
        text: `I can help you with:\n\n📊 Portfolio analysis and management\n💰 Buying and selling strategies\n📈 Market trends and analysis\n🛡️ Risk management techniques\n🧠 Trading psychology tips\n📚 Educational resources\n📰 Market news and updates\n\nJust ask me about any of these topics!`,
        type: 'help'
      };
    }
    if (input.includes('hello') || input.includes('hi')) {
      return {
        text: `Hello! 👋 Ready to make some smart investment decisions today? I'm here to help you navigate the markets and build your portfolio. What would you like to know?`,
        type: 'greeting'
      };
    }
    
    return {
      text: `I understand you're asking about "${userInput}". Here are some topics I can help with:\n\n• Portfolio analysis and management\n• Buying and selling strategies\n• Market trends and analysis\n• Risk management\n• Trading psychology\n• Educational resources\n\nTry asking about any of these areas!`,
      type: 'general'
    };
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { 
        user: 'You', 
        text: input,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      
      // Simulate bot response with delay
      setTimeout(() => {
        const response = getBotResponse(input);
        const botResponse = { 
          user: 'Bot', 
          text: response.text,
          timestamp: new Date(),
          type: response.type
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      
      setInput("");
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
    handleSend();
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
              <Typography variant="caption" style={{ opacity: 0.8 }}>
                AI-powered trading support
              </Typography>
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

