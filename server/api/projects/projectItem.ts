import { getProjectItem } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;

    if (method.toUpperCase() === 'GET') {
      console.log("filter category is",filterParams.category);
      const projectlist = await getProjectItem(filterParams.category);
      return { body: projectlist, message: '' };
    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error fetching data from table:', error);
    return { error: `Error fetching data from table: ${error.message}` };
  }
});
