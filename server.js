const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/mock-llm', (req, res) => {
    const prompt = req.body.prompt || '';

    const mockResponse = {
        choices: [
            {
                message: {
                    role: "assistant",
                    content: `{
                        "object": {
                            "fullName": "Mock_Object__c",
                            "label": "Mock Object",
                            "pluralLabel": "Mock Objects"
                        },
                        "fields": [
                            { "fullName": "Field1__c", "label": "Field 1", "type": "Text" },
                            { "fullName": "Field2__c", "label": "Field 2", "type": "Number" }
                        ]
                    }`
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
