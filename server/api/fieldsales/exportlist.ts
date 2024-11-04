import { getFieldSales } from '~/server/controller/fieldsales';
import ExcelJS from 'exceljs'

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { filterValues } = getQuery(event)
    const { siteVisitResults,
      serviceReportResults,
      installationResults } = await getFieldSales(filterValues)
    const results = [...siteVisitResults,
      ...serviceReportResults,
      ...installationResults]
    workbook.removeWorksheet('My Sheet')
    const worksheet = workbook.addWorksheet('My Sheer')
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 10 },
      { header: 'Customer#', key: 'customer', width: 20 },
      { header: 'Company', key: 'company', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'By', key: 'by', width: 20 },
      { header: 'Site Visit#', key: 'siteVisit', width: 20 },
      { header: 'Complaint#', key: 'complaint', width: 20 },
      { header: 'Service Report#', key: 'serviceReport', width: 20 },
      { header: 'Installation#', key: 'installation', width: 20 },
      { header: 'Status', key: 'status', width: 20 },
    ];
    results.forEach(row => {
      worksheet.addRow(row)
    });

    const buffer = await workbook.xlsx.writeBuffer();

    setHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Field and Services.xlsx"'
    })

    return buffer;
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});