import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast
} from '@chakra-ui/react';

const Controls = ({ onFetchData }) => {
  // Set default values for API Key and Device ID
  const [apiKey, setApiKey] = useState('af75e9bd-dcaa-4201-9312-51c1feb3a8d9');
  const [deviceId, setDeviceId] = useState('BOLT906666');
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!apiKey || !deviceId) {
      toast({
        title: 'Error',
        description: 'API Key and Device ID are required.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      // Update the API endpoint to match the provided Bolt IoT API command
      const response = await fetch(`https://cloud.boltiot.com/remote/${apiKey}/analogRead?deviceName=${deviceId}&pin=A0`);
      const data = await response.json();

      // Detailed logging for debugging
      console.log('API Response:', data);

      // Check if the API call was successful or if it contains a sensor value in an error message
      let sensorValue;
      if (data.success === '1' || (data.value && !isNaN(data.value))) {
        sensorValue = parseInt(data.value, 10);
      } else {
        throw new Error(`API error: ${data.value}`);
      }

      // Convert data to the expected format for the Graph component
      const formattedData = [{
        time: new Date().toISOString(),
        value: sensorValue
      }];

      onFetchData(formattedData);
    } catch (error) {
      console.error('API Call Error:', error);
      toast({
        title: 'Error fetching data',
        description: error.toString(),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor='apiKey'>API Key</FormLabel>
            <Input
              id='apiKey'
              placeholder='Enter your API Key'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor='deviceId'>Device ID</FormLabel>
            <Input
              id='deviceId'
              placeholder='Enter your Device ID'
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
            />
          </FormControl>
          <Button type='submit' colorScheme='blue'>Fetch Data</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Controls;
