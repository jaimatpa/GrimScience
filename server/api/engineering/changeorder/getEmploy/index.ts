import { getEmployList } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    if (method === 'GET') {
      const list = await getEmployList(); // Get the employee list
      return { body: list, message: '' }; // Return the list in the API response
    } else {
      setResponseStatus(event, 405); // Return a 405 if the method is not allowed
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
