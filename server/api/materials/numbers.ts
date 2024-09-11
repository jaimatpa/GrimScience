import { getNumberOfCustomers } from '~/server/controller/customers';
import { getNumberOfParts } from '../../controller/materials/Parts';

export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const numberOfParts = await getNumberOfParts(filterParams);
        return { body: numberOfParts, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});