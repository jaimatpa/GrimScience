import sequelize from "~/server/utils/databse";

export default async function handler(event) {
    const { ponum, vin } = getQuery(event)

    try {
        // Initialize response data
        let response = {
            recPOaEmployee: [],
            recPOasubtotal: 0,
            recPOaReceived: '',
            recPOaInvoiceTotal: 0,
            lvwItems: [],
        };

        // Load employees
        let [employees] = await sequelize.query(`
      SELECT DISTINCT fname, lname 
      FROM tblemployee 
      WHERE active = 1 AND uniqueID IN (1, 4, 10071, 10088, 10098) 
      ORDER BY lname, fname ASC;
    `);
        response.recPOaEmployee = employees.map(emp => `${emp.fname} ${emp.lname}`);

        // If ponum or vin is provided
        if (ponum > 0) {
            // Get Vendor Invoice Details
            let [vendorInvoiceDetails] = await sequelize.query(`
        SELECT * 
        FROM tblVendorInvoice 
        WHERE uniqueid = ${vin};
      `);

            // Get PO Details
            let [poDetails] = await sequelize.query(`
        SELECT * 
        FROM tblPO 
        WHERE uniqueid = ${ponum};
      `);

            // Get PO Detail Count
            let [[{ count }]] = await sequelize.query(`
        SELECT COUNT(uniqueid) AS count 
        FROM tblPODetail 
        WHERE POUID = ${ponum};
      `);

            // Get PO Detail Rows
            let [poDetailRows] = await sequelize.query(`
        SELECT * 
        FROM tblPODetail 
        WHERE pouid = ${ponum} 
        ORDER BY stocknumber;
      `);

            // Get Inspection Level
            let [inspectionLevels] = await sequelize.query(`
        SELECT InspectionLevel 
        FROM tblBP 
        WHERE model = '${poDetailRows[0]?.stocknumber || ''}' 
        ORDER BY uniqueID DESC;
      `);

            let tempTotal = 0;
            response.lvwItems = poDetailRows.map(row => {
                let inspectionLevel = inspectionLevels[0]?.InspectionLevel || '';
                let ordered = parseFloat(row.ordered) || 0;
                let unitPrice = parseFloat(row.UnitPrice) || 0;
                let subtotal = ordered * unitPrice;

                tempTotal += subtotal;

                return {
                    text: row.ordered,
                    tag: row.uniqueID,
                    subItems: [
                        row.PTNUM || '',
                        row.Received || '',
                        row.StockNumber || '',
                        row.PartNumber || '',
                        inspectionLevel,
                        row.Description || '',
                        row.UnitPrice || '',
                        row.Unit || '',
                        subtotal
                    ]
                };
            });

            response.recPOasubtotal = tempTotal;
            response.recPOaReceived = vin === 0 ? new Date().toLocaleDateString() : '';
            response.recPOaInvoiceTotal = tempTotal + (parseFloat(response.recPOaTaxAmt || 0) + parseFloat(response.recPOaFreightAmt || 0) + parseFloat(response.recPOaOther || 0));

            // Update quantities in lvwItems
            let [invoiceDetails] = await sequelize.query(`
        SELECT qty 
        FROM tblVendorInvoiceDetail 
        WHERE VendorInvoiceID = ${vin} 
        ORDER BY uniqueID;
      `);

            response.lvwItems = response.lvwItems.map((item, index) => {
                if (invoiceDetails[index]) {
                    item.subItems[1] = parseFloat(invoiceDetails[index].qty) || '';
                }
                return item;
            });
        }

        return {
            statusCode: 200,
            body: {
                ...response,
                lvwItems: response.lvwItems
            }
        };
    } catch (error) {
        console.error('Error executing query:', error);
        return {
            statusCode: 500,
            body: { error: 'Internal Server Error' }
        };
    }
}