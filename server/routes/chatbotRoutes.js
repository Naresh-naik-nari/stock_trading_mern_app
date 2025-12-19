const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        status: "error",
        message: "Message is required"
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a trading-focused prompt
    const prompt = `You are an AI Trading Assistant for a stock trading application. You help users with:
- Portfolio analysis and management
- Stock market trends and analysis
- Buying and selling strategies
- Risk management
- Trading psychology
- Educational content about trading

User context: ${context || 'General user'}
User message: ${message}

Please provide a helpful, informative response focused on trading and investment advice. Keep responses concise but informative. Use emojis sparingly and professionally. If the question is not related to trading or finance, politely redirect the conversation back to trading topics.`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      status: "success",
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback response if API fails
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.json({
      status: "success",
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// Fallback responses when API is unavailable
function getFallbackResponse(message) {
  const input = message.toLowerCase();
  
  if (input.includes('portfolio') || input.includes('balance')) {
    return "I can help you analyze your portfolio! Check your dashboard for current holdings and consider diversifying across different sectors for better risk management.";
  }
  if (input.includes('buy') || input.includes('purchase')) {
    return "To buy stocks: 1) Search for the stock, 2) Review its performance, 3) Click 'Buy' and enter quantity, 4) Confirm purchase. Remember to only invest what you can afford to lose!";
  }
  if (input.includes('sell')) {
    return "For selling strategies: Set profit targets, use stop-loss orders, monitor technical indicators, and don't let emotions drive your decisions. Consider selling when stocks reach target prices or fundamentals change.";
  }
  if (input.includes('risk')) {
    return "Risk management is crucial: Never invest more than you can afford to lose, diversify your portfolio, set clear entry/exit points, and use stop-loss orders to protect your capital.";
  }
  
  return "I'm your AI Trading Assistant! I can help with portfolio analysis, market trends, trading strategies, risk management, and trading education. What would you like to know about trading?";
}

module.exports = router;