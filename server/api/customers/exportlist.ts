import { getAllCustomers } from '~/server/controller/customers';
import ExcelJS from 'exceljs'

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await getAllCustomers(sortBy, sortOrder, filterParams)

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
      { header: 'Number', key: 'number', width: 10 },
      { header: 'First', key: 'fname', width: 32 },
      { header: 'Last', key: 'lname', width: 32 },
      { header: 'Company', key: 'company1', width: 32 },
      { header: 'HomePhone', key: 'homephone', width: 32 },
      { header: 'WorkPhone', key: 'workphone', width: 32 },
      { header: 'State', key: 'state', width: 32 },
      { header: 'Zip', key: 'zip', width: 32 },
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