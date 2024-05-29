import { Op } from 'sequelize';
import { tblCustomers } from "~/server/models";
import ExcelJS from 'exceljs'

const workbook = new ExcelJS.Workbook();

const applyFilters = (params) => {
  const filterParams = ['number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  return whereClause;
};

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    let list: any;

    const whereClause = applyFilters(filterParams);

    list = await tblCustomers.findAll({
      attributes: ['UniqueID', 'number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'],
      where: whereClause,
      order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    });

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