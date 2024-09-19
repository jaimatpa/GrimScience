import { createBug, getAllBugs } from "~/server/controller/bugs/Bug";

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;


    switch(method.toUpperCase()){

      case 'GET':
        const list = await getAllBugs(page, pageSize, sortBy, sortOrder, filterParams); 
        return { body: list, message: 'Success!' };

      case 'POST':
        const data = await readBody(event)
        const newBug = await createBug(data)
        return { body: { newBug }, message: 'New bug added successfully!'}
      
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
    }
});
