import { defineEventHandler, readBody, getQuery } from 'h3';
import sequelize from '~/server/utils/databse';

export default defineEventHandler(async (event) => {
    const method = event._method;

    switch (method.toUpperCase()) {
        case 'GET':
            return await handleErrors(getVendorInvoices, event);
        case 'POST':
            return await handleErrors(createVendorInvoice, event);
        case 'PUT':
            return await handleErrors(updateVendorInvoice, event);
        case 'DELETE':
            return await handleErrors(deleteVendorInvoice, event);
        default:
            return { statusCode: 405, body: 'Method Not Allowed' };
    }
});

// Centralized error handling
async function handleErrors(fn: (event: any) => Promise<any>, event: any) {
    try {
        return await fn(event);
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
} 



async function getVendorInvoices(event: any) {
    const { ponum, vin } = getQuery(event);
    let query = 'SELECT * FROM tblVendorInvoice WHERE 1=1';
    const values: any[] = [];

    if (ponum) {
        query += ' AND PONum = ?';
        values.push(ponum);
    }

    if (vin) {
        query += ' AND uniqueID = ?';
        values.push(vin);
    }

    query += ' ORDER BY invoiceNumber';

    // Execute the vendor invoice query
    const rows = await sequelize.query(query, { replacements: values, type: sequelize.QueryTypes.SELECT });

    // Get the PO details if required
    let poDetails = [];
    if (ponum) {
        const poDetailsQuery = `SELECT * FROM tblPODetail WHERE POUID = ?`;
        poDetails = await sequelize.query(poDetailsQuery, { replacements: [ponum], type: sequelize.QueryTypes.SELECT });
    }

    // Add InspectionLevel for each stocknumber
    for (let detail of poDetails) {
        const stockNumber = detail.STOCKNUMBER;

        // Query to get the InspectionLevel for each stocknumber
        const inspectionQuery = `SELECT InspectionLevel FROM tblBP WHERE model = ? ORDER BY uniqueID`;
        const inspectionResult = await sequelize.query(inspectionQuery, {
            replacements: [stockNumber],
            type: sequelize.QueryTypes.SELECT
        });

        // Add the InspectionLevel to the detail if found
        detail.InspectionLevel = inspectionResult.length > 0 ? inspectionResult[0].InspectionLevel : null;
    }

    return { statusCode: 200, body: { rows, poDetails } };
}



async function createVendorInvoice(event: any) {
    const body = await readBody(event);
    const { PONum, invoiceNumber, datestamp, invoicetotal, Employee } = body;

    if (!PONum || !invoiceNumber || !datestamp || !invoicetotal || !Employee) {
        return { statusCode: 400, body: 'Missing required fields' };
    }

    const query = `
        INSERT INTO tblVendorInvoice (PONum, invoiceNumber, datestamp, invoicetotal, Employee)
        VALUES (?, ?, ?, ?, ?)
        RETURNING *
    `;

    const { rows } = await sequelize.query(query, {
        replacements: [PONum, invoiceNumber, datestamp, invoicetotal, Employee],
        type: sequelize.QueryTypes.INSERT,
    });

    return { statusCode: 201, body: rows[0] };
}

async function updateVendorInvoice(event: any) {
    const body = await readBody(event);
    const { uniqueID, PONum, invoiceNumber, datestamp, invoicetotal, Employee } = body;

    if (!uniqueID || !PONum || !invoiceNumber || !datestamp || !invoicetotal || !Employee) {
        return { statusCode: 400, body: 'Missing required fields' };
    }

    const query = `
        UPDATE tblVendorInvoice
        SET PONum = ?, invoiceNumber = ?, datestamp = ?, invoicetotal = ?, Employee = ?
        WHERE uniqueID = ?
        RETURNING *
    `;

    const { rows } = await sequelize.query(query, {
        replacements: [PONum, invoiceNumber, datestamp, invoicetotal, Employee, uniqueID],
        type: sequelize.QueryTypes.UPDATE,
    });

    if (rows.length === 0) {
        return { statusCode: 404, body: 'Vendor Invoice not found' };
    }

    return { statusCode: 200, body: rows[0] };
}

async function deleteVendorInvoice(event: any) {
    const { vin } = getQuery(event);

    if (!vin) {
        return { statusCode: 400, body: 'VIN is required' };
    }

    const query = 'DELETE FROM tblVendorInvoice WHERE uniqueID = ?';

    const result = await sequelize.query(query, {
        replacements: [vin],
        type: sequelize.QueryTypes.DELETE,
    });

    if (result.affectedRows === 0) {
        return { statusCode: 404, body: 'Vendor Invoice not found' };
    }

    return { statusCode: 204 };
}
