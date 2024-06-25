import { orderExistByID, getOrderByID  } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await orderExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getOrderByID(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The order does not exist' }
        }
      case 'PUT':
        
      case 'DELETE':
        
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});