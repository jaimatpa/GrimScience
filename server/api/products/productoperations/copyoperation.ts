import { cloneOperationAndSteps } from '~/server/controller/products';

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;
    const { targetId, sourceId, username } =  getQuery(event);
    console.log(method)
    switch(method.toUpperCase()){
      case 'PUT':
        await cloneOperationAndSteps(targetId, sourceId , username)
        return {body: '', message: ''}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed !!' };
    }
    
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});