import sequelize from "~/server/utils/databse";

export default eventHandler(async (event) => {
    const method = event.node.req.method;
    const { number, name, position, account, timeEntryWithoutJob, paid } = getQuery(event);

    switch (method.toUpperCase()) {
        case 'GET':
            const [results, metadata] = await sequelize.query(`
                SELECT [Name], [NUMBER],[UniqueId]
                FROM tblWorkCenters
                ORDER BY [NUMBER]
            `);
            return results.map((result) => ({
                UniqueId: result.UniqueId,
                location: `#${result.NUMBER} ${result.Name}`,
            }));
        case "POST":
                await saveWorkCenterData({ number, name, position, account, timeEntryWithoutJob, paid });
                res.status(200).json({ message: 'Work center data saved successfully!' });
        default:
            event.node.res.statusCode = 405;
            return { error: 'Method Not Allowed' };
    }
});
