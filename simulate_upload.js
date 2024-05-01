const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

async function simulateUpload() {
  const formData = new FormData();
  const fileStream = fs.createReadStream('sample_data.csv');
  formData.append('csv', fileStream); // Changed key from 'file' to 'csv' to match backend expectation
  formData.append('prompt', 'Analyze the trend of temperature and humidity over time.');

  try {
    const response = await axios.post('http://localhost:5000/api/analyze', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log('Analysis result:', response.data);
  } catch (error) {
    console.error('Error during analysis:', error.response?.data || error.message);
  }
}

simulateUpload();
