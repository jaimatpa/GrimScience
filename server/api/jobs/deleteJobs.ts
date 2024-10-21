import { deleteJobs } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { selectedJobs } = await readBody(event);

    console.log(selectedJobs)

    switch(method.toUpperCase()){
      case 'DELETE':
        await deleteJobs(selectedJobs)
        return { body: '', message: 'Job deleted successfully' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});