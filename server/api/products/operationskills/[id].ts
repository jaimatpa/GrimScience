import {operationExistByID, getOperationSkills } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {

    const id = event.context.params.id;
    const method = event._method;
    console.log(id)
    const idExist = await operationExistByID(id);
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){     
          const detail = await getOperationSkills(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The operation does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});