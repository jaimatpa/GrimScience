import ExcelJS from 'exceljs'
import { getAllServiceOrders } from '~/server/controller/service/orders';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await getAllServiceOrders(sortBy, sortOrder, filterParams);

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
      { header: 'Number', key: 'UniqueID', width: 10 },
      { header: 'OrderDate', key: 'orderdate', width: 32 },
      { header: 'Status', key: 'status', width: 32 },
      { header: 'Warranty', key: 'warranty', width: 32 },
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