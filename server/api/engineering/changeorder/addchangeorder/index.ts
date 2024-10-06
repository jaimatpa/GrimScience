import { getEmployList } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    if (method === 'POST') {
      const list = await getEmployList(); 
      return { body: list, message: '' }; 
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
