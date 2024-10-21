import { defineEventHandler, readBody, setHeader } from 'h3'
import puppeteer from 'puppeteer'
import { format as DateFormatter } from 'date-fns'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { selected } = body

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Non-Conformance Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #000;
          padding-bottom: 10px;
        }
        .logo-placeholder {
          width: 50px;
          height: 50px;
          background-color: #ccc;
          border-radius: 50%;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .info-item {
          margin-bottom: 5px;
        }
        .info-item strong {
          font-weight: bold;
        }
        .justification, .disposition {
          margin-top: 10px;
        }
        .progress {
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-placeholder"></div>
        <h1>Non-Conformance</h1>
        <div>
          <strong>#: ${selected.uniqueID}</strong><br>
          <strong>Opened/Closed:</strong> ${selected.OpenClosed || 'Open'}
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-item"><strong>Serial/Part#:</strong> ${selected.SERIAL || ''}</div>
        <div class="info-item"><strong>PO#:</strong> ${selected.PO || '0'}</div>
        <div class="info-item"><strong>Job#:</strong> ${selected.JobNum || '0'}</div>
        <div class="info-item"><strong>Investigation#:</strong> ${selected.InvestigationNum || '0'}</div>
        <div class="info-item"><strong>SO#:</strong> ${selected.COMPLAINTNUMBER || '0'}</div>
        <div class="info-item"><strong>SR#:</strong> ${selected.SERVICEREPORT || '0'}</div>
      </div>

      <div class="justification">
        <strong>Justification:</strong>
        <p>${selected.Justification || ''}</p>
      </div>

      <div class="disposition">
        <strong>Disposition:</strong>
        <p>${selected.DISPOSITION || ''}</p>
      </div>

      <div class="progress">
        <strong>Progress:</strong>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Qty</th>
              <th>By</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${DateFormatter(new Date(selected.DateTime || new Date()), 'MM/dd/yyyy')}</td>
              <td>${selected.Quantity || '1'}</td>
              <td>${selected.ByEmployee || ''}</td>
              <td>${selected.STATUS || ''}</td>
              <td>${selected.TAGASSIGNEDTO || ''}</td>
              <td>${selected.TAGLOCATION || ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `

  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdf = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename=NonConformance_${selected.uniqueID}.pdf`)
    return pdf
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generating PDF'
    })
  }
})