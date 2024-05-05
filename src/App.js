import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button, Input } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  // State to store the uploaded file
  const [file, setFile] = useState(null);
  // State to store the insights from OpenAI API
  const [insights, setInsights] = useState('');
  // State to indicate loading while request is being processed
  const [isLoading, setIsLoading] = useState(false);

  // Backend API URL
  const API_URL = 'https://9546711cbee5.ngrok.app';

  // Define the fixed prompt
  const fixedPrompt = "Analyse the data in the file and share the insights. The device is used in a server room. Share some interesting facts about this data.";

  // Handle file upload event
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file); // Additional logging to confirm file selection
    setFile(file);
  };

  // Updated handleSubmit function with fixed prompt
  const handleSubmit = async () => {
    console.log('File state before API call:', file); // Log to check file state before API call
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prompt', fixedPrompt); // Append fixed prompt to form data

      setIsLoading(true); // Set loading state before sending request
      try {
        const response = await axios.post(`${API_URL}/analyze`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Assuming the response is properly formatted as a string
        setInsights(response.data);
      } catch (error) {
        console.error('Error:', error); // Additional logging to check for errors
        setInsights('Error processing file.');
      }
      setIsLoading(false); // Reset loading state after receiving response
    } else {
      setInsights('Please select a file to analyze.');
    }
  };

  // useEffect to log insights when they update
  useEffect(() => {
    console.log('Insights updated:', insights);
  }, [insights]);

  return (
    <ChakraProvider>
      <Box p={5}>
        <VStack spacing={4}>
          <Heading>Data Analysis Dashboard</Heading>
          <Text>Upload your CSV file for analysis.</Text>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>Analyze File</Button>
          <Box id="insightsBox" border="1px" borderColor="gray.200" p={30} width="100%" overflow="visible">
            <Text fontWeight="bold">Insights:</Text>
            <Text data-testid="insightsText" whiteSpace="pre-wrap">
              {insights || 'No insights to display yet.'}
            </Text>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
