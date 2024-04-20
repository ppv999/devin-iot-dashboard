import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Heading, Text, Flex } from '@chakra-ui/react';
import Graph from './Graph';
import Controls from './Controls';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

function App() {
  // Initialize state with empty array or data from localStorage
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('sensorData');
    return savedData ? JSON.parse(savedData) : [];
  });

  // Effect to store data in localStorage when data changes
  useEffect(() => {
    localStorage.setItem('sensorData', JSON.stringify(data));
  }, [data]);

  const handleFetchData = (fetchedData) => {
    // Update state with new fetched data
    setData(prevData => [...prevData, ...fetchedData]);
  };

  return (
    <ChakraProvider>
      <ErrorBoundary> {/* Wrap components in ErrorBoundary */}
        <Flex direction="column" align="center" justify="center" minH="100vh" p={5}>
          <Box boxSize="sm" mb={0}> {/* Removed marginBottom to reduce gap */}
            <img src={process.env.PUBLIC_URL + '/Bolt_IoT_Final_Logo_-14.png'} alt="Bolt IoT Logo" style={{ width: '150px', objectFit: 'contain', display: 'block', margin: '0 auto', marginBottom: '0' }} />
          </Box>
          <VStack spacing={2} width="full" maxW="container.md" align="center"> {/* Reduced spacing for overall vertical alignment and centered content */}
            <Heading as="h1" size="xl" color="blue.600" textAlign="center" mt={0} mb={2}>
              Bolt IoT Data Visualization
            </Heading>
            <Text fontSize="md" color="gray.600">
              Real-time sensor data graph
            </Text>
            <Controls onFetchData={handleFetchData} />
            <Graph data={data} />
          </VStack>
        </Flex>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

export default App;
