import { defineEventHandler, readBody } from 'h3'
import { format } from 'date-fns'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { data: selected } = body;
  const labelHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Non-Conformance Label</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
          border: 2px solid #000;
        }
        .label-item {
          margin-bottom: 10px;
        }
        .label-item strong {
          font-weight: bold;
        }
        @media print {
          body {
            width: 4in;
            height: 2in;
          }
        }
      </style>
    </head>
    <body>
      <div class="label-item"><strong>BY:</strong> ${selected.ByEmployee || ''}</div>
      <div class="label-item"><strong>DATE:</strong> ${format(new Date(selected.DateTime || new Date()), 'MM/dd/yyyy')}</div>
      <div class="label-item"><strong>NC#:</strong> ${selected.uniqueID || ''}</div>
      <div class="label-item"><strong>SO/SR#:</strong> ${selected.SERVICEREPORT || ''}</div>
      <div class="label-item"><strong>PART/SN#:</strong> ${selected.SERIAL || ''}</div>
      <div class="label-item"><strong>STATUS:</strong> ${selected.STATUS || ''}</div>
      <div class="label-item"><strong>TO:</strong> ${selected.TAGASSIGNEDTO || ''}</div>
      <div class="label-item"><strong>LOCATION:</strong> ${selected.TAGLOCATION || ''}</div>
    </body>
    </html>
  `

  return labelHTML
})