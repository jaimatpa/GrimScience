import { bulkCloseJobs } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { selectedJobs } = await readBody(event);

    switch(method.toUpperCase()){
      case 'PUT':
        await bulkCloseJobs(selectedJobs)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});