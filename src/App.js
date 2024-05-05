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
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile); // Additional logging to confirm file selection
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        console.log('File content:', fileContent); // Log file content for debugging
        setFile(fileContent);
      };
      reader.readAsText(selectedFile);
    } else {
      console.error('No file selected.'); // Log error if file is not selected
      setInsights('Please select a file to analyze.');
    }
  };

  // Updated handleSubmit function to send CSV content as a string
  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected.'); // Log error if file is not selected
      setInsights('Please select a file to analyze.');
      return; // Exit the function if no file is selected
    }

    setIsLoading(true); // Set loading state before sending request
    try {
      const response = await axios.post(`${API_URL}/analyze`, {
        data: file,
        prompt: fixedPrompt
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the response is properly formatted as a string
      setInsights(response.data);
      console.log('Response data:', response.data); // Additional logging to check response data
    } catch (error) {
      console.error('Error:', error); // Additional logging to check for errors
      setInsights('Error processing file.');
    }
    setIsLoading(false); // Reset loading state after receiving response
  };

  // useEffect to call handleSubmit when file state updates
  useEffect(() => {
    if (file) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

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
          <Button colorScheme="blue" isLoading={isLoading} onClick={handleSubmit}>Analyze File</Button>
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
