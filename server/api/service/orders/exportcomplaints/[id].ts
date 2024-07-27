import { getComplaintDetail } from '~/server/controller/service';
import { getCustomerDetail } from '~/server/controller/customers';
import { getServiceOrderInvoices } from '~/server/controller/invoices';
import { getServiceReports } from '~/server/controller/service';
import { getParts } from '~/server/controller/materials';
import { getInvestigationsOfComplaint } from '~/server/controller/engineering';
import { format } from 'date-fns'; 
import puppeteer from 'puppeteer';
import type { _0 } from '#tailwind-config/theme/backdropBlur';

const base64Image = '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'

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id

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
          htmlContent += `
                <h4 style="margin: 40px 0px"><center>${reviewedBy}</center></h4>
              </div>  
            </body>`

        const browser = await puppeteer.launch();
        const page = await browser.newPage(); 

        const pdfOptions: any = {
          path: 'Complaints.pdf',
          format: 'letter',
          printBackground: true,
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