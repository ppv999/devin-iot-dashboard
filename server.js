const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const csv = require('csv-parser');

const app = express();
const port = 5000;

// OpenAI API configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log all requests to the console
app.use((req, res, next) => {
  console.log(`Received request on ${req.path} with method ${req.method} and body:`, req.body);
  next();
});

// Analyze endpoint
app.post('/api/analyze', upload.single('csv'), async (req, res) => {
  const { prompt } = req.body;
  const csvData = [];

  // Debug: Log the openai object and its properties
  console.log('Debug: openai object:', openai);
  console.log('Debug: openai properties:', Object.keys(openai));

  // Parse CSV file if present
  if (req.file) {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => csvData.push(row))
      .on('end', async () => {
        console.log('CSV file successfully processed');
        fs.unlinkSync(req.file.path); // Remove the file after parsing

        // Combine CSV data with prompt for AI analysis
        const combinedPrompt = `Analyze the following data:\n${JSON.stringify(csvData)}\n\n${prompt}`;
        console.log('Combined prompt:', combinedPrompt); // Added logging for combinedPrompt

        try {
          const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: combinedPrompt}],
          });

          // Log the entire response from OpenAI API
          console.log(`Received full response from OpenAI:`, JSON.stringify(chatCompletion, null, 2));

          if (chatCompletion.choices && chatCompletion.choices.length > 0) {
            const messageObject = chatCompletion.choices[0].message;
            if (messageObject && messageObject.content) {
              console.log(`Sending response:`, messageObject.content);
              res.json({ data: messageObject.content });
            } else {
              // If messageObject or messageObject.content is undefined, log the choices[0] object to understand its structure
              console.log(`Unexpected message structure from OpenAI:`, JSON.stringify(chatCompletion.choices[0], null, 2));
              const logFilePath = path.join(__dirname, 'server-error.log');
              fs.appendFileSync(logFilePath, `${new Date().toISOString()} - Unexpected message structure from OpenAI: ${JSON.stringify(chatCompletion.choices[0], null, 2)}\n`);
              res.status(500).json({ error: "Unexpected message structure from OpenAI API." });
            }
          } else {
            // If choices array is missing or empty, log the entire chatCompletion object
            console.log(`Unexpected response structure from OpenAI:`, JSON.stringify(chatCompletion, null, 2));
            const logFilePath = path.join(__dirname, 'server-error.log');
            fs.appendFileSync(logFilePath, `${new Date().toISOString()} - Unexpected response structure from OpenAI: ${JSON.stringify(chatCompletion, null, 2)}\n`);
            res.status(500).json({ error: "Unexpected response structure from OpenAI API." });
          }
        } catch (error) {
          console.error(`Error processing request:`, error);
          const logFilePath = path.join(__dirname, 'server-error.log');
          fs.appendFileSync(logFilePath, `${new Date().toISOString()} - Error processing request: ${error.stack || error.message}\n`);
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(400).json({ error: "No CSV file uploaded." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
