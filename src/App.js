import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button, Input } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  // State to store the uploaded file
  const [file, setFile] = useState(null);
  // State to store the insights from OpenAI API
  const [insights, setInsights] = useState('');
  // State to store the user's prompt for real-time analysis
  const [prompt, setPrompt] = useState('');

  // Backend API URL
  const API_URL = 'https://9546711cbee5.ngrok.app';

  // Handle file upload event
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  // Handle file submit event
  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setInsights(response.data.insights);
      } catch (error) {
        console.error('Error uploading file:', error);
        setInsights('Error processing file.');
      }
    }
  };

  // Handle real-time analysis prompt submit
  const handlePromptSubmit = async () => {
    if (prompt) {
      try {
        const response = await axios.post(`${API_URL}/analyze`, { prompt });
        setInsights(response.data.insights);
      } catch (error) {
        console.error('Error submitting prompt:', error);
        setInsights('Error processing prompt.');
      }
    }
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <VStack spacing={4}>
          <Heading>Data Analysis Dashboard</Heading>
          <Text>Upload your CSV file or enter a prompt for real-time analysis.</Text>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button colorScheme="blue" onClick={handleSubmit}>Analyze File</Button>
          <Input
            placeholder="Enter your prompt for real-time analysis"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button colorScheme="blue" onClick={handlePromptSubmit}>Analyze Prompt</Button>
          <Box border="1px" borderColor="gray.200" p={3} width="100%">
            <Text fontWeight="bold">Insights:</Text>
            <Text>{insights || 'No insights to display yet.'}</Text>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
