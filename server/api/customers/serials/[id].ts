import { customerExistByID, getSerialsByID } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await customerExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const lastOrderID = await getSerialsByID(id)
          return { body: lastOrderID, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});