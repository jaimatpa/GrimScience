import { getSerials } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { ...params } = getQuery(event);

    switch (method) {
      case 'GET':
        const serials = await getSerials(params)
        return { body: serials, message: '' };
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});