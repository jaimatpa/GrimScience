import { format } from 'date-fns'
import puppeteer from 'puppeteer'
import { getInvestigationDetail } from "~/server/controller/engineering/Investigations";

export default eventHandler(async (event) => {
  try {
    const method = event._method
    const id = event.context.params.id

    switch (method) {
      case 'GET':
            // const data = await getOperationReportData(id)
            
            const investigationDetail = await getInvestigationDetail(id);

        let htmlContent = ''
            if (investigationDetail) {
            
            console.log('investigationDetail', investigationDetail)
            htmlContent += `
<div style="font-family: Arial, sans-serif; line-height: 1.2; margin: 0; padding: 10px;">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid black; padding-bottom: 5px; margin-bottom: 10px;">
        <div style="display: flex; align-items: center;">
            <span style="font-size: 24px; font-weight: bold;">Grimm</span>
            <span style="font-size: 24px; font-weight: bold; margin-left: 5px;">Investigation Report</span>
        </div>
        <div style="font-weight: bold;">#: ${investigationDetail.PANO}</div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <h3><strong>Product Line </strong>&nbsp;&nbsp;&nbsp;${investigationDetail.PRODLINE}</h3>
        <h3><strong>Date</strong> ${investigationDetail.DIAGDATE ? format(investigationDetail.DIAGDATE, "MM/dd/yyyy") : ""}</h3>
    </div>

    <div style="margin-bottom: 30px;">
        <div style="font-weight: bold;">Definition:</div>
        <h3>${investigationDetail.DESCRIPTION}</h3>
    </div>

    <div style="margin-bottom: 30px;">
        <div style="font-weight: bold; margin-bottom: 10px;">Investigation:</div>
        <div>${investigationDetail.PREVENTPROB}</div>
    </div>

    <div>
        <div style="font-weight: bold; margin-bottom: 10px;">Root Cause:</div>
        <div>${investigationDetail.PROBLEMDIAG}</div>
    </div>
</div>`;

            
        }

        const browser = await puppeteer.launch({ headless: 'shell' })
        const page = await browser.newPage()

        const pdfOptions: any = {
          path: 'Operation.pdf',
          format: 'letter',
          margin: {
            top: '40px',
            bottom: '40px',
            left: '40px',
            right: '40px'
          }
        }
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })

        const pdfBuffer = await page.pdf(pdfOptions)
        await browser.close()
        setHeaders(event, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Investigation-Report.pdf"',
          'Page-Size': 'Letter'
        })
        return pdfBuffer
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})
