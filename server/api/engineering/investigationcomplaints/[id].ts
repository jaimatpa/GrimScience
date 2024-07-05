import { deleteInvestigationComplaint } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;

    switch(method){
      case 'DELETE':
        const result = await deleteInvestigationComplaint(id)
        return { body: result, message: ''}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});