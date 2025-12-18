require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('No API key found!');
        process.exit(1);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        console.log('Fetching available models...\n');

        // List all models
        const models = await genAI.listModels();

        console.log(`Found ${models.length} models:\n`);

        models.forEach((model, index) => {
            console.log(`${index + 1}. ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            console.log('');
        });

        // Find models that support generateContent
        const contentModels = models.filter(m =>
            m.supportedGenerationMethods?.includes('generateContent')
        );

        console.log(`\nModels supporting generateContent (${contentModels.length}):`);
        contentModels.forEach(m => console.log(`  - ${m.name}`));

        process.exit(0);
    } catch (error) {
        console.error('ERROR:', error.message);
        console.error('Status:', error.status);
        process.exit(1);
    }
}

listModels();
