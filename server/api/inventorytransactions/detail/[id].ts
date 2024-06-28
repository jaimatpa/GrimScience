import { createInventoryTransactionDetail, deleteInventoryTransactionDetail } from '~/server/controller/inventorytransactions';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch(method.toUpperCase()){
      case 'GET':
        // const list = await getInventoryTransactionDetails(id, filterParams);
        // return { body: list, message: '' }
        break;
      case 'POST':
        const data = await readBody(event);
        const newDetail = await createInventoryTransactionDetail(data)
        return { body: newDetail, message: '' }
      case 'DELETE':
        console.log('dfasdfas')
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