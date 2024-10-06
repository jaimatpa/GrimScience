import { getComplaints } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { ...params } = getQuery(event);

    switch (method) {
      case 'GET':
        const complaints = await getComplaints(params)
        return { body: complaints, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});