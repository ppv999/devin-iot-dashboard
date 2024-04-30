import React, { useState } from 'react';
import './App.css';
import CSVUploader from './components/CSVUploader';
import DataDisplay from './components/DataDisplay';
import AIPrompt from './components/AIPrompt';
import ChartComponent from './components/ChartComponent';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], values: [], label: 'Analysis Data' });

  return (
    <div className="App">
      <CSVUploader setData={setCsvData} />
      {csvData.length > 0 && <DataDisplay data={csvData} />}
      <AIPrompt setData={setAnalysisResult} />
      {analysisResult && <ChartComponent chartData={chartData} />}
    </div>
  );
}

export default App;
