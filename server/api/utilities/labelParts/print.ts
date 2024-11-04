
import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";
import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import path from 'path';

interface PrintLabel {
  stock: string;
  description: string;
  workCenter: string;
  category: string;
  coordinates: {
    x: number;
    y: number;
  };
}

const generateHtml = (labels: PrintLabel[]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 8.5in;
      height: 11in;
    }
    .label {
      position: absolute;
      font-family: Arial, sans-serif;
      font-size: 10pt;
    }
    .stock {
      font-weight: bold;
    }
    .workCenter {
      margin-top: 2px;
    }
    .description {
      margin-top: 2px;
      font-size: 9pt;
    }
    .category {
      margin-top: 2px;
      font-size: 8pt;
      color: #666;
    }
  </style>
</head>
<body>
  ${labels.map(label => `
    <div class="label" style="left: ${label.coordinates.x}px; top: ${label.coordinates.y}px;">
      <div class="stock">#${label.stock}</div>
      <div class="workCenter">${label.workCenter}</div>
      <div class="description">${label.description}</div>
      <div class="category">${label.category}</div>
    </div>
  `).join('')}
</body>
</html>
`;

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { labels, startPosition } = body;

    if (!labels?.length) {
      return {
        statusCode: 400,
        body: { error: 'No labels provided for printing' }
      };
    }

    // Create temporary files
    const timestamp = Date.now();
    const tempDir = path.join(process.cwd(), 'tmp');
    const htmlPath = path.join(tempDir, `labels-${timestamp}.html`);
    const pdfPath = path.join(tempDir, `labels-${timestamp}.pdf`);

    await fs.mkdir(tempDir, { recursive: true });

    // Generate and save HTML
    const html = generateHtml(labels);
    await fs.writeFile(htmlPath, html);

    // Generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true
    });

    await browser.close();

    // Read PDF and clean up
    const pdfBuffer = await fs.readFile(pdfPath);
    await Promise.all([
      fs.unlink(htmlPath),
      fs.unlink(pdfPath)
    ]);

    // Log print job using SQL Server timestamp
    await sequelize.query(`
      INSERT INTO tblPrintLog (
        printTimestamp,
        userID,
        labelCount,
        startPosition
      ) VALUES (
        GETDATE(),
        :userID,
        :labelCount,
        :startPosition
      );
    `, {
      type: QueryTypes.INSERT,
      replacements: {
        userID: event.context.user?.id || null,
        labelCount: labels.length,
        startPosition
      }
    });

    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(event, 'Content-Disposition', 'attachment; filename=labels.pdf');

    return {
      statusCode: 200,
      body: pdfBuffer
    };

  } catch (error) {
    console.error('Error generating labels:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    };
  }
});