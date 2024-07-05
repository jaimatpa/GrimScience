import { getComplaintDetail } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id
    const method = event._method;

    switch(method.toUpperCase()){
      case 'GET':
        const detail = await getComplaintDetail(id);
        return { body: detail, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});