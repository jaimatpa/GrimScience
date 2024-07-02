import { getServiceOrderInvoicesOfComplaint } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const { ...params } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getServiceOrderInvoicesOfComplaint(params)
        return { body: list, message: '' }
      case 'POST':
      case 'PUT':
        
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});