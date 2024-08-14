import { serviceReportExistByID, updateServiceReport } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await serviceReportExistByID(id);
    switch(method.toUpperCase()){
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateServiceReport(id, reqData)
          return { body: { updatedID }, message: 'Service Report updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The service report does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});