import { getInventoryTransactionDetails, updateInventoryTransaction, deleteInventoryTransaction } from '~/server/controller/inventorytransactions';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;
    const { ...filterParams } = getQuery(event);

    switch(method.toUpperCase()){
      case 'GET':
        const list = await getInventoryTransactionDetails(id, filterParams);
        return { body: list, message: '' }
      case 'PUT':
        const data = await readBody(event);
        const updatedResult = await updateInventoryTransaction(id, data);
        return { body: updatedResult, message: 'Inventory Transaction saved successfully' }
      case 'DELETE':
        const deleteResult = await deleteInventoryTransaction(id);
        return { body: deleteResult, message: 'Inventory Transaction deleted successfully' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});