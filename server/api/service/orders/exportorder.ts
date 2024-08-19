import ExcelJS from 'exceljs'
import { getAllServiceOrders } from '~/server/controller/service';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await getAllServiceOrders(sortBy, sortOrder, filterParams);

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [ 
      { header: 'SO#', key: 'COMPLAINTNUMBER', width: 10 },
      { header: 'Serial#', key: 'SERIALNO', width: 32 },
      { header: 'Date', key: 'COMPLAINTDATE', width: 32 },
      { header: 'Failutre Comment', key: 'FAILINVEST', width: 32 },
      { header: 'Company', key: 'company1', width: 32 },
      { header: 'Status', key: 'Status', width: 32 },
      { header: 'Injury', key: 'INJURYREPORTNO', width: 32 },
      { header: 'Warranty', key: 'Warranty', width: 32 },
    ];
    list.forEach(row => {
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