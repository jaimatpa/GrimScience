import sequelize from "~/server/utils/databse";


export default eventHandler(async (event) => {
    try {
        const method = event._method;
        const { tech } = getQuery(event);
        switch (method) {
            case 'GET':
                const filter = await sequelize.query(`SELECT 
                        o.UniqueID, 
                        o.datepromised, 
                        o.InstallationBy, 
                        od.serial
                    FROM 
                        tblOrder AS o
                    INNER JOIN 
                        tblOrderDetail AS od ON o.UniqueID = od.orderid
                    WHERE 
                        o.datepromised IS NOT NULL 
                        AND o.datepromised <> ''
                        AND od.serial IS NOT NULL 
                        AND od.serial <> ''
                        and InstallationBy = :tech`,
                    {
                        replacements: { tech }
                    })

                return { body: filter, message: '' }
            default:
                setResponseStatus(event, 405);
                return { error: 'Method Not Allowed' };
        }

    } catch (error) {
        throw new Error(`Error fetching data from table: ${error.message}`);
    }
});