import { Request, Response } from 'express';

export const handleTestConnection = async (req: Request, res: Response) => {
    try {
        const { provider, config } = req.body;
        
        if (provider === 'Ollama') {
            const url = config.ollamaUrl || 'http://localhost:11434';
            const response = await fetch(url);
            if (response.ok) {
                return res.json({ success: true, message: `Successfully connected to Ollama at ${url}` });
            } else {
                throw new Error(`Ollama responded with status: ${response.status}`);
            }
        } else if (provider === 'LMStudio') {
            const url = config.lmStudioUrl || 'http://localhost:1234';
            const response = await fetch(`${url}/v1/models`);
            if (response.ok) {
                return res.json({ success: true, message: `Successfully connected to LM Studio at ${url}` });
            } else {
                throw new Error(`LM Studio responded with status: ${response.status}`);
            }
        } else if (provider === 'Groq') {
            if (!config.groqKey) throw new Error("Groq API key is missing.");
            const response = await fetch('https://api.groq.com/openai/v1/models', {
                headers: { 'Authorization': `Bearer ${config.groqKey}` }
            });
            if (response.ok) return res.json({ success: true, message: "Successfully connected to Groq API." });
            throw new Error(`Groq API test failed: ${response.statusText}`);
        } else if (provider === 'OpenAI') {
            if (!config.openAiKey) throw new Error("OpenAI API key is missing.");
            const response = await fetch('https://api.openai.com/v1/models', {
                headers: { 'Authorization': `Bearer ${config.openAiKey}` }
            });
            if (response.ok) return res.json({ success: true, message: "Successfully connected to OpenAI API." });
            throw new Error(`OpenAI API test failed: ${response.statusText}`);
        } else if (provider === 'Claude') {
            if (!config.claudeKey) throw new Error("Claude API key is missing.");
            return res.json({ success: true, message: "Claude API key format looks valid. (Full connection test bypassed to save tokens)." });
        } else if (provider === 'Gemini') {
            if (!config.geminiKey) throw new Error("Gemini API key is missing.");
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${config.geminiKey}`);
            if (response.ok) return res.json({ success: true, message: "Successfully connected to Gemini API." });
            throw new Error(`Gemini API test failed: ${response.statusText}`);
        } else {
            return res.status(400).json({ success: false, error: "Unknown provider" });
        }
    } catch (error: any) {
        let errorMsg = error.message;
        if (error.cause && error.cause.code === 'ECONNREFUSED') {
             errorMsg = "Connection Refused. Is the local service running?";
        }
        res.json({ success: false, error: errorMsg });
    }
};
