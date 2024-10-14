import { getInventoryUnit } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const inventoryUnit = await getInventoryUnit()
        return { body: inventoryUnit, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});