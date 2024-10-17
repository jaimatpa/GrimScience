import { productExistByModel, cloneOperations } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;
    const { targetId, sourceId, username } = await readBody(event);
    
    switch(method.toUpperCase()){
      case 'PUT':
        const modelExist = await productExistByModel(targetId);
        if (modelExist) {
          const updatedID = await cloneOperations(sourceId ,targetId, username)
          return { body: { updatedID }, message: 'Instruction cloned successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The model does not exist or mode is inactive' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});