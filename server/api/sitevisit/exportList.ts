
import ExcelJS from "exceljs";
import { exportAllSiteVisits } from "~/server/controller/sitevisit";

const workbook = new ExcelJS.Workbook();

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const list = await exportAllSiteVisits(sortBy, sortOrder, filterParams);



    workbook.removeWorksheet("My sheet");
    const worksheet = workbook.addWorksheet("My sheet");
    worksheet.columns = [
      { header: "Date", key: "VisitDate", width: 32 },
      { header: "Reason", key: "Reason", width: 32 },
      { header: "Visit #", key: "VisitNumber", width: 32 },
      { header: "Product Line", key: "ProductLine", width: 32 },
      { header: "By", key: "By", width: 32 },
      { header: "Customer #", key: "Number", width: 32 },
      { header: "Company", key: "company1", width: 32 },
      { header: "City", key: "city", width: 32 },
      { header: "State", key: "CState", width: 32 },
      { header: "Status", key: "Status", width: 32 },
    ];
    list.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    setHeaders(event, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="export.xlsx"',
    });

    return buffer;
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
