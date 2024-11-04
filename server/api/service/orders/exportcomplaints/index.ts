import { getAllComplaints } from '~/server/controller/service';
import puppeteer from 'puppeteer';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method) {
      case 'GET':
        const complaints = await getAllComplaints()
        let htmlContent = ''
        htmlContent += `
        	<div style="display: flex; flex-direction: column; justify-content: center; margin-top: 30px;">
            <h3>Complaints Summary</h3>
            <table>
              <thead>
                <th width="50" style="padding:2px 30px 2px 0; font-weight:700;">#</th>
                <th width="50" style="padding:2px 30px 2px 0; font-weight:700;">Status</th>
                <th width="70" style="padding:2px 30px 2px 0; font-weight:700;">Serial#</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Opend</th>
                <th width="500" style="padding:2px 30px 2px 0; font-weight:700;">Customer Description</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Reason</th>
                <th width="200" style="padding:2px 30px 2px 0; font-weight:700;">Actions</th>
              </thead>
              <tbody>`
        complaints.forEach((item) => {
          htmlContent += `
            <tr>
              <td width="50" style="padding:2px 30px 2px 0; text-align: right; vertical-align: top;">${item.COMPLAINTNUMBER}</td>
              <td width="50" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.Status}</td>
              <td width="70" style="padding:2px 30px 2px 0; text-align: right; vertical-align: top;">${item.SERIALNO}</td>
              <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item.COMPLAINTDATE}</td>
              <td width="500" style="padding:2px 30px 2px 0; text-align: right; ">
                <div style="text-align:left;">
                  <div>${item.cusomternumber}</div>
                  <div>${item.cusomterfname} ${item.cusomterlname}</div>
                  <div>${item.cusomtercompany1}</div>
                </div>
              </td>
              <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;">${item?.ValidComplaintReason ?? ''}</td>
              <td width="200" style="padding:2px 30px 2px 0; text-align: center; vertical-align: top;"></td>
            </tr>
          `
        })
        htmlContent += `
        			</tbody>
            </table>
          </div>
        `
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const pdfOptions: any = {
          path: 'Complaints.pdf',
          format: 'letter',
          landscape: true, // Set landscape orientation
          margin: {
            top: '40px',
            bottom: '40px',
            left: '40px',
            right: '40px'
          }
        };
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

        const pdfBuffer = await page.pdf(pdfOptions);
        console.log(pdfBuffer)
        await browser.close()
        setHeaders(event, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Orders Summary.pdf"',
          'Page-Size': 'Letter'
        })
        return pdfBuffer
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    console.log(error)
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});