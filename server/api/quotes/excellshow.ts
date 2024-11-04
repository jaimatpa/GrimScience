// server/api/quotes/excellshow.post.ts  (Note: changed to .post.ts since we're using POST)

import { eventHandler } from "h3";
import ExcelJS from "exceljs";
import { exportQuotesData } from "~/server/controller/quotes/quotes";
import { format, isValid, parse } from "date-fns";

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const statusMappings = {
      quotePending: "Quote Pending",
      open: "Open",
      closed: "Closed",
      orderPending: "Order Pending",
      booked: "Booked",
    };

    const statusFilters = body.statusFilters
      ? body.statusFilters.map((filter) => statusMappings[filter])
      : [];

    const params = {
      ...body,
      statusFilters,
      filterDate: body.filterDate === true || body.filterDate === "true",
      startDate: body.startDate || null,
      endDate: body.endDate || null,
    };

    const data = await exportQuotesData(params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Quotes");

    worksheet.columns = [
      { header: "Date", key: "invoicedate", width: 15 },
      { header: "Quote #", key: "quotenumber", width: 12 },
      { header: "Source", key: "source", width: 15 },
      { header: "Source Desc.", key: "sourcedescription", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Product Line", key: "productline", width: 20 },
      { header: "Customer #", key: "customerNumber", width: 12 },
      { header: "Customer", key: "customerName", width: 25 },
      { header: "Company", key: "company1", width: 30 },
      { header: "Expiration", key: "expirationdate", width: 15 },
      { header: "Est. Book", key: "EstimatedBooking", width: 15 },
      { header: "Est. Ship", key: "Estimatedship", width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Function to safely format date
    const formatDate = (dateStr: string) => {
      if (!dateStr || dateStr.trim() === "" || dateStr === " ") return "";

      try {
        // Try parsing date with different formats
        let date;
        if (dateStr.includes("/")) {
          // For dates like "2/4/2016"
          date = parse(dateStr, "M/d/yyyy", new Date());
        } else {
          // Try as ISO string
          date = new Date(dateStr);
        }

        return isValid(date) ? format(date, "MM/dd/yyyy") : "";
      } catch {
        return "";
      }
    };

    // Add data and format dates
    data.forEach((row) => {
      worksheet.addRow({
        invoicedate: formatDate(row.invoicedate),
        quotenumber: row.quotenumber || "",
        source: row.source || "",
        sourcedescription: row.sourcedescription || "",
        status: row.status || "",
        productline: row.productline || "",
        customerNumber: row.customerNumber || "",
        customerName: row.customerName || "",
        company1: row.company1 || "",
        expirationdate: formatDate(row.expirationdate),
        EstimatedBooking: formatDate(row.EstimatedBooking),
        Estimatedship: formatDate(row.Estimatedship),
      });
    });

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = column.width || 15;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    setHeaders(event, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="Quotes_Export.xlsx"',
      "Cache-Control": "no-cache",
    });

    return buffer;
  } catch (error) {
    console.error("Export error:", error);

    return createError({
      statusCode: 500,
      message: error.message || "Failed to export data",
      stack: "",
    });
  }
});
