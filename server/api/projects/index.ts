import { createCustomer, getCustomers, getNumberOfCustomers } from '~/server/controller/customers';
import { getAllProject } from '~/server/controller/projects/projects';
import { createProject } from '~/server/controller/projects/projects';


export default eventHandler(async (event) => {

  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    console.log("filter value is",filterParams);
 
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
      
        const list = await getAllProject(page, pageSize, sortBy, sortOrder, filterParams);
        

        return { body: list, message: '' }
      case 'POST':
        const data = await readBody(event)
        const newProject = await createProject(data)
        return { body: { newProject }, message: 'New project created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});