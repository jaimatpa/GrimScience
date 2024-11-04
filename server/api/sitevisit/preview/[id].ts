import { eventHandler } from "h3";
import puppeteer from "puppeteer";
import { format } from "date-fns";
import { base64Imag } from "./baseImg";
import { getSiteVisitForPreview } from "~/server/controller/sitevisit";

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const data = await getSiteVisitForPreview(id);

    if (!data || !data.siteVisit) {
      setResponseStatus(event, 404);
      return { error: "No data found for the given ID." };
    }

    const siteVisit = data.siteVisit;

    //   <div style="margin-bottom: 3px;">
    //   <span style="font-weight: bold;">Territory:</span> ${
    //     siteVisit.Territory || ""
    //   }
    // </div>

    // Generate HTML content
    let htmlContent = `
    <body style="font-family: Arial; max-width: 1024px; margin: 0 auto;">
      <div style="margin-bottom: 15px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <img style="width: 100px; height: 40px;" src="data:image/png;base64,${base64Imag}" alt="Company Logo" />
              <span style="font-size: 18px; font-weight: bold;">SITE VISIT</span>
            </div>
        <div style="display: flex; justify-content: space-between; align-items: start;">
       
          <div style="margin-left: 0;">
            <div style="margin-bottom: 3px;">
              <span style="font-weight: bold;">Product Line:</span> ${
                siteVisit.ProductLine || ""
              }
            </div>
            <div style="margin-bottom: 3px;">
              <span style="font-weight: bold;">By:</span> ${siteVisit.By || ""}
            </div>
          </div>

          <div style="text-align: right;">
            <div style="margin-bottom: 3px;">
              <span style="font-weight: bold;">Site Visit #:</span> ${
                siteVisit.VisitNumber || ""
              }
            </div>
            <div style="margin-bottom: 3px;">
              <span style="font-weight: bold;">Reason:</span> ${
                siteVisit.Reason || ""
              }
            </div>
          </div>
          
          <div style="text-align: right;">
            <div style="margin-bottom: 3px;">
              <span style="margin-left: 20px;">
                <span style="font-weight: bold;">Date:</span> ${format(
                  new Date(siteVisit.VisitDate || ""),
                  "M/d/yyyy"
                )}
              </span>
            </div>
            <div>
              <span style="font-weight: bold;">Status:</span> ${
                siteVisit.Status || ""
              }
            </div>
          </div>
        </div>
      </div>



      <hr style="border: none; border-top: 4px solid black; margin: 15px 0;">

      <div style="margin-top: 15px;">
        <div style="margin-bottom: 10px;">
          <span style="font-weight: bold; border-bottom: 2px solid black; display: inline-block;">Customer (Ship To)</span>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <div style="margin-left: 0;">
            <div><strong>#${siteVisit.Number}</strong></div>
            <div>${siteVisit.company1 || ""}</div>
            <div>${siteVisit.fname} ${siteVisit.lname}</div>
            <div>${siteVisit.position || ""}</div>
            <div>${siteVisit.address || ""}</div>
            <div>${siteVisit.city}, ${siteVisit.state} ${siteVisit.zip}</div>
            <div style="margin-top: 10px;">
              ${
                siteVisit.workphone
                  ? `<div><strong>W:</strong> ${siteVisit.workphone}</div>`
                  : ""
              }
              ${
                siteVisit.cellphone
                  ? `<div><strong>C:</strong> ${siteVisit.cellphone}</div>`
                  : ""
              }
              ${
                siteVisit.homephone
                  ? `<div><strong>H:</strong> ${siteVisit.homephone}</div>`
                  : ""
              }
            </div>
          </div>
          
          <div>
            <div style="margin-bottom: 8px;">
              <strong>Invoice #:</strong> ${siteVisit.InvoiceNumber || ""}
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Quote #:</strong> ${siteVisit.QuoteNumber || ""}
            </div>
            <div style="margin-bottom: 8px;">
              <strong>Complaint #:</strong> ${siteVisit.ComplaintNumber || ""}
            </div>
          </div>

          <div style="">
          </div>


        </div>
      </div>



      <div style="margin-top: 15px;">
        <div style="margin-bottom: 10px;">
          <span style="font-weight: bold; border-bottom: 2px solid black; display: inline-block;">Comments</span>
        </div>
        <div style="margin-top: 5px;">
          ${siteVisit.Comments || ""}
        </div>
      </div>
    </body>`;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const pdfOptions = {
      format: "letter",
      margin: {
        top: "40px",
        bottom: "40px",
        left: "40px",
        right: "40px",
      },
    };

    await page.setContent(htmlContent, { waitUntil: "networkidle2" });
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    // Set headers and return PDF
    setHeaders(event, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Site Visit Report.pdf"',
      "Page-Size": "Letter",
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw createError({
      statusCode: 500,
      message: `Error generating site visit PDF: ${error.message}`,
    });
  }
});
