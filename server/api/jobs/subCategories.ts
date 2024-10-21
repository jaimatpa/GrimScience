import { getJobSubCategories } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const {  category } = getQuery(event);
    switch(method.toUpperCase()){
      case 'GET':
        const { distinctSubCategories, distinctPart } = await getJobSubCategories(category)
        return { body: { distinctSubCategories, distinctPart }, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});