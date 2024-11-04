import puppeteer from "puppeteer";
import { getJobOperationsById } from "~/server/controller/utilities/labelParts";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const query = getQuery(event);
    const modelNumbers = query.modelNumber;

    if (method !== 'GET') {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }

    const jobOperations = await getJobOperationsById({ MODEL: modelNumbers });

    if (!jobOperations?.length) {
      setResponseStatus(event, 404);
      return { error: 'No data found for the given model number(s).' };
    }

    // Generate HTML content with the exact grid layout
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.2;
            }
            
            .grid-container {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px 40px;
              padding: 20px;
            }
            
            .part-item {
              break-inside: avoid;
              margin-bottom: 20px;
            }
            
            .part-header {
              display: flex;
              gap: 15px;
              margin-bottom: 5px;
            }
            
            .part-number {
              font-weight: bold;
              min-width: 70px;
            }
            
            .part-code {
              font-weight: bold;
            }
            
            .part-category {
              margin-bottom: 3px;
            }
            
            .part-description {
              margin-bottom: 5px;
            }
            
            @page {
              size: letter;
              margin: 40px;
            }
            
            @media print {
              .grid-container {
                page-break-inside: auto;
              }
              
              .part-item {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="grid-container">
            ${jobOperations.map(operation => `
              <div class="part-item">
                <div class="part-header">
                  <div class="part-number">#${operation.MODEL || ''}</div>
                  <div class="part-code">${operation.workcenter_number || ''}</div>
                </div>
                <div class="part-category">${operation.PARTTYPE || ''} / ${operation.SUBCATEGORY || ''}</div>
                <div class="part-description">${operation.DESCRIPTION || ''}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Launch Puppeteer with proper configuration
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Set viewport and content
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      });

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Generate PDF with precise settings
      const pdfBuffer = await page.pdf({
        format: 'Letter',
        margin: {
          top: '40px',
          bottom: '40px',
          left: '40px',
          right: '40px'
        },
        printBackground: true,
        displayHeaderFooter: false,
        scale: 1,
        preferCSSPageSize: true
      });

      // Set response headers
      setHeaders(event, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Parts_List.pdf"',
        'Content-Length': pdfBuffer.length,
        'Cache-Control': 'no-cache'
      });

      return pdfBuffer;

    } finally {
      await browser.close();
    }

  } catch (error) {
    console.error('Error generating PDF:', error);
    setResponseStatus(event, 500);
    return {
      error: 'Failed to generate PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
});
