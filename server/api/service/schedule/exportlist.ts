import ExcelJS from 'exceljs'
import { getAllSchedules } from '~/server/controller/service';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, filterValues } = getQuery(event);

    const list = await getAllSchedules(sortBy, sortOrder, filterValues)

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
      { header: 'SO#', key: 'SO#', width: 10 },
      { header: 'SO Status', key: 'SO Status', width: 14 },
      { header: 'SN#', key: 'SN#', width: 14 },
      { header: 'SO Date', key: 'SO Date', width: 14 },
      { header: 'Cust #', key: 'Cust #', width: 14 },
      { header: 'Company', key: 'Company', width: 32 },
      { header: 'city', key: 'city', width: 18 },
      { header: 'ST', key: 'ST', width: 10 },
      { header: 'SO Type', key: 'SO Type', width: 14 },
      { header: 'Failure Comment', key: 'Failure Comment', width: 32 },
      { header: 'SR#', key: 'SR#', width: 10 },
      { header: 'Status', key: 'Status', width: 14 },
      { header: 'Service Tech', key: 'Service Tech', width: 18 },
      { header: 'SR Date', key: 'SR Date', width: 14 },
      { header: 'Week', key: 'Week', width: 14 },
      { header: 'Invoice', key: 'Invoice', width: 32 },
      { header: 'REPAIRSMADE', key: 'REPAIRSMADE', width: 42 },
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