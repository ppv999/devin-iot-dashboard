import React, { useState, useEffect } from 'react';
import './App.css';
import CSVUploader from './components/CSVUploader';
import DataDisplay from './components/DataDisplay';
import AIPrompt from './components/AIPrompt';
import ChartComponent from './components/ChartComponent';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: '#1C2531',
        background: '#FFFFFF',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      defaultProps: {
        colorScheme: 'green',
      },
    },
  },
});

function App() {
  const [csvData, setCsvData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ label: 'Analysis Data', data: [] }] });

  useEffect(() => {
    if (analysisResult && analysisResult.length > 0) {
      // Assuming analysisResult is an array of objects with 'timestamp', 'value' keys
      const labels = analysisResult.map(item => item.timestamp);
      const data = analysisResult.map(item => item.value);
      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Analysis Data',
            data: data,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ]
      });
    }
  }, [analysisResult]);

  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <CSVUploader setData={setCsvData} />
        {csvData.length > 0 && <DataDisplay data={csvData} />}
        <AIPrompt setData={setAnalysisResult} />
        {analysisResult && analysisResult.length > 0 && <ChartComponent chartData={chartData} />}
      </div>
    </ChakraProvider>
  );
}

export default App;
