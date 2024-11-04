import { updateProjectPercentage } from '~/server/controller/projects';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { jobs } = await readBody(event);
    switch(method.toUpperCase()){
      case 'PUT':
        await updateProjectPercentage(jobs)
        return { body: '', message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});