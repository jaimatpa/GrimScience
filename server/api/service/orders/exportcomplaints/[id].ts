import { getComplaintDetail } from '~/server/controller/service';
import { getCustomerDetail } from '~/server/controller/customers';
import { getServiceOrderInvoices } from '~/server/controller/invoices';
import { getServiceReports } from '~/server/controller/service';
import { getParts } from '~/server/controller/materials';
import { getInvestigationsOfComplaint } from '~/server/controller/engineering';
import { format } from 'date-fns'; 
import puppeteer from 'puppeteer';
import type { _0 } from '#tailwind-config/theme/backdropBlur';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id

    switch(method){
      case 'GET':
        const complaintDetail = await getComplaintDetail(id)
        const customerID=  complaintDetail['CustomerID']
        const customerDetail = await getCustomerDetail(customerID)
        const serviceOrderInvoices = await getServiceOrderInvoices({COMPLAINTID: id})
        const serviceReports = await getServiceReports({COMPLAINTID: id})
        
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
          <body style="font-family: Arial;">
            <header style="border-bottom: 3px solid black;">
              <div style="display:flex; justify-content:space-between;">
                <h3>Customer Service Order</h3>
                <div style="width:250px;">
                  <p style="margin-left: -30px;">Checkup</p>
                  <p><b>#:</b>${complaintDetail['COMPLAINTNUMBER']} <b style="margin-left:50px;">Date:</b> ${complaintDetail['COMPALINTDATE']?format(complaintDetail['COMPALINTDATE'], 'MM/dd/yyyy'):''}</p>
                </div>
              </div>
              <div>
                <div>
                  <div style="display:flex; justify-content: space-between;">
                    <p style="width:250px; margin-top: 0px;"><b>Serial #:</b> ${complaintDetail['SERIALNO']}</p>  
                    <p style="width:250px; margin-top: 0px;"><b>Shipped:</b> ${complaintDetail['ORIGSHIPDATE']?format(complaintDetail['ORIGSHIPDATE'], 'MM/dd/yyyy'):''}</p>  
                    <p style="width:250px; margin-top: 0px;"><b>Warranty:</b> ${complaintDetail['WarrentyService']==='0'?'No':'Yes'}</p>  
                  </div>
                  <div style="display:flex; justify-content: space-between;">
                    <p style="width:250px; margin-top: 0px;"><b>By #:</b> ${complaintDetail['RECBY']}</p>  
                    <p style="width:250px; margin-top: 0px;"><b>Status:</b> ${complaintDetail['WarrentyService']===0?'Open':'Closed'}</p>
                  </div>
                  <div style="display:flex; justify-content: flex-end;">
                    <p style="width:250px; margin-top: 0px;"><b>Valid Complaint:</b> ${complaintDetail['ValidComplaint']===0?'No':'Yes'}</p>
                  </div>
                </div>
              </div>
              <h4 style="margin: 6px 0px;"><center>${complaintDetail['PRODUCTDESC']}</center></h4>
            </header>`
        htmlContent += `
          <div>
            <div style="display: flex; flex-direction: row;">
              <div style="flex-basis: 50%;">
                <p><b style="border-bottom: 2px solid black">Customer (Ship To)</b></p>
                <p style="margin-top: 10px; margin-bottom: 10px">Customer#: ${customerDetail['number']}</p>
                <p style="margin-top: 10px; margin-bottom: 10px">${customerDetail['company1']}</p>
                <p style="margin-top: 10px; margin-bottom: 10px">${customerDetail['fname']} ${customerDetail['lname']}</p>
                <p style="margin-top: 10px; margin-bottom: 10px">${customerDetail['address']}</p>
                <p style="margin-top: 10px; margin-bottom: 10px">${customerDetail['city']}, ${customerDetail['state']} ${customerDetail['zip']}</p>
              </div> 
              <div style="flex-basis: 50%;">
                <p><b style="border-bottom: 2px solid black">Customer Description</b></p>
                <p style="margin-top: 10px; margin-bottom: 10px"><b>Patient Injury:</b> ${complaintDetail['INJURYREPORTNO'] === 0 ?'No':'Yes'}</p>
                <p style="margin-top: 10px; margin-bottom: 10px">${complaintDetail['COMPLAINT']}</p>
              </div>
            </div>`
        htmlContent += `
          <div style="display: flex; padding-left: 50%;">
            <div style="flex-basis: 50%">
              <div style="display: flex; flex-direction: row">
                <p><b style="border-bottom: 2px solid black">Received</b></p>
                <p style="margin-left: 80px;"><b style="border-bottom: 2px solid black">Accessories</b></p>
              </div>
            </div>
          </div>`
        htmlContent += `
          <div>
            <p style="margin-top: 10px; margin-bottom: 10px"><b>W:</b> ${customerDetail['workphone']}</p>
            <p style="margin-top: 10px; margin-bottom: 10px"><b>C:</b> ${customerDetail['homephone']}</p>
            <p style="margin-top: 10px; margin-bottom: 10px"><b>H:</b> ${customerDetail['cellphone']}</p>
          </div>
              `
        htmlContent += `    
          <div style="display: flex; padding-left: 50%;">
            <div style="flex-basis: 50%">
              <p><b style="border-bottom: 2px solid black">Failure Investigation</b></p>
              <p>${complaintDetail['FAILINVEST']}</p>
            </div>
          </div>`
        htmlContent += `
          <table>
            <thead>
              <tr>
                <th width="500px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Invoice #: </span><span style="font-weight: normal; margin-left: 20px;">${serviceOrderInvoices.length?serviceOrderInvoices[0]['invoicenumber']:'' }</span></th>
                <th width="400px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Onsite Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Travel Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Factory Hrs.</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Miles</span></th>
                <th width="200px" style="text-align: left;"><span style="border-bottom: 2px solid black;">Per Diem</span></th>
              </tr>
            </thead>
            <tbody>        
              <tr>
                <td></td>
                <td>${serviceOrderInvoiceSummary.OnsiteHours}</td>
                <td>${serviceOrderInvoiceSummary.TravelHours}</td>
                <td>${serviceOrderInvoiceSummary.FactoryHours}</td>
                <td>${serviceOrderInvoiceSummary.Miles}</td>
                <td>${serviceOrderInvoiceSummary.PerDiem}</td>
              </tr>
            </tbody>
          </table>`
        htmlContent += `
          <p style="margin-top: 40px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Service Reports</b></p>
          <table style="border-spacing: 0px;">
            <thead style="background: #FFF9CC;">
              <tr>
                <th width="200px" style="text-align: left;">Date</th>
                <th width="200px" style="text-align: left;">Type</th>
                <th width="400px" style="text-align: left;">By</th>
                <th width="1084px" style="text-align: left;">Repairs Made</th>
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
              <td>${report['REPAIRDATE']}</td>
              <td>${type}</td>
              <td>${report['REPAIRSBY']??''}</td>
              <td>${report['REPAIRSMADE']??''}</td>
            </tr>`
        })
        htmlContent += `
              <tr style="padding-top: 10px;">
                <td style="padding-top: 10px;"><b>To Spec?</b><br/></td>
                <td style="padding-top: 10px;"><b>No</b><br/></td>
                <td></td>
                <td><b>Comment<br/></b>${serviceOrderInvoiceSummary.performsnotext}</td>
              </tr>
            </tbody>
          </table>`
        htmlContent += `
          <p style="margin-top: 40px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Warranty Materials</b></p>
          <table style="border-spacing: 0px;">
            <thead style="background: #FFF9CC;">
              <tr>
                <th width="200px" style="text-align: left;">Quantity</th>
                <th width="200px" style="text-align: left;">Stock#</th>
                <th width="900px" style="text-align: left;">Description</th>
                <th width="200px" style="text-align: left;">Price</th>
                <th width="200px" style="text-align: left;">Unit</th>
                <th width="200px" style="text-align: left;">Amount</th>
              </tr>
            </thead>
            <tbody>`
          warrantyMaterials.forEach((material) => {
            htmlContent += `
              <tr>
                <td>${material['Quantity']}</td>
                <td>${material['MODEL']}</td>
                <td>${material['DESCRIPTION']}</td>
                <td>${material['PRIMARYPRICE1']}</td>
                <td>${material['UNIT']}</td>
                <td>${material['Amount']}</td>
              </tr>`
          })
          htmlContent += `
              </tbody>
            </table>` 
          htmlContent += `   
            <p style="margin-top: 40px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Materials Received</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFF9CC;">
                <tr>
                  <th width="200px" style="text-align: left;">Date</th>
                  <th width="200px" style="text-align: left;">Stock#</th>
                  <th width="1478px" style="text-align: left;">Description</th>
                </tr>
              </thead>
              <tbody>`
          receievedParts.forEach((material) => {
            htmlContent += `
              <tr>
                <td>${material['Quantity']}</td>
                <td>${material['MODEL']}</td>
                <td>${material['DESCRIPTION']}</td>
                <td></td>
              </tr>`
          })
          htmlContent += `
              </tbody>
            </table>` 
          htmlContent += `
            <p style="margin-top: 40px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Action</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFF9CC;">
                <tr>
                  <th width="200px" style="text-align: left;">Date</th>
                  <th width="200px" style="text-align: left;">Type</th>
                  <th width="1478px" style="text-align: left;">Description</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>`
          htmlContent += `
            <p style="margin-top: 40px; margin-bottom: 10px"><b style="border-bottom: 2px solid black;">Investigations</b></p>
            <table style="border-spacing: 0px;">
              <thead style="background: #FFF9CC;">
                <tr>
                  <th width="200px" style="text-align: left;">Date</th>
                  <th width="200px" style="text-align: left;">Type</th>
                  <th width="1478px" style="text-align: left;">Description</th>
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
                </table>
              </div>  
            </body>`

        const browser = await puppeteer.launch({headless: 'shell'});
        const page = await browser.newPage(); 

        const pdfOptions: any = {
          path: 'Complaints.pdf',
          format: 'letter',
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