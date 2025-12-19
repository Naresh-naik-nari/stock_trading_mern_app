const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
    try {
        const { message, context } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        // Graceful fallback if no API key is present
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing in .env");
            return res.json({
                text: "I'm currently running in limited mode because my AI brain (API Key) is missing. Please ask the administrator to configure the GEMINI_API_KEY in the server settings to unlock my full potential! 🧠✨",
                type: "system_message"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a rich prompt using available context
        let prompt = `You are a professional and helpful stock trading assistant for a platform called "Stock Trading Simulator".
    
    User Context:
    ${context ? JSON.stringify(context, null, 2) : "No specific user context provided."}
    
    User Query: ${message}
    
    Instructions:
    1. Answer the user's question about stocks, trading, or their portfolio.
    2. Be concise but informative.
    3. Use emojis where appropriate to be friendly.
    4. If the user asks about their portfolio, use the provided context.
    5. Do not give financial advice as "guaranteed" wins; always suggest research.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text, type: 'ai_response' });

    } catch (error) {
        console.error("AI Generation Error:", error);

        // Check if it's a rate limit error
        if (error.status === 429 || error.message?.includes('Too Many Requests')) {
            return res.status(200).json({
                text: "I'm getting too many requests right now! 😅 The free API has rate limits. Please wait a minute and try again.",
                type: "rate_limit"
            });
        }

        // Check if it's a model not found error
        if (error.status === 404) {
            return res.status(200).json({
                text: "Oops! The AI model is not available. The API key might need updating or the model name changed. Please contact support.",
                type: "model_error"
            });
        }

        // Generic error
        res.status(200).json({
            text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. 🔧",
            type: "error"
        });
    }
};
