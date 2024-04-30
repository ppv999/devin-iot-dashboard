import React, { useState } from 'react';
import {
  VStack,
  Heading,
  Textarea,
  Button,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const AIPrompt = ({ setData }) => {
  const [prompt, setPrompt] = useState('');
  const toast = useToast();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt is empty.',
        description: "Please enter a prompt to analyze.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post('https://0719dbb24689.ngrok.app/api/analyze', { prompt });
      setData(response.data);
      toast({
        title: 'Analysis complete.',
        description: "The AI has analyzed the data based on your prompt.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Analysis failed.',
        description: "There was an issue analyzing the data: " + error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6}>
      <Heading as="h3" size="lg">AI Analysis Prompt</Heading>
      <Textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={handlePromptChange}
      />
      <Button colorScheme="blue" onClick={handleAnalyze}>Analyze</Button>
    </VStack>
  );
};

export default AIPrompt;
