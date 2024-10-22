import { getAllCategoryList } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;  
    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getAllCategoryList();
        return list 
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});

