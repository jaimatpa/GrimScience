import { getAllMatchReportData } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;
    
    const Id = event.context.params.id; // Grab the parameter ID from the request

    switch (method.toUpperCase()) {
      case 'GET': {
        const query = getQuery(event); // Retrieve any query parameters

        console.log("Received Id:", Id);

        const inventoryTransactions = await getAllMatchReportData(Id, query);

        if (inventoryTransactions) {
          return {
            status: 200,
            body: inventoryTransactions,
          };
        } else {
          return {
            status: 404,
            body: { message: `No inventory transactions found for Id: ${Id}` },
          };
        }
      }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching inventory transactions: ${error.message}`);
  }
});