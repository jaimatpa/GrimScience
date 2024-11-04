import { getAllProject, createProject } from '~/server/controller/projects';

export default eventHandler(async (event) => {

  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);

    const method = event._method;
    switch (method.toUpperCase()) {
      case 'GET':
        const { list, totalCount } = await getAllProject(page, pageSize,  sortBy, sortOrder, filterParams);
        return { body: { list , totalCount}, message: '' }
      case 'POST':
        const data = await readBody(event)
        const newProject = await createProject(data)
        return { body: { newProject }, message: 'New project created successfully!' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});