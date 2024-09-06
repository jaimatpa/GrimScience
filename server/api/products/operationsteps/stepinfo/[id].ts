import {stepExistByID, getStepInformation, deleteStep } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {

    const id = event.context.params.id;
    const method = event._method;
    const idExist = await stepExistByID(id);

    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){     
          const detail = await getStepInformation(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The step does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const body = await readBody(event);
          const username = body.username;  // Extract username from the request body

          if (!username) {
            setResponseStatus(event, 400);  // Bad Request if username is not provided
            return { error: 'Username is required for deletion' };
          }
          const deletedID = await deleteStep(id, username);
          return { body: { deletedID }, message: 'Step deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The step does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});