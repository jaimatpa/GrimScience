import { format } from "date-fns";
import puppeteer from "puppeteer";
import {
  SkillExistById,
  getSkillReportData
} from "~/server/controller/skills";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;
    const idExist = await SkillExistById(id);
    switch (method) {
      case "GET":

        if(!idExist){
          setResponseStatus(event, 404);
          return { error: 'The skill does not exist' }
        }
    
        const reportData = await getSkillReportData(id)
        
        let htmlContent = "";
        if (reportData) {
          htmlContent += `
          <body style="font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center; color: #2c3e50;">Skill Report</h1>
            
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Category:</div>
                <div style="width: 70%;">${reportData.skill.Catagory}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Date:</div>
                <div style="width: 70%;">${new Date(reportData.skill.date).toLocaleDateString()}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Sub Category:</div>
                <div style="width: 70%;">${reportData.skill.subcatagory}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">By:</div>
                <div style="width: 70%;">${reportData.skill.by || 'N/A'}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Frequency:</div>
                <div style="width: 70%;">${reportData.skill.frequency}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Weeks:</div>
                <div style="width: 70%;">${reportData.skill.weeks}</div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div style="font-weight: bold; width: 30%;">Skill:</div>
                <div style="width: 70%;">${reportData.skill.Name}</div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px;">Training Procedure:</div>
              <div></div>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px;">Work Centers:</div>
              <ul style="margin: 0; padding-left: 20px;">
                ${reportData.workCenters.map(wc => `<li>${wc}</li>`).join('')}
              </ul>
            </div>

            <div style="margin-bottom: 20px;">
              <div style="font-weight: bold; margin-bottom: 10px;">Related Parts:</div>
              <ul style="margin: 0; padding-left: 20px;">
                ${reportData.parts.map(part => `<li>${part}</li>`).join('')}
              </ul>
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
          "Content-Disposition": 'inline; filename="Skill Report.pdf"',
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