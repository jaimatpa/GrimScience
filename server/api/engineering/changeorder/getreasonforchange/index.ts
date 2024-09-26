import { getReasonForChangList } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    if (method === 'GET') {
      const list = await getReasonForChangList();
      return { body: list, message: '' }; 
    } else {
      setResponseStatus(event, 405); 
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
