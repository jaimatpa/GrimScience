import { getExcelSalesReport } from '~/server/controller/salesreport';
import ExcelJS from 'exceljs'

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { filterValues, startDate, endDate } = getQuery(event)
    const { results } = await getExcelSalesReport(filterValues, startDate.slice(1, -1), endDate.slice(1, -1))
  
    workbook.removeWorksheet('My Sheet')
    const worksheet = workbook.addWorksheet('My Sheer')
    worksheet.columns = [
      { header: 'Quote Date', key: '', width: 10 },
      { header: 'Order Date', key: 'orderdate', width: 32 },
      { header: 'Ship Date', key: 'shipdate', width: 32 },
      { header: 'Cust#', key: 'number', width: 32 },
      { header: 'Quote#', key: 'QuoteOrderNumber', width: 32 },
      { header: 'Invoice#', key: 'invoicenumber', width: 32 },
      { header: 'Source', key: 'source', width: 32 },
      { header: 'Source Description', key: 'sourcedescription', width: 32 },
      { header: 'Amount', key: 'SOLD', width: 32 },
      { header: 'Productline', key: 'Productline', width: 32 },
    ];
    results.forEach(row => {
      worksheet.addRow(row)
    });

    const buffer = await workbook.xlsx.writeBuffer();

    setHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="export.xlsx"'
    })

    return buffer;
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});