import { customerExistByID, getSerialsByCustomerID } from '~/server/controller/customers';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const {...params } = getQuery(event);

    const idExist = await customerExistByID(params.customerid);
    switch(method){
      case 'GET':
        if (idExist){
          const serials = await getSerialsByCustomerID(params.customerid)
          return { body: serials, message: '' };
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