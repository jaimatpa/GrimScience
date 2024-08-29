import { isExists } from 'date-fns';
import getJobOperationsWithEmployees, { deleteJobOperation, deleteOperationHoursWorked } from '~/server/controller/projects/projects';


export default eventHandler(async (event) => {
  try {
    console.log("hello");
    const id = event.context.params.id;
    console.log("id issss",id);
    const method = event._method;

    switch (method.toUpperCase()) {
        case 'DELETE':

        const  deletedID = await deleteOperationHoursWorked(id);
         return { body: { deletedID }, message: 'Operation Hour deleted successfully' }

    

      default:
        setResponseStatus(event, 405); // Method Not Allowed
        return { error: 'Method not allowed' };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    setResponseStatus(event, 500); // Internal Server Error
    return { error: 'Internal Server Error' };
  }
});
