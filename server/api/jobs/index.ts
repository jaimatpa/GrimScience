import { createNewJob, getAllJobs } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getAllJobs(page, pageSize, sortBy, sortOrder, filterParams);
        return { body: list, message: '' }
      case 'POST':
        const data = await readBody(event)
        const detail = await createNewJob(data)
        return { body: { detail }, message: 'New Job created successfully!'}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});