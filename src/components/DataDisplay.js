import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading
} from '@chakra-ui/react';

const DataDisplay = ({ data }) => {
  if (!data || data.length === 0) {
    return <Heading as="h3" size="lg" textAlign="center">No Data Available</Heading>;
  }

  const headers = Object.keys(data[0]);

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            {headers.map((header, index) => (
              <Th key={index}>{header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {headers.map((header, index) => (
                <Td key={index}>{row[header]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataDisplay;
