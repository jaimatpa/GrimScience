import { defineEventHandler } from 'h3'
import { format } from 'date-fns'
import puppeteer from 'puppeteer'
import { QueryTypes } from 'sequelize'
import sequelize from '~/server/utils/databse'

interface NonConformanceItem {
  NID: number
  SERIAL: string
  OpenClosed: string
  PARTS: string
  DISPOSITION: string
  TAGDATE: string
  TAGQTY: number
  TAGBY: string
  STATUS: string
  TAGASSIGNEDTO: string
  TAGLOCATION: string
  PONUM: string
  SERVICEREPORT: string
  COMPLAINTNUM: string
  ClosedDateTime: string | null
}


export default defineEventHandler(async (event) => {
  try {
    const rows = await sequelize.query(
      "Select tblNonConformance.UniqueID as NID, * from tblNonConformance inner join tblNonConformanceTags on tblNonConformanceTags.NonConformanceID = tblNonConformance.UniqueID Where tagdate > '12/31/2012' order by openclosed, NID",
      {
        type: QueryTypes.SELECT
      }
    ) as NonConformanceItem[]

    const data = rows.map(row => ({
      ...row,
      OpenClosed: row.ClosedDateTime ? 'Closed' : 'Open'
    }))

    const html = generateHTML(data)
    const pdf = await generatePDF(html)

    // event.node.res.setHeader('Content-Type', 'application/pdf')
    event.node.res.setHeader('Content-Disposition', 'attachment; filename=non-conformance-summary.pdf')

    return html
  } catch (error) {
    console.error('Error fetching data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching non-conformance data',
    })
  }
})

function generateHTML(data: NonConformanceItem[]): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Non-Conformance Summary</title>
  <style>
    body { 
      font-family: Arial, sans-serif;
      margin: 20px;
    }
    h1 {
      font-size: 18px;
      margin-bottom: 10px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 12px;
    }
    th, td { 
      border: 1px solid #000; 
      padding: 4px; 
      text-align: left; 
    }
    th { 
      background-color: #f2f2f2; 
      font-weight: bold;
    }
    .multi-header {
      border-bottom: none;
    }
    .sub-header {
      border-top: none;
    }
  </style>
</head>
<body>
  <h1>Non-Conformance Summary</h1>
  <table>
    <thead>
      <tr>
        <th rowspan="2">#</th>
        <th rowspan="2">Serial/Part #</th>
        <th rowspan="2">Opened/Closed</th>
        <th rowspan="2">Description</th>
        <th rowspan="2">Disposition</th>
        <th colspan="6" class="multi-header">Tag Entries</th>
      </tr>
      <tr class="sub-header">
        <th>Date</th>
        <th>Qty</th>
        <th>By</th>
        <th>Status</th>
        <th>Assigned To</th>
        <th>Location</th>
        <th>PO #</th>
        <th>Compl. #</th>
        <th>SR #</th>
      </tr>
    </thead>
    <tbody>
      ${data.map(item => `
        <tr>
          <td>${item.NID}</td>
          <td>${item.SERIAL || ''}</td>
          <td>${item.OpenClosed}</td>
          <td>${item.PARTS || ''}</td>
          <td>${item.DISPOSITION || ''}</td>
          <td>${item.TAGDATE ? format(new Date(item.TAGDATE), 'MM/dd/yyyy') : ''}</td>
          <td>${item.TAGQTY || ''}</td>
          <td>${item.TAGBY || ''}</td>
          <td>${item.STATUS || ''}</td>
          <td>${item.TAGASSIGNEDTO || ''}</td>
          <td>${item.TAGLOCATION || ''}</td>
          <td>${item.PONUM || ''}</td>
          <td>${item.COMPLAINTNUM || ''}</td>
          <td>${item.SERVICEREPORT || ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
`
}

async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdf = await page.pdf({ format: 'A4', landscape: true })
  await browser.close()
  return pdf
}