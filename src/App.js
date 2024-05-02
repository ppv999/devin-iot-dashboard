import React from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Button, Input } from '@chakra-ui/react';

function App() {
  // State to store the uploaded file
  const [file, setFile] = React.useState(null);
  // State to store the insights from OpenAI API
  const [insights, setInsights] = React.useState('');

  // Handle file upload event
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  // Handle file submit event
  const handleSubmit = () => {
    if (file) {
      // TODO: Implement file parsing and OpenAI API call
      console.log('File submitted:', file);
    }
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <VStack spacing={4}>
          <Heading>Data Analysis Dashboard</Heading>
          <Text>Upload your CSV file to get started.</Text>
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Button colorScheme="blue" onClick={handleSubmit}>Analyze</Button>
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
