require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);
    console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'MISSING');

    if (!apiKey) {
        console.error('No API key found!');
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('Sending test request...');
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();

        console.log('SUCCESS! Response:', text);
        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Status:', error.status);
        console.error('Full error:', error);
        process.exit(1);
    }
}

testGemini();
