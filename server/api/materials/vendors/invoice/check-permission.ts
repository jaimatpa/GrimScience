import { QueryTypes } from "sequelize";
import sequelize from "~/server/utils/databse";

export default async function handler(event) {
    const { ponum, vin, glob_lngEmployee } = getQuery(event);

    try {
        const query = `
      SELECT * FROM tblVendorInvoice 
      WHERE ${ponum ? `PONum = ${ponum}` : `uniqueID = ${vin}`} 
      ORDER BY invoiceNumber;
    `;

        // Execute the raw query
        const [results] = await sequelize.query(query, { type: QueryTypes.SELECT });

        // Determine permissions and adjust results
        let permissions = await sequelize.query(`
      SELECT MenuItem, ReadOnlyIDs, FullAdminIDs 
      FROM tblPermissions 
      WHERE system = 'Materials' 
        AND subsystem = 'Vendor Invoice';
    `, { type: QueryTypes.SELECT });

        const perm = permissions[0];
        let accessStatus = 'Full';

        if (perm.MenuItem === 'Restricted') {
            accessStatus = 'Restricted';
        } else if (perm.MenuItem === 'Read Only') {
            accessStatus = 'Read-Only';
        }

        if (accessStatus === 'Read-Only' ||
            (',' + perm.ReadOnlyIDs + ',').includes(',' + glob_lngEmployee + ',') ||
            (',' + perm.FullAdminIDs + ',').includes(',' + glob_lngEmployee + ',')) {
            // Adjust results based on access rights
            if (accessStatus === 'Read-Only') {
                // Remove or restrict functionality based on access
                // Example: Filter out certain results or fields
            }
        }

        return {
            statusCode: 200,
            body: {

                status: accessStatus,
                results,
            }
        };
    } catch (error) {
        console.error('Error executing query:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
}
