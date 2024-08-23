import { createCustomer, getCustomers, getNumberOfCustomers } from '~/server/controller/customers';
import { getParts } from '~/server/controller/materials';
import { getUsedPart } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
    console.log("it's cming");
  try {
    const {...filterParams } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getUsedPart( filterParams);
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});