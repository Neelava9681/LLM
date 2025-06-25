const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/mock-llm', (req, res) => {
    const prompt = req.body.prompt || '';

    console.log(`Received prompt: ${prompt}`);

    // Create a mock response with the JSON content as a string
    const mockSchema = {
        object: {
            fullName: "Project__c",
            label: "Project",
            pluralLabel: "Projects"
        },
        fields: [
            { fullName: "Project_Name__c", label: "Project Name", type: "Text" },
            { fullName: "Start_Date__c", label: "Start Date", type: "Date" },
            { fullName: "Budget__c", label: "Budget", type: "Number" },
            { fullName: "Description__c", label: "Description", type: "LongTextArea" }
        ]
    };

    const mockResponse = {
        choices: [
            {
                message: {
                    role: "assistant",
                    content: JSON.stringify(mockSchema) // Stringify the JSON
                }
            }
        ]
    };

    res.json(mockResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mock LLM server running on port ${PORT}`);
});
