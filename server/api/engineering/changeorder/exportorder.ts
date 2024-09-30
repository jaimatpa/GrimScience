import ExcelJS from 'exceljs'
import { getAllChangeOrderData } from '~/server/controller/engineering/ChangOrder';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {

  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await getAllChangeOrderData(sortBy, sortOrder, filterParams);

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [ 
      { header: 'SO#', key: 'COMPLAINTNUMBER', width: 10 },
      { header: 'Serial#', key: 'uniqueID', width: 32 },
      { header: 'Date', key: 'COMPLAINTDATE', width: 32 },
      { header: 'DESCRIPTION ', key: 'DESCRIPTION', width: 32 },
      { header: 'PRODUCT', key: 'PRODUCT', width: 32 },
      { header: 'REASONFORCHANGE', key: 'REASONFORCHANGE', width: 32 },
      { header: 'DISTRIBUTIONDATE', key: 'DISTRIBUTIONDATE', width: 32 },
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