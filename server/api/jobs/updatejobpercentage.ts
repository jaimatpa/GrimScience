import { updateJobPercentage } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobs } = await readBody(event);
    console.log(jobs)
    switch(method.toUpperCase()){
      case 'PUT':
        await updateJobPercentage(jobs)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});