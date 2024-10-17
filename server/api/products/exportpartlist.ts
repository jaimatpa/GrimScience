import { getProductPartList } from '~/server/controller/products';
import ExcelJS from 'exceljs'

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { id } = getQuery(event);
    const list = await getProductPartList(id)

    workbook.removeWorksheet('My sheet')
    const worksheet = workbook.addWorksheet('My sheet')
    worksheet.columns = [
      { header: 'Stock#', key: 'model', width: 10 },
      { header: 'Desc', key: 'description', width: 32 },
      { header: 'Qty', key: 'quantity', width: 32 },
      { header: 'Inv. Unit', key: 'inventoryunit', width: 32 },
      { header: 'Inv. Cost', key: 'inventorycost', width: 32 },
      { header: 'Total', key: 'totalCost', width: 32 },
      { header: 'Sub Ass Hrs', key: 'laborHours', width: 32 },
    ];
    list.forEach(row => {
      worksheet.addRow(row)
    });

    const buffer = await workbook.xlsx.writeBuffer();

    setHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Product parts listing.xlsx"'
    })

    return buffer;
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});