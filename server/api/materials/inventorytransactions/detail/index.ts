import { createInventoryTransactionDetail } from '~/server/controller/materials';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        break
      case 'POST':
        const data = await readBody(event);
        const newDetail = await createInventoryTransactionDetail(data)
        return { body: newDetail, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});