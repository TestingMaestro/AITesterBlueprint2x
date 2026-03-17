export interface GenerateRequest {
    provider: string;
    requirement: string;
    config: any;
    image?: string;
    temperature?: number;
}

const formatPrompt = (requirement: string) => `You are a QA automation engineer. Convert the following requirement into formatted Jira test cases (Functional and Non-Functional).
Respond ONLY with the Jira formatted text. Do not add conversational text.

Requirement:
${requirement}

Jira Format:
**Summary**: [Test Case Title]
**Type**: [Functional / Non-Functional]
**Description**: [Brief description]
**Pre-conditions**:
- [Condition 1]
**Steps**:
1. [Step 1]
2. [Step 2]
**Expected Result**:
- [Result]
`;

export const generateTestCases = async ({ provider, config, requirement, image, temperature }: GenerateRequest): Promise<string> => {
    const prompt = formatPrompt(requirement);

    try {
        switch (provider) {
            case 'Ollama':
                return await generateOllama(prompt, config.ollamaUrl, image, temperature);
            case 'LMStudio':
                return await generateLMStudio(prompt, config.lmStudioUrl, image, temperature);
            case 'Groq':
                return await generateOpenAICompatible(prompt, 'https://api.groq.com/openai/v1/chat/completions', config.groqKey, 'llama-3.1-8b-instant', image, temperature);
            case 'OpenAI':
                return await generateOpenAICompatible(prompt, 'https://api.openai.com/v1/chat/completions', config.openAiKey, 'gpt-3.5-turbo', image, temperature);
            case 'Claude':
                return await generateClaude(prompt, config.claudeKey, image, temperature);
            case 'Gemini':
                return await generateGemini(prompt, config.geminiKey, image, temperature);
            default:
                throw new Error("Unknown provider: " + provider);
        }
    } catch (e: any) {
        console.error("Error generating with", provider, e);
        throw e;
    }
};

async function generateOllama(prompt: string, url: string, image?: string, temperature?: number): Promise<string> {
    const baseUrl = url || 'http://localhost:11434';
    
    let imagesArr: string[] | undefined = undefined;
    if (image) {
        const base64Data = image.split(',')[1];
        if (base64Data) {
            imagesArr = [base64Data];
        }
    }

    const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: image ? 'llava' : 'llama3',
            prompt: prompt,
            images: imagesArr,
            stream: false,
            options: temperature !== undefined ? { temperature } : undefined
        })
    });
    if (!res.ok) throw new Error("Ollama generation failed: " + res.statusText);
    const data = await res.json() as any;
    return data.response;
}

async function generateLMStudio(prompt: string, url: string, image?: string, temperature?: number): Promise<string> {
    const baseUrl = url || 'http://localhost:1234';
    return generateOpenAICompatible(prompt, `${baseUrl}/v1/chat/completions`, '', 'local-model', image, temperature);
}

async function generateOpenAICompatible(prompt: string, endpoint: string, apiKey: string, defaultModel: string, image?: string, temperature?: number): Promise<string> {
    let content: any = prompt;
    let modelToUse = defaultModel;

    if (image) {
        content = [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } }
        ];
        if (endpoint.includes('groq')) {
             modelToUse = 'llama-3.2-11b-vision-preview';
        } else if (endpoint.includes('openai')) {
             modelToUse = 'gpt-4o';
        }
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
            model: modelToUse,
            messages: [{ role: 'user', content: content }],
            ...(temperature !== undefined ? { temperature } : {})
        })
    });
    if (!res.ok) {
        let errDesc = res.statusText;
        try { const errObj = await res.json() as any; errDesc = JSON.stringify(errObj); } catch(e){}
        throw new Error("Provider request failed: " + errDesc);
    }
    const data = await res.json() as any;
    return data.choices[0].message.content;
}

async function generateClaude(prompt: string, apiKey: string, image?: string, temperature?: number): Promise<string> {
    let content: any = prompt;

    if (image) {
        const matches = image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
        if (matches && matches.length === 3) {
             content = [
                 {
                     type: "image",
                     source: {
                         type: "base64",
                         media_type: matches[1],
                         data: matches[2]
                     }
                 },
                 { type: "text", text: prompt }
             ];
        } else {
             content = prompt;
        }
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [{ role: 'user', content: content }],
            ...(temperature !== undefined ? { temperature } : {})
        })
    });
    if (!res.ok) throw new Error("Claude failed: " + res.statusText);
    const data = await res.json() as any;
    return data.content[0].text;
}

async function generateGemini(prompt: string, apiKey: string, image?: string, temperature?: number): Promise<string> {
    const parts: any[] = [{ text: prompt }];
    
    if (image) {
        const matches = image.match(/^data:(image\/[a-zA-Z]*);base64,([^\"]*)$/);
        if (matches && matches.length === 3) {
            parts.push({
                inline_data: {
                    mime_type: matches[1],
                    data: matches[2]
                }
            });
        }
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: parts }],
            ...(temperature !== undefined ? { generationConfig: { temperature } } : {})
        })
    });
    if (!res.ok) throw new Error("Gemini failed: " + res.statusText);
    const data = await res.json() as any;
    return data.candidates[0].content.parts[0].text;
}
