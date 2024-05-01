import React, { useState } from 'react';
import {
  Button,
  VStack,
  Heading,
  Input,
  useToast
} from '@chakra-ui/react';
import Papa from 'papaparse';

const CSVUploader = ({ setData }) => {
  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log('Parsed Result:', result);
          setData(result.data);
          toast({
            title: 'Success.',
            description: "File has been uploaded and parsed!",
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
        header: true,
        skipEmptyLines: true
      });
    } else {
      toast({
        title: 'No file selected.',
        description: "Please select a CSV file to upload.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={6}>
      <Heading as="h3" size="lg">Upload CSV File</Heading>
      <Input type="file" accept=".csv" onChange={handleFileChange} devin-id="csv-upload-input" />
      <Button colorScheme="blue" onClick={handleUpload} devin-id="upload-button">Upload</Button>
    </VStack>
  );
};

export default CSVUploader;
