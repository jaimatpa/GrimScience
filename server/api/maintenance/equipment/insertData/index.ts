import { insertEquipmentData } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    if (method === 'POST') {
      const body = await readBody(event);
      const result = await insertEquipmentData(body);
      return { body: result , message: ''};
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw new Error(`Error processing request: ${error.message}`);
  }
});