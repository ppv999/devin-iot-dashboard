import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const Graph = ({ data }) => {
  // State to trigger PDF download
  const [downloadPdf, setDownloadPdf] = useState(false);

  // Ref for the chart instance
  const chartRef = useRef(null);

  // Chart data configuration
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: 'Sensor Value',
        data: data.map(d => d.value),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Chart options configuration
  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          tooltipFormat: 'll HH:mm'
        },
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Data Over Time'
      }
    },
    maintainAspectRatio: false, // Set to false to allow custom height
    responsive: true,
    aspectRatio: 2, // Default aspect ratio
    animation: {
      onComplete: () => {
        // Removed PDF download logic from animation onComplete
      }
    }
  };

  // Cleanup function to destroy chart instance
  useEffect(() => {
    const chartInstance = chartRef.current;
    return () => {
      chartInstance?.destroy();
    };
  }, []); // This will run only on component unmount

  useEffect(() => {
    if (downloadPdf) {
      // Trigger the download process
      console.log('Download PDF process started'); // Log start of download process
      if (chartRef.current) {
        const canvas = chartRef.current.canvas;
        canvas.toBlob(blob => {
          console.log('Blob created from canvas', blob); // Log blob creation
          if (blob) {
            const link = document.createElement('a');
            console.log('Link element created', link); // Log link element creation
            link.href = URL.createObjectURL(blob);
            link.download = 'BoltIoTData.pdf';
            console.log('Link attributes set, about to click', link); // Log before clicking the link
            // Attempt to append link to body to ensure visibility in DOM
            document.body.appendChild(link);
            // Delay clicking the link to ensure it is recognized by the DOM
            setTimeout(() => {
              try {
                link.click();
                console.log('Link clicked for download'); // Log after clicking the link
                // Log the actual href to see where the file is being saved
                console.log('PDF download initiated. File should be saved to:', link.href);
              } catch (error) {
                console.error('Error during PDF download:', error);
              }
              // Remove link from body after click
              document.body.removeChild(link);
              URL.revokeObjectURL(link.href);
            }, 500); // Increased delay to 500ms
          } else {
            console.error('Failed to generate blob from canvas');
          }
        }, 'application/pdf'); // Added MIME type for PDF
      }
      // Reset the downloadPdf state
      setDownloadPdf(false);
    }
  }, [downloadPdf]); // This will run when downloadPdf state changes

  return (
    <div>
      <div id="chart-container" style={{ height: '540px', width: '80vw' }}>
        <Line data={chartData} options={chartOptions} ref={chartRef} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <button onClick={() => setDownloadPdf(true)} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Graph;
