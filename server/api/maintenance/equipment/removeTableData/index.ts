import { removeReportTableData } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;  
    const { id } = getQuery(event); 

    if (!id) {
      setResponseStatus(event, 400); 
      return { error: 'Invalid or missing ID.' };
    }

    switch (method.toUpperCase()) {
      case 'DELETE':
        const result = await removeReportTableData(id); 
        if (result) {
          setResponseStatus(event, 200);
          return { message: 'Record deleted successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'Record not found or could not be deleted' };
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: `Error deleting data: ${error.message}` };
  }
});

