import { getDistinctModels } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        console.log("subb categoyyyss",filterParams.subCategory,filterParams.subCategory);
        const subcategories = await getDistinctModels(filterParams.category,filterParams.subCategory);
        return { body: subcategories, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
