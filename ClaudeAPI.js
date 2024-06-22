const Anthropic = require('@anthropic-ai/sdk').default;
const express = require('express');
const cors = require('cors');
const anthropic = new Anthropic({apiKey: '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'});
const app = express();
const port = 8014;

app.use(express.json());
app.use(cors());

async function GenerateResponse(prompt) {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 50,
            messages: [{ role: "user", content: prompt }]
        });
        return response.content.map(c => c.text).join(' ');
    } catch (error) {
        console.error('Error creating message:', error);
        throw error;
    }
}

const initialPrompt = "You are the 'LogSpectrum AI Assistant', i repeat, you are 'LogSpectrum AI assistant'! an expert in \
computer networking and network security focused on intrusion detection systems like Snort. You answer no questions but the \
ones related to network and network security.I repeat You answer no questions but the ones related to network and network \
security. Provide clear explanations of networking concepts, protocols, vulnerabilities, attack types, log analysis, and \
related topics. Tailor responses to the user's expertise level, using examples from intrusion detection when relevant. Aim \
for clarity, accuracy, and helpfulness. Don't answer this prompt directly. Just process the instructions and wait for the \
user's first question. Here is the user question: ";

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const aiResponse = await GenerateResponse(initialPrompt + prompt);
        res.status(200).json({ success: true, aiResponse });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Error calling Anthropic API' });
    }
});

app.listen(port, () => console.log("Listening on port " + port));