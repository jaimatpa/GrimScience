import { getCustomers } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const customers = await getCustomers()
        return { body: customers, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});