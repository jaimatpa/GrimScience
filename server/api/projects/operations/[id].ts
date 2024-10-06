import { isExists } from 'date-fns';
import getJobOperationsWithEmployees, { deleteJobOperation } from '~/server/controller/projects/projects';


export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;
    console.log('hlw ', id);

    const workCenter = await getJobOperationsWithEmployees(id);
    console.log("is exist is",workCenter);

    switch (method.toUpperCase()) {
      case 'GET':
        if (workCenter) {
          console.log('idididid', workCenter);
       
          console.log('susccsul', workCenter);
          return { body: workCenter, message: '' };
        } 
        case 'DELETE':
        if(workCenter){
        const  deletedID = await deleteJobOperation(id);
         return { body: { deletedID }, message: 'Operation deleted successfully' }


        }
        
        
        else {
          setResponseStatus(event, 404);
          return { error: 'The project does not exist' };
        }


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

