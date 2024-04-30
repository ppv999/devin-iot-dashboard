const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAIApi } = require('openai');

const app = express();
const port = 5000;

// OpenAI API configuration
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log all requests to the console
app.use((req, res, next) => {
  console.log(`Received request on ${req.path} with method ${req.method} and body:`, req.body);
  next();
});

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 150,
    });

    console.log(`Received response from OpenAI:`, chatCompletion.data);
    if (chatCompletion.data && chatCompletion.data.choices) {
      console.log(`Sending response:`, chatCompletion.data.choices[0].message.content);
      res.json({ data: chatCompletion.data.choices[0].message.content });
    } else {
      console.log(`Unexpected response structure from OpenAI:`, chatCompletion.data);
      res.status(500).json({ error: "Unexpected response structure from OpenAI API." });
    }
  } catch (error) {
    console.error(`Error processing request:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
