import React, { useState, useRef } from 'react';
import {
  VStack,
  Heading,
  Textarea,
  Button,
  useToast,
  Box,
  Text,
  Input
} from '@chakra-ui/react';
import axios from 'axios';

const AIPrompt = ({ setData }) => {
  const [prompt, setPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [file, setFile] = useState(null);
  const toast = useToast();
  const fileInputRef = useRef();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    if (!file) {
      toast({
        title: 'No file selected.',
        description: "Please upload a CSV file to analyze.",
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('csv', file);

    try {
      const response = await axios.post('https://0719dbb24689.ngrok.app/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setData(response.data);
      setAnalysisResult(response.data.data); // Update to store the analysis result
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
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        hidden
      />
      <Button onClick={() => fileInputRef.current.click()}>Upload CSV</Button>
      <Textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={handlePromptChange}
      />
      <Button colorScheme="blue" onClick={handleAnalyze}>Analyze</Button>
      {analysisResult && (
        <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
          <Heading as="h4" size="md">Analysis Result</Heading>
          <Text mt={4}>{analysisResult}</Text>
        </Box>
      )}
    </VStack>
  );
};

export default AIPrompt;
