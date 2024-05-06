import React, { useState } from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button, Input, Textarea } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  // State to store the insights from OpenAI API
  const [insights, setInsights] = useState(`To start the analysis, I will first load and examine the data in the provided CSV file (file-27NwkWV5SnukR3W4PPonCQEb). Let's explore the trends, anomalies, and key statistics in the temperature and humidity data recorded in the server room.

### Data Analysis:

#### 1. Basic Statistics:
- Total Number of Records: 1000
- Columns: time_stamp in IST, temp, humidity

#### 2. Temperature Analysis:
- Minimum Temperature: 19.62°C
- Maximum Temperature: 35.72°C
- Average Temperature: 27.46°C
- Standard Deviation of Temperature: 3.34°C

#### 3. Humidity Analysis:
- Minimum Humidity: 41.41%
- Maximum Humidity: 79.93%
- Average Humidity: 60.16%
- Standard Deviation of Humidity: 9.24%

#### 4. Trends:
- The temperature in the server room ranges from 19.62°C to 35.72°C, showing fluctuations.
- Humidity levels vary between 41.41% to 79.93%, indicating some variability as well.

#### 5. Anomalies:
- There don't appear to be any significant anomalies in the data. The temperature and humidity values seem to be within reasonable ranges for a server room environment.

#### 6. Interesting Facts:
- The average temperature recorded is around 27.46°C, which is within the optimal temperature range for a server room to prevent overheating of equipment.
- The humidity levels vary between 41.41% to 79.93%, which is also within an acceptable range to maintain proper equipment functioning.
- There is a standard deviation of 3.34°C in temperature and 9.24% in humidity, indicating some variability in the data.

### Summary:
The data from the server room indicates that the temperature and humidity levels are being monitored within acceptable ranges. No significant anomalies were detected in the dataset. The average values fall within the optimal ranges for a server room environment. It is essential to continue monitoring these parameters to ensure the smooth functioning of equipment in the server room.`);
  // State to indicate loading while request is being processed
  const [isLoading, setIsLoading] = useState(false);
  // State to store the uploaded file content
  const [fileContent, setFileContent] = useState('');
  // New state hook for pasted CSV content
  const [pastedCsvContent, setPastedCsvContent] = useState('');
  // State to store user feedback
  const [feedback, setFeedback] = useState('');

  // Backend API URL
  const API_URL = 'https://9546711cbee5.ngrok.app';

  // Handle file upload event
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile); // Additional logging to confirm file selection
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        console.log('File content:', content); // Log file content for debugging
        setFileContent(content); // Update the fileContent state
      };
      reader.readAsText(selectedFile);
    } else {
      console.error('No file selected.'); // Log error if file is not selected
      setInsights('Please select a file to analyze.');
      setFileContent(''); // Clear the fileContent state
    }
  };

  // Updated handleSubmit function to send CSV content as raw data
  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state before sending request
    const contentToAnalyze = pastedCsvContent || fileContent; // Use pasted content if available, otherwise use file content
    const formData = new FormData();
    formData.append('data', contentToAnalyze);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Check if the response contains insights and update the state accordingly
      if (response.data && response.data.insights) {
        setInsights(response.data.insights);
      } else {
        setInsights('No insights received from the analysis.');
      }
      console.log('Response data:', response.data); // Additional logging to check response data
    } catch (error) {
      console.error('Error:', error); // Additional logging to check for errors
      setInsights('Error processing file.');
    }
    setIsLoading(false); // Reset loading state after receiving response
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = async () => {
    setIsLoading(true); // Set loading state before sending request
    try {
      const response = await axios.post(`${API_URL}/feedback`, { feedback });
      console.log('Feedback response:', response.data); // Log feedback response for debugging
      setFeedback(''); // Clear feedback after submission
    } catch (error) {
      console.error('Error submitting feedback:', error); // Log error if feedback submission fails
    }
    setIsLoading(false); // Reset loading state after receiving response
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <VStack spacing={4}>
          <Heading>Data Analysis Dashboard</Heading>
          <Text>Upload your CSV file for analysis.</Text>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Textarea
            placeholder="Paste CSV content here"
            onChange={(e) => setPastedCsvContent(e.target.value)}
          />
          <Button colorScheme="blue" isLoading={isLoading} onClick={handleSubmit}>Analyze Pasted Content</Button>
          <Button colorScheme="blue" isLoading={isLoading} onClick={() => handleSubmit(fileContent)}>Analyze File</Button>
          <Text>Enter your feedback below:</Text>
          <Textarea
            placeholder="Your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </Button>
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
