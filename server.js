const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Updated to target the chart container by the new ID 'chart-container'
  const chartElement = await page.$('#chart-container');

  if (chartElement) {
    // Use Puppeteer's pdf function to generate a PDF of the page
    const pdfPath = path.join(__dirname, 'browser_downloads', 'BoltIoTData.pdf');

    // Ensure the downloads directory exists
    const downloadsDir = path.dirname(pdfPath);
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    // Generate the PDF and save it to the file
    await page.pdf({ path: pdfPath, format: 'A4' });
    console.log(`PDF saved to ${pdfPath}`);
  } else {
    console.error('Chart container element not found');
  }

  await browser.close();
})();
