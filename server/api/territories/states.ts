import { getStates } from '~/server/controller/territories';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { territoryId } = getQuery(event)

    switch(method.toUpperCase()){
      case 'GET':
        const states = await getStates(territoryId)
   
        return { body: states, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});