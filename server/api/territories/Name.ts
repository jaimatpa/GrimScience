import { getNames } from '~/server/controller/territories';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const names = await getNames()
        return { body: names, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});