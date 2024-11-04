import { QueryTypes } from 'sequelize';

import sequelize from '~/server/utils/databse';

export default eventHandler(async (event) => {
    try {
        const { customerid } = getQuery(event);
        const method = event._method;

        switch (method.toUpperCase()) {
            case 'GET':
                const invoiceOrders = await sequelize.query(
                    `SELECT uniqueid,
                            3 as openclosed,
                            invoicedate as DateTime,
                            invoicenumber as number
                        FROM tblOrder
                        WHERE Orderdate <> ''
                        AND CustomerID = :customerid
                        ORDER BY uniqueid DESC`,
                    {
                        replacements: { customerid },
                        type: QueryTypes.SELECT,
                    }
                );

                return { body: invoiceOrders, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }
    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});