import { getComplaintDetail } from '~/server/controller/service';
import { getCustomerDetail } from '~/server/controller/customers';
import { getServiceOrderInvoices } from '~/server/controller/invoices';
import { getServiceReports } from '~/server/controller/service';
import { getParts } from '~/server/controller/materials';
import { getInvestigationsOfComplaint } from '~/server/controller/engineering';
import { format } from 'date-fns'; 
import puppeteer from 'puppeteer';
import type { _0 } from '#tailwind-config/theme/backdropBlur';

//const base64Image = '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'
const base64Image = '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'
export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id

    function escapeHTML(text) {
      const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    switch(method){
      case 'GET':
        const complaintDetail = await getComplaintDetail(id)        
        const customerID=  complaintDetail['CustomerID']
        const reviewedBy=  complaintDetail['ClosedOutBy'] ? complaintDetail['ClosedOutBy'] : "";
        const customerDetail = await getCustomerDetail(customerID)
        const serviceOrderInvoices = await getServiceOrderInvoices({COMPLAINTID: id})
        const serviceReports = await getServiceReports({COMPLAINTID: id})
        
        let totalWarrantyMaterialCost = 0
        let warrantyMaterials = []
        for(let i = 0; i < serviceReports.length; i++) {
          if(serviceReports[i].PARTS) {
            const tmp = serviceReports[i].PARTS.split('=')
            for(let j = 0; j < tmp.length; j++) {
              if(tmp[j] !== '' && j % 3 === 0) {
                const tempPartsDetail = await getParts({UniqueID: tmp[j]})
                warrantyMaterials.push({...tempPartsDetail[0], Quantity: tmp[j+1]??0, Amount: Number.parseFloat(tempPartsDetail[0]['PRIMARYPRICE1'] || 0) * (Number.parseFloat(tmp[j+1]) || 0)})
                console.log(warrantyMaterials)
              }
            }
          }
        }
        totalWarrantyMaterialCost = warrantyMaterials.reduce((sum, item) => sum + parseFloat(item.Amount), 0).toFixed(2);
        const shippingCost = 35.30;

        let totalCost = Number(totalWarrantyMaterialCost) + shippingCost;

        let receievedParts = []
        for(let i = 0; i < serviceReports.length; i++) {
          if(serviceReports[i].PARTSRECEIVED) {
            const tmp = serviceReports[i].PARTSRECEIVED.split('=')
            for(let j = 0; j < tmp.length; j++) {
              if(tmp[j] !== '' && j % 3 === 0) {
                const tempPartsDetail = await getParts({UniqueID: tmp[j]})
                // Ensure tempPartsDetail is not empty and has at least one element
                if (tempPartsDetail.length > 0 && tempPartsDetail[0]) {
                  // Access PRIMARYPRICE1 safely with default value 0
                  const primaryPrice = Number.parseFloat(tempPartsDetail[0]['PRIMARYPRICE1']) || 0;
                  const quantity = Number.parseFloat(tmp[j + 1]) || 0;

                  // Compute Amount
                  const amount = primaryPrice * quantity;

                  // Push to receievedParts with safety checks
                  receievedParts.push({
                      ...tempPartsDetail[0],
                      Quantity: quantity,
                      Amount: amount
                  });
                } else {
                  console.error("tempPartsDetail is empty or undefined.");
                }
                // receievedParts.push({...tempPartsDetail[0], Quantity: tmp[j+1]??0, Amount: Number.parseFloat(tempPartsDetail[0]['PRIMARYPRICE1'] || 0) * (Number.parseFloat(tmp[j+1]) || 0)})
              } 
            }
          }
        }
        const investigations = await getInvestigationsOfComplaint({ComplaintID: id})
        
        const serviceOrderInvoiceSummary = {
          OnsiteHours: 0,
          TravelHours: 0,
          FactoryHours: 0,
          Miles: 0,
          PerDiem: 0,
          performsnotext: ''
        }
        serviceReports.forEach((invoice) => {
          serviceOrderInvoiceSummary.TravelHours += invoice['TravelHours']??0
          serviceOrderInvoiceSummary.FactoryHours += invoice['FactoryHours']??0
          serviceOrderInvoiceSummary.Miles += invoice['Miles']??0
          serviceOrderInvoiceSummary.PerDiem += invoice['PerDiem']??0
          serviceOrderInvoiceSummary.performsnotext += invoice['performsnotext']??0
          serviceOrderInvoiceSummary.OnsiteHours += invoice['OnsiteHours']??0
        })
        let htmlContent = ''
        htmlContent += `
          <body style="font-family: Arial; font-size: 14px; margin: 0;">
            <header style="border-bottom: 3px solid black;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="flex justify-center items-center">
                <img style="width: 110px;" src="data:image/png;base64,${base64Image}" alt="Grimm Avatar" />
              </div>
                <h3 style="font-size: 20px;">Customer Service Order</h3>
                <div style="width:250px;">
                  <p style="margin-left: -30px;">Warranty</p>
                  <p><b>#:</b>${complaintDetail['COMPLAINTNUMBER']} <b style="margin-left:50px;">Date:</b> ${complaintDetail['COMPALINTDATE']?format(complaintDetail['COMPALINTDATE'], 'MM/dd/yyyy'):''}</p>
                </div>
              </div>
              <div>
                <div>
                  <div style="display:flex; justify-content: space-between; margin-top: -5px;">
                    <p style="width:250px; margin-top: 0px;"><b>Serial #:</b> ${complaintDetail['SERIALNO']}</p>  
                    <p style="width:250px; margin-top: 0px;"><b>Shipped:</b> ${complaintDetail['ORIGSHIPDATE']?format(complaintDetail['ORIGSHIPDATE'], 'MM/dd/yyyy'):''}</p>  
                    <p style="width:250px; margin-top: 0px; margin-left: -55px"><b>Warranty:</b> ${complaintDetail['WarrentyService']==='0'?'No':'Yes'}</p>  
                  </div>
                  <div style="display:flex; justify-content: space-between; margin-top: -10px;">
                    <p style="width:250px; margin-top: 0px;"><b>By #:</b> ${complaintDetail['RECBY']}</p>  
                    <p style="width:250px; margin-top: 0px;"><b>Status:</b> ${complaintDetail['WarrentyService']===0?'Open':'Closed'}</p>
                  </div>
                  <div style="display:flex; justify-content: flex-end; margin-top: -10px;">
                    <p style="width:250px; margin-top: 0px;"><b>Valid Complaint:</b> ${complaintDetail['ValidComplaint']===0?'No':'Yes'}</p>
                  </div>
                </div>
              </div>
              <h4 style="margin: -10px 0px 10px -110px;"><center>${complaintDetail['PRODUCTDESC']}</center></h4>
            </header>`
        htmlContent += `
          <div>
            <div style="display: flex; flex-direction: row;">
              <div style="flex-basis: 50%;">
                <p><b style="border-bottom: 2px solid black">Customer (Ship To)</b></p>
                <p style="margin-top: 4px; margin-bottom: 4px">Customer#: ${customerDetail['number']}</p>
                <p style="margin-top: 4px; margin-bottom: 4px">${customerDetail['company1']}</p>
                <p style="margin-top: 4px; margin-bottom: 4px">${customerDetail['fname']} ${customerDetail['lname']}</p>
                <p style="margin-top: 4px; margin-bottom: 4px">${customerDetail['address']}</p>
                <p style="margin-top: 4px; margin-bottom: 4px">${customerDetail['city']}, ${customerDetail['state']} ${customerDetail['zip']}</p>
              </div> 
              <div style="flex-basis: 50%;">
                <p><b style="border-bottom: 2px solid black">Customer Description</b></p>
                <p style="margin-top: 4px; margin-bottom: 4px"><b>Patient Injury:</b> ${complaintDetail['INJURYREPORTNO'] === 0 ?'No':'Yes'}</p>
                <p style="margin-top: 4px; margin-bottom: 4px">${complaintDetail['COMPLAINT']}</p>
              </div>
            </div>`
        htmlContent += `
          <div style="display: flex; padding-left: 50%; margin-top: -14px">
            <div style="flex-basis: 50%">
              <div style="display: flex; flex-direction: row">
                <p><b style="border-bottom: 2px solid black; font-size: 13px;">Received</b></p>
                <p style="margin-left: 80px;"><b style="border-bottom: 2px solid black; font-size: 13px;">Accessories</b></p>
              </div>
            </div>
          </div>`
        htmlContent += `
          <div style="margin-top: -20px">
            <p style="font-size: 13px; margin-top: 4px; margin-bottom: 4px"><b>W:</b> ${customerDetail['workphone']}</p>
            <p style="font-size: 13px; margin-top: 4px; margin-bottom: 4px"><b>C:</b> ${customerDetail['homephone']}</p>
            <p style="font-size: 13px; margin-top: 4px; margin-bottom: 4px"><b>H:</b> ${customerDetail['cellphone']}</p>
          </div>
              `
        htmlContent += `    
          <div style="display: flex; padding-left: 50%; margin-top: -20px">
            <div style="flex-basis: 50%">
              <p><b style="border-bottom: 2px solid black; font-size: 13px">Failure Investigation</b></p>
              <p>${complaintDetail['FAILINVEST']}</p>
            </div>
          </div>`
        htmlContent += `
          <table>
            <thead style="background: #FFFACD;">
              <tr>
                <th width="500px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Invoice #: </span><span style="font-weight: normal; margin-left: 20px;">${serviceOrderInvoices.length?serviceOrderInvoices[0]['invoicenumber']:'' }</span></th>
                <th width="400px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Onsite Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Travel Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Factory Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Miles</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black; font-size: 13px;">Per Diem</span></th>
              </tr>
            </thead>
            <tbody>        
              <tr>
                <td></td>
                <td style="font-size: 13px;">${serviceOrderInvoiceSummary.OnsiteHours}</td>
                <td style="font-size: 13px;">${serviceOrderInvoiceSummary.TravelHours}</td>
                <td style="font-size: 13px;">${serviceOrderInvoiceSummary.FactoryHours}</td>
                <td style="font-size: 13px;">${serviceOrderInvoiceSummary.Miles}</td>
                <td style="font-size: 13px;">${serviceOrderInvoiceSummary.PerDiem}</td>
              </tr>
            </tbody>
          </table>`
        htmlContent += `
          <p style="margin-top: 30px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Service Reports</b></p>
          <table style="border-spacing: 0px;">
            <thead>
              <tr>
                <th width="200px" style="text-align: left; font-size: 13px;">Date</th>
                <th width="200px" style="text-align: left; font-size: 13px;">Type</th>
                <th width="400px" style="text-align: left; font-size: 13px;">By</th>
                <th width="1084px" style="text-align: left; font-size: 13px;">Repairs Made</th>
              </tr>
            </thead>
            <tbody>`
        serviceReports.forEach((report) => {
          let type;
          switch(report['REPAIRDESC']) {
            case 0:
              type = "Customer"
              break;
            case 1: 
              type = "Factory Service"
              break;
            default: 
              type = "Field Service"
          }
          htmlContent += `
            <tr>
              <td style="font-size: 13px;">${report['REPAIRDATE']}</td>
              <td style="font-size: 13px;">${type}</td>
              <td style="font-size: 13px;">${report['REPAIRSBY']??''}</td>
              <td style="font-size: 13px;">${report['REPAIRSMADE']??''}</td>
            </tr>`
        })
        htmlContent += `
              <tr style="margin-top: 20px;">
                <td style="font-size: 13px;"><b>To Spec?</b><br/></td>
                <td style="font-size: 13px;"><b>No</b><br/></td>
                <td></td>
                <td style="font-size: 13px;"><b>Comment</b>
                <br/>
                ${serviceOrderInvoiceSummary.performsnotext}
                </td>
              </tr>
            </tbody>
          </table>`
        htmlContent += `
          <p style="margin-top: 30px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Warranty Materials</b></p>
          <table style="border-spacing: 0px;">
            <thead style="background: #FFFACD;">
              <tr>
                <th width="110px" style="text-align: left; font-size: 13px;">Quantity</th>
                <th width="110px" style="text-align: left; font-size: 13px;">Stock#</th>
                <th width="550px" style="text-align: left; font-size: 13px;">Description</th>
                <th width="170px" style="text-align: left; font-size: 13px;">Price</th>
                <th width="260px" style="text-align: left; font-size: 13px;">Unit</th>
                <th width="150px" style="text-align: left; font-size: 13px;">Amount</th>
              </tr>
            </thead>
            <tbody>`
          warrantyMaterials.forEach((material) => {
            htmlContent += `
              <tr>
                <td style="font-size: 13px;">${material['Quantity']}</td>
                <td style="font-size: 13px;">${material['MODEL']}</td>
                <td style="font-size: 13px;">${material['DESCRIPTION']}</td>
                <td style="font-size: 13px;">${material['PRIMARYPRICE1']}</td>
                <td style="font-size: 13px;">${material['UNIT']}</td>
                <td style="font-size: 13px;">${material['Amount']}</td>
              </tr>`
          })
          htmlContent += `
              </tbody>
            </table>` 
            if (totalWarrantyMaterialCost > 0) {
              htmlContent += `
                  <div style="display:flex;justify-content: flex-end; margin-right: 40px; margin-top: 20px">
                      <div>
                          <div style="display:flex;flex-direction:column; text-align: right;">
                              <div style="display: flex; width: 180px; justify-content: space-between;">
                                  <span>Total Material Cost:</span>
                                  <span><b>$${totalWarrantyMaterialCost}</b></span>
                              </div>
                              <div style="display: flex; width: 180px; justify-content: space-between;">
                                  <span>Shipping Cost:</span>
                                  <span><b>$35.30</b></span>
                              </div>
                              <div style="display: flex; width: 180px; justify-content: space-between;">
                                  <span>Total:</span>
                                  <span><b>$${totalCost.toFixed(2)}</b></span>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
          }
          htmlContent += `   
            <p style="margin-top: 10px; margin-bottom: 10px"><b style="border-bottom: 2px solid black; font-size: 14px;">Materials Received</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFFACD;">
                <tr>
                  <th width="200px" style="text-align: left; font-size: 13px;">Quantity</th>
                  <th width="200px" style="text-align: left; font-size: 13px;">Stock#</th>
                  <th width="1478px" style="text-align: left; font-size: 13px;">Description</th>
                </tr>
              </thead>
              <tbody>`
          receievedParts.forEach((material) => {
            htmlContent += `
              <tr>
                <td style="font-size: 13px;">${material['Quantity']}</td>
                <td style="font-size: 13px;">${material['MODEL']}</td>
                <td style="font-size: 13px;">${material['DESCRIPTION']}</td>
                <td style="font-size: 13px;"></td>
              </tr>`
          })
          htmlContent += `
              </tbody>
            </table>` 
          htmlContent += `
            <p style="margin-top: 10px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Action</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFFACD;">
                <tr>
                  <th width="200px" style="text-align: left; font-size: 13px;">Date</th>
                  <th width="200px" style="text-align: left; font-size: 13px;">Type</th>
                  <th width="1478px" style="text-align: left; font-size: 13px;">Description</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>`
          htmlContent += `
            <p style="margin-top: 10px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Investigations</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFFACD;">
                <tr>
                  <th width="200px" style="text-align: left; font-size: 13px;">Date</th>
                  <th width="200px" style="text-align: left; font-size: 13px;">Type</th>
                  <th width="1478px" style="text-align: left; font-size: 13px;">Description</th>
                </tr>
              </thead>
              <tbody>`
          investigations.forEach((investigation) => {
            htmlContent += `
              <tr>
                <td>${investigation['DIAGDATE']}</td>
                <td>${investigation['ACTIONTYPE']??''}</td>
                <td>${investigation['DESCRIPTION']}</td>
              </tr>
            `
          })
          htmlContent += `
                  </tbody>
                </table>`
          if (reviewedBy) {
              htmlContent += `
                <h4 style="margin: 40px 0px"><center>${escapeHTML(reviewedBy)}</center></h4>
                </div>  
            </body>`;
          }

        const browser = await puppeteer.launch();
        const page = await browser.newPage(); 

        const pdfOptions: any = {
          path: 'Complaints.pdf',
          format: 'letter',
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: `<span></span>`,
          footerTemplate: `
          <div style="width: 100%; font-family: arial; text-align: center; font-size: 16px; position: relative;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>`,
          margin: {
            top: '40px',
            bottom: '40px',
            left: '40px',
            right: '40px'
          }
        };
        await page.setContent(htmlContent, {waitUntil: 'domcontentloaded'});

        const pdfBuffer = await page.pdf(pdfOptions);
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