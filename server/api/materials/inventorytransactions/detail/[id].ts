import { deleteInventoryTransactionDetail } from '~/server/controller/materials';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch(method.toUpperCase()){
      case 'GET':
        break;
      case 'PUT':
        break;
      case 'DELETE':
        const result = await deleteInventoryTransactionDetail(id)
        return { body: result, message: 'Inventory Transaction Detail deleted successfully' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});