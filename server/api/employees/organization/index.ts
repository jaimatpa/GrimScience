import { createOrganization, getAllOrganization, getNumberOfOrganization } from "~/server/controller/employees";

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getAllOrganization(page, pageSize, sortBy, sortOrder, filterParams);
        const numberOfCustomers = await getNumberOfOrganization(filterParams);
        return { body: {list, numberOfCustomers}, message: '' }
      case 'POST':
        const data = await readBody(event)
        const newCustomer = await createOrganization(data)
        return { body: { newCustomer }, message: 'New Organization created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});