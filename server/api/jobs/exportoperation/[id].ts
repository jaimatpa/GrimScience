import { format } from "date-fns";
import puppeteer from "puppeteer";
import type { _0 } from "#tailwind-config/theme/backdropBlur";
import {
  getAllOperation,
  getEmployeeOperationSchedules,
  getJobDetail,
  getJobOperationsById,
} from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch (method) {
      case "GET":
        const jobDetail = await getJobDetail(id);
        const jobId = await jobDetail["UniqueID"];
        const jobOperations = await getJobOperationsById({ JobID: jobId });

        // Function to fetch and merge schedules into jobOperations
        async function fetchAndMergeSchedules(jobOperations, jobId) {
          const promises = jobOperations.map(async (job) => {
            const schedule = await getEmployeeOperationSchedules({
              JobID: jobId,
              OperationID: job.UniqueID,
            });
            return { ...job, schedule };
          });
          return Promise.all(promises);
        }
        const updatedJobOperations = await fetchAndMergeSchedules(
          jobOperations,
          jobId
        );

        let htmlContent = "";
        htmlContent += `
        <body style="font-family: Arial, sans-serif; max-width: 1024px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between;">
              <div>
                  <h3 style="margin: 0;">${jobDetail["NUMBER"]}</h3>
              </div>
              <div style="width: 30%; text-align: center;">
                  <h3 style="margin: 0;">Qty ${jobDetail["QUANTITY"]}</h3>
              </div>
              <div style="width: 30%; text-align: right;">
                <h3 style="margin: 0;">#${jobDetail["MODEL"] ? jobDetail["MODEL"] : jobDetail["PART"]}</h3>
              </div>
          </div>`;

        updatedJobOperations.forEach((operation, index) => {
          htmlContent += `
            <h3 style="margin-top: 20px; margin-bottom: 0;">
                ${operation["WorkCenter"]}
            </h3>
            <div style="margin-top: 20px;">
              <h4 style="margin: 0;">
                ${index + 1}. ${operation["Operation"]}
              </h4>
              <ol style="margin-top: 0;">
                  <ol type="A" style="display: flex; flex-direction: column; gap: 10px; padding-top: 10px;">
                          <li>Select A System</li>
                          <li>Select The Configuration</li>
                          <li>Define Your Space</li>
                          <li>Select Options & Accessories</li>
                          <li>Formal Quotation</li>
                      </ol>
              </ol>
              <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                  <div style="display: inline-flex;">
                      <p style="margin: 0;">Prepared By:</p>
                      <p style="margin: 0;padding-left: 4px;">
                        ${jobDetail["ProductionBy"]}
                      </p>
                  </div>
                  <div style="width: 30%; text-align: center;display: inline-flex;">
                      <p style="margin: 0;">Approved By:</p>
                      <p style="margin: 0;padding-left: 4px;">#1 Joseph Grimm</p>
                  </div>
                  <div style="width: 30%; text-align: right;display: inline-flex;">
                      <p style="margin: 0;">Verified By:</p>
                      <p style="margin: 0;padding-left: 4px;">#1 Joseph Grimm</p>
                  </div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                  <div style="display: inline-flex;">
                      <p style="margin: 0;">Date:</p>
                      <p style="margin: 0; padding-left: 4px;">
                        ${jobDetail["ProductionDate"]
                          ? format(jobDetail["ProductionDate"], "MM/dd/yyyy")
                          : ""}
                      </p>
                  </div>
                  <div style="width: 30%; text-align: center;display: inline-flex;">
                      <p style="margin: 0;">Date:</p>
                      <p style="margin: 0; padding-left: 4px;">2/11/2020</p>
                  </div>
                  <div style="width: 30%; text-align: center;display: inline-flex;">
                      <p style="margin: 0;">Date:</p>
                      <p style="margin: 0; padding-left: 4px;">2/11/2020</p>
                  </div>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-top: 40px;">
                  <thead>
                      <tr>
                          <th style="border: 1px solid #000; padding: 8px; ">Date</th>
                          <th style="border: 1px solid #000; padding: 8px; ">Employee</th>
                          <th style="border: 1px solid #000; padding: 8px; ">Hours</th>
                      </tr>
                  </thead>`;
          operation.schedule.forEach(item => {
            htmlContent += `
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #000; padding: 8px;">
                                ${item["StartTime"]
                                ? format(item["StartTime"], "MM/dd/yyyy")
                                : ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 8px;">
                                ${item["employee"]}
                            </td>
                            <td style="border: 1px solid #000; padding: 8px;">
                                ${item["Hours"]}
                            </td>
                        </tr>`;
          });
          htmlContent += `    
                  </tbody>
              </table>
            </div>
          </body>
          `;
        });

        const browser = await puppeteer.launch({ headless: "shell" });
        const page = await browser.newPage();

        const pdfOptions: any = {
          path: "Operation.pdf",
          format: "letter",
          margin: {
            top: "40px",
            bottom: "40px",
            left: "40px",
            right: "40px",
          },
        };
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

        const pdfBuffer = await page.pdf(pdfOptions);
        await browser.close();
        setHeaders(event, {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="View Operation.pdf"',
          "Page-Size": "Letter",
        });
        return pdfBuffer;
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.log(error);
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
