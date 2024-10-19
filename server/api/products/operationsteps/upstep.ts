import { stepExistByID, upStpe } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;
    const { stepId, planId } = await readBody(event);

    switch(method.toUpperCase()){
      case 'PUT':
        const idExist = await stepExistByID(stepId);
        if (idExist) {
          const updatedID = await upStpe(stepId ,planId)
          return { body: { updatedID }, message: 'Step updated successfully' };
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