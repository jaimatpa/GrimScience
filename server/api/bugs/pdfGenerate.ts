import { getAllBugs } from "~/server/controller/bugs/Bug";
import puppeteer from "puppeteer";

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
        
    if (method.toUpperCase() === "GET") {
      const complaints = await getAllBugs(
        page,
        pageSize,
        sortBy,
        sortOrder,
        filterParams
      );

      let htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; margin-top: 30px;">
          <h3>Complaints Summary</h3>
          <table>
            <thead>
              <tr>
                <th width="60" style="padding:2px 30px 2px 0; font-weight:700;">Bug ID</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Date</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Form</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">By</th>
                <th width="500" style="padding:2px 30px 2px 0; font-weight:700;">Description</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Details</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Type</th>
                <th width="500" style="padding:2px 30px 2px 0; font-weight:700;">Cost</th>
                <th width="500" style="padding:2px 30px 2px 0; font-weight:700;">Approved</th>
              </tr>
            </thead>
            <tbody>
      `;

      complaints.forEach((item) => {
        htmlContent += `
          <tr>
            <td width="60" style="padding:2px 30px 2px 0; text-align: right; vertical-align: top;">${item.uniqueid}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.datea}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.formName}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.employee}</td>
            <td width="500" style="padding:2px 30px 2px 0; text-align: left; vertical-align: top;">${item.complaintText}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.descr}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.dvanceLevels}</td>
            <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.cost}</td>
            <td width="500" style="padding:2px 30px 2px 0; text-align: left; vertical-align: top;">${item.approved}</td>
          </tr>
        `;
      });

      htmlContent += `
            </tbody>
          </table>
        </div>
      `;

      const browser = await puppeteer.launch();
      const pdfPage = await browser.newPage();

      const pdfOptions = {
        format: "A4",
        landscape: true,
        margin: {
          top: "40px",
          bottom: "40px",
          left: "40px",
          right: "40px",
        },
      };

      await pdfPage.setContent(htmlContent, { waitUntil: "domcontentloaded" });

      const pdfBuffer = await pdfPage.pdf(pdfOptions);
      await browser.close();

      setHeaders(event, {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Bugs Summary.pdf"',
      });

      return pdfBuffer;
    } else {
      setResponseStatus(event, 405);
      return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error generating PDF: ${error.message}`,
    });
  }
});