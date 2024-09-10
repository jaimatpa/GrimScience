import { getAllCustomers } from '~/server/controller/customers';
import ExcelJS from 'exceljs'
import { getAllParts, getAllPartsExport, getParts } from '~/server/controller/materials';

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const {  page, pageSize, sortBy, sortOrder,...filterParams } = getQuery(event);
    const list = await getAllPartsExport( sortBy, sortOrder, filterParams);

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
      { header: 'Category', key: 'PARTTYPE', width: 10 },
      { header: 'Sub Category', key: 'SUBCATEGORY', width: 32 },
      { header: 'Stock#', key: 'MODEL', width: 32 },
      { header: 'DESCRIPTION', key: 'DESCRIPTION', width: 32 },
      { header: 'OnHand', key: 'OnHand', width: 32 },
      { header: 'WorkPhone', key: 'workphone', width: 32 },
      { header: 'ETL Critical Component', key: 'ETLCriticalComponent', width: 32 }
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