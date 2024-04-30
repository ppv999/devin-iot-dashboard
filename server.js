const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = 5000;

// OpenAI API configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: prompt }],
    });

    console.log(`Sending response:`, chatCompletion.data.choices[0].message.content);
    res.json({ data: chatCompletion.data.choices[0].message.content });
  } catch (error) {
    console.error(`Error processing request:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
