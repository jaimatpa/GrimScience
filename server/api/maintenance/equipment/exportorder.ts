import ExcelJS from 'exceljs'
import { getAllEquipment } from '~/server/controller/maintenance/equipment';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {

  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await getAllEquipment(sortBy, sortOrder, filterParams);

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [ 
      { header: 'SO#', key: 'MANO', width: 10 },
      { header: 'CATAGORY#', key: 'CATAGORY', width: 32 },
      { header: 'SUBCATAGORY', key: 'SUBCATAGORY', width: 32 },
      { header: 'PART', key: 'PART', width: 32 },
      { header: 'SERIAL ', key: 'SERIAL', width: 32 },
      { header: 'PRODUCT', key: 'SERIAL', width: 32 },
     

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