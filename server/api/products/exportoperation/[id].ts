import { format } from "date-fns";
import puppeteer from "puppeteer";
import { 
  getOperationReportData
} from "~/server/controller/products";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch (method) {
      case "GET":
    
        const data = await getOperationReportData(id)

        const filteredData = data.filter(item => item.Number === 1);

        const reportData = Object.values(
          filteredData.reduce((acc, item) => {
            const { SID } = item;
            if (!acc[SID]) {
              acc[SID] = [];  // Initialize an array for each unique SID
            }
            acc[SID].push(item);  // Push the item into the corresponding SID group
            return acc;
          }, {})
        );
        
        let htmlContent = "";
        if(reportData.length !== 0){
          htmlContent += `
          <body style="font-family: Arial; max-width: 1024px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <h3 style="margin: 0;">Job #</h3>
                </div>
                <div style="width: 20%; text-align: center;">
                    <h3 style="margin: 0;">Qty 0</h3>
                </div>
                <div style="width: 50%; text-align: right;">
                  <h3 style="margin: 0;">${reportData[0][0]["PlanModel"]}</h3>
                </div>
            </div>`;
  
  
            htmlContent += `
              
              <h3 style="margin-top: 20px; margin-bottom: 0; border-bottom: 3px solid black">
                ${reportData[0][0]["WorkCenter"]}
              </h3>
              <h4>
                Operation
              </h4>
              <div style="margin-top: 20px; ;">
                <div style="display:flex; flex-direction: row; justify-content: space-between;">
                  <h4 style="margin: 0;">
                    ${1}. ${reportData[0][0]["Operation"]}
                  </h4>
                  <p style="margin: 0;">
                    ${reportData[0][0]["hours"]}
                    <b>Hrs.</b>
                  </p>
                </div>`
                
  
                reportData.forEach(step => {
                  htmlContent += `<p style="margin-top: 20px; margin-left: 20px;">

                  ${ String.fromCharCode(parseInt(step[0].Step) + 64)}. ${step[0]["StepDescription"]}
                </p>`
  
                if(step[0]["notes"]){
                  htmlContent += `<p style="margin-left: 20px;">
                    <b>Notes:</b> ${step[0]["notes"]}
                  </p>`;
                }
  
                if(step[0].model !== null){
  
                  htmlContent += `
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #000; padding: 8px; ">Stock #</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Description</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Key</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Qty.</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Job Qty.</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Unit</th>
                        </tr>
                    </thead>
                    <tbody>`;
                      step.forEach(item => {
                        htmlContent += `
                                    <tr>
                                    
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            ${item["model"]}
                                        </td>
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            ${item["BPDescription"]}
                                        </td>
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            ${item["Note"]}
                                        </td>
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            ${item["Qty"]}
                                        </td>
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            
                                        </td>
                                        <td style="border: 1px solid #000; padding: 8px;">
                                            ${item["InventoryUnit"]}
                                        </td>
                                    </tr>`;
                                    });
                                    htmlContent += `    
                                  </tbody>
                              </table>`
  
                }
               
  
                })
  
                htmlContent +=
                `<div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <div style="display: inline-flex;">
                        <p style="margin: 0;">Prepared By:</p>
                        <p style="margin: 0;padding-left: 4px;">
                          ${reportData[0][0]["PreparedBy"]}
                        </p>
                    </div>
                    <div style="width: 30%; text-align: center;display: inline-flex;">
                        <p style="margin: 0;">Approved By:</p>
                        <p style="margin: 0;padding-left: 4px;"> ${reportData[0][0]["ApprovedBy" || ""]}</p>
                    </div>
                    <div style="width: 30%; text-align: right;display: inline-flex;">
                        <p style="margin: 0;">Verified By:</p>
                        <p style="margin: 0;padding-left: 4px;"> ${reportData[0][0]["verifiedby"] || ""}</p>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <div style="display: inline-flex;">
                        <p style="margin: 0;">Date:</p>
                        <p style="margin: 0; padding-left: 4px;">
                          ${reportData[0][0]["PreparedDate"]
                            ? format(reportData[0][0]["PreparedDate"], "MM/dd/yyyy")
                            : ""}
                        </p>
                    </div>
                    <div style="width: 30%; text-align: center;display: inline-flex;">
                        <p style="margin: 0;">Date:</p>
                        <p style="margin: 0; padding-left: 4px;">
                          ${reportData[0][0]["ApprovedDate"]
                            ? format(reportData[0][0]["ApprovedDate"], "MM/dd/yyyy")
                            : ""}
                        </p>
                    </div>
                    <div style="width: 30%; text-align: center;display: inline-flex;">
                        <p style="margin: 0;">Date:</p>
                        <p style="margin: 0; padding-left: 4px;">
                          
                        </p>
                    </div>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-top: 40px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #000; padding: 8px; ">Date</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Employee</th>
                            <th style="border: 1px solid #000; padding: 8px; ">Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="border: 1px solid #000; padding: 8px;">
                            
                            </td>
                            <td style="border: 1px solid #000; padding: 8px;">
                              
                            </td>
                            <td style="border: 1px solid #000; padding: 8px;">
                        
                            </td>
                        </tr>
                    </tbody>
                </table>
              </div>
            </body>
            `;
        }


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
          "Content-Disposition": 'inline; filename="Operations Report.pdf"',
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