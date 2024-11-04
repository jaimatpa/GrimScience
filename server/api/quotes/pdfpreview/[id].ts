

import { eventHandler } from 'h3';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { base64Imag } from '../../sitevisit/preview/baseImg';
import { getQuoteForPreview } from '~/server/controller/quotes/quotes';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const data = await getQuoteForPreview(id);

    if (!data || !data.quote) {
      setResponseStatus(event, 404);
      return { error: "No data found for the given ID." };
    }

    const quote = data.quote;
    const items = data.items;
    console.log("+++++++++++++++++++", quote);
    

    let itemsHtml = '';
    let total = 0;

    items.forEach(item => {
      total += parseFloat(item.price) * item.quantity;
      itemsHtml += `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px;">${item.quantity}</td>
          <td style="padding: 8px;">${item.type}</td>
          <td style="padding: 8px;">${item.name}</td>
          <td style="padding: 8px; text-align: right;">$${parseFloat(item.price).toFixed(2)}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <body style="font-family: Arial; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 1px solid #000;">
          <div  style="display: flex; gap:20px">
            <img style="width: 150px;" src="data:image/png;base64,${base64Imag}" alt="Grimm" />
            <h2 style="margin-top: 35px;">Quotation</h2>
          </div>
          <div style="text-align: right;">
            <table style="margin-left: auto;">
              <tr>
                <td style="padding: 4px;"><strong>Quote #:</strong></td>
                <td style="padding: 4px;">${quote.quotenumber}</td>
              </tr>
              <tr>
                <td style="padding: 4px;"><strong>Quote Date:</strong></td>
                <td style="padding: 4px;">${format(new Date(quote.invoicedate), 'M/d/yyyy')}</td>
              </tr>
              <tr>
                <td style="padding: 4px;"><strong>Source:</strong></td>
                <td style="padding: 4px;">${quote.source}</td>
              </tr>
              <tr>
                <td style="padding: 4px;"><strong>Source Desc:</strong></td>
                <td style="padding: 4px;">${quote.sourcedescription}</td>
              </tr>
              <tr>
                <td style="padding: 4px;"><strong>Status:</strong></td>
                <td style="padding: 4px;">${quote.status}</td>
              </tr>
              <tr>
                <td style="padding: 4px;"><strong>Expiration:</strong></td>
                <td style="padding: 4px;">${format(new Date(quote.expirationdate), 'M/d/yyyy')}</td>
              </tr>
            </table>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <div style="float: left; width: 50%;">
            <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">Customer (Ship To)</h3>
            <div style="margin-top: 10px;">
              <div style="margin-bottom: 3px;">#${quote.customerid}</div>
              <div style="margin-bottom: 3px;">${quote.company1}</div>
              <div style="margin-bottom: 3px;">${quote.fname} ${quote.lname}</div>
              <div style="margin-bottom: 3px;">${quote.address}</div>
              <div style="margin-bottom: 3px;">${quote.city}, ${quote.state} ${quote.zip}</div>
              W: ${quote.workphone ? `<span style="margin-bottom: 3px;">${quote.workphone}</span>` : ''} <br>
              C: ${quote.cellphone ? `<span style="margin-bottom: 3px;">${quote.cellphone}</span>` : ''} <br>
              H: ${quote.homephone ? `<span style="margin-bottom: 3px;">${quote.homephone}</span>` : ''}
            </div>
          </div>

          <div style="float: right; width: 45%;">
            <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">Notes</h3>
            <div style="margin-top: 10px;">
              ${quote.Notes || ''}
            </div> <br>
            <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 40px;">Estimated</h3>
            Booking date:  ${quote.estimatedbooking ? `<span style="margin-bottom: 3px;">${format(new Date(quote.estimatedbooking), 'M/d/yyyy')}</span>` : ''}  <br>
              Delivery date ${quote.estimatedship ? `<span style="margin-bottom: 3px;">${format(new Date(quote.estimatedship), 'M/d/yyyy')}</span>` : ''}  <br>
          </div>
          <div style="clear: both;"></div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="padding: 8px; text-align: left;">Qty</th>
              <th style="padding: 8px; text-align: left;">Number</th>
              <th style="padding: 8px; text-align: left;">Description</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </body>
    `;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const pdfOptions = {
      format: 'Letter',
      margin: {
        top: '40px',
        bottom: '40px',
        left: '40px',
        right: '40px'
      }
    };

    await page.setContent(htmlContent, { waitUntil: 'networkidle2' });
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    setHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Quote.pdf"',
      'Page-Size': 'Letter'
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw createError({
      statusCode: 500,
      message: `Error generating quote PDF: ${error.message}`
    });
  }
});



// <div style="margin-top: 20px; text-align: right;">
// <div style="display: inline-block; text-align: right;">
//   <table>
//     <tr>
//       <td style="padding: 4px;"><strong>Subtotal:</strong></td>
//       <td style="padding: 4px;">$${total.toFixed(2)}</td>
//     </tr>
//     <tr>
//       <td style="padding: 4px;"><strong>Tax:</strong></td>
//       <td style="padding: 4px;">$${(parseFloat(quote.tax) || 0).toFixed(2)}</td>
//     </tr>
//     <tr>
//       <td style="padding: 4px;"><strong>Shipping:</strong></td>
//       <td style="padding: 4px;">$${(parseFloat(quote.shipping) || 0).toFixed(2)}</td>
//     </tr>
//     <tr>
//       <td style="padding: 4px;"><strong>Less Discount:</strong></td>
//       <td style="padding: 4px;">$${(parseFloat(quote.lessdiscount) || 0).toFixed(2)}</td>
//     </tr>
//     <tr style="border-top: 1px solid #000;">
//       <td style="padding: 4px;"><strong>Total:</strong></td>
//       <td style="padding: 4px;">$${(total + (parseFloat(quote.tax) || 0) + (parseFloat(quote.shipping) || 0) - (parseFloat(quote.lessdiscount) || 0)).toFixed(2)}</td>
//     </tr>
//   </table>
// </div>
// </div>