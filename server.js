const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS support

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Validate prompt structure
const validatePrompt = (prompt) => {
    if (!prompt) return { valid: false, error: 'Prompt is required' };
    if (typeof prompt !== 'string') return { valid: false, error: 'Prompt must be a string' };
    if (prompt.length > 1000) return { valid: false, error: 'Prompt too long (max 1000 chars)' };
    return { valid: true };
};

// Generate mock response based on prompt
const generateMockResponse = (prompt) => {
    // Extract object name from prompt if possible
    const objectMatch = prompt.match(/object called "([^"]+)"/i) || 
                       prompt.match(/Object Name: "([^"]+)"/i);
    const objectName = objectMatch ? objectMatch[1] : 'Project';
    
    const fullName = objectName.replace(/\s+/g, '_') + '__c';
    
    return {
        object: {
            fullName: fullName,
            label: objectName,
            pluralLabel: objectName + 's',
            description: `Tracks ${objectName.toLowerCase()} information`,
            deploymentStatus: "Deployed"
        },
        fields: [
            { fullName: objectName.replace(/\s+/g, '_') + '_Name__c', 
              label: `${objectName} Name`, 
              type: "Text",
              length: 80,
              required: true },
            { fullName: "Start_Date__c", 
              label: "Start Date", 
              type: "Date",
              description: "When the project begins" },
            { fullName: "Budget__c", 
              label: "Budget", 
              type: "Number",
              scale: 2,
              precision: 12 },
            { fullName: "Description__c", 
              label: "Description", 
              type: "LongTextArea",
              visibleLines: 5 }
        ]
    };
};

app.post('/mock-llm', (req, res) => {
    try {
        const prompt = req.body.prompt || '';
        console.log(`Received prompt: "${prompt}"`);

        // Validate prompt
        const validation = validatePrompt(prompt);
        if (!validation.valid) {
            return res.status(400).json({ 
                error: validation.error,
                usage: "Include a prompt describing the object and fields you want to create"
            });
        }

        // Generate dynamic response based on prompt
        const mockSchema = generateMockResponse(prompt);
        
        const mockResponse = {
            id: 'mock-' + Math.random().toString(36).substring(2, 9),
            created: Math.floor(Date.now() / 1000),
            choices: [{
                message: {
                    role: "assistant",
                    content: JSON.stringify(mockSchema)
                },
                finish_reason: "stop",
                index: 0
            }],
            usage: {
                prompt_tokens: prompt.length,
                completion_tokens: JSON.stringify(mockSchema).length,
                total_tokens: prompt.length + JSON.stringify(mockSchema).length
            }
        };

        // Simulate slight delay like a real API
        setTimeout(() => {
            res.json(mockResponse);
        }, 300);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString() 
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mock LLM server running on port ${PORT}`);
    console.log(`Try POST /mock-llm with { "prompt": "your prompt here" }`);
});