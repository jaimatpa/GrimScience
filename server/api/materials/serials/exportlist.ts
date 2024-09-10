import ExcelJS from 'exceljs'
import { getAllSerials } from '~/server/controller/materials/serials'

const workbook = new ExcelJS.Workbook()

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event)
    const list = await getAllSerials(filterParams)

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
        { header: "Serial", key: "Serial", width: 10 },
        { header: "Model", key: "Model", width: 32 },
        { header: "Status", key: "Status", width: 32 },
        { header: "Customer", key: "CustomerDetails", width: 32 },
        { header: "Cust #", key: "CustomerNumber", width: 32 },
        { header: "Invoice #", key: "InvoiceNumber", width: 32 },
        { header: "Shipped", key: "ShipDate", width: 32 },
        { header: "Job #", key: "JobNumber", width: 32 },
    ];
    list.forEach((row) => {
      worksheet.addRow(row)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    setHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="export.xlsx"'
    })

    return buffer
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})
