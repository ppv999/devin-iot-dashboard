import React from 'react';
import {
  VStack,
  Heading,
  Input,
  useToast
} from '@chakra-ui/react';
import Papa from 'papaparse';

const CSVUploader = ({ setData }) => {
  const toast = useToast();

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      Papa.parse(newFile, {
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
    }
  };

  return (
    <VStack spacing={6}>
      <Heading as="h3" size="lg" color="#1C2531">Upload CSV File</Heading>
      <Input type="file" accept=".csv" onChange={handleFileChange} devin-id="csv-upload-input" />
    </VStack>
  );
};

export default CSVUploader;
