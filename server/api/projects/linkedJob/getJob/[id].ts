import { isExists } from 'date-fns';
import { getLinkedJobs, GetInventoryDatas} from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;
    console.log('hlw ', id);

    const linkedJob = await getLinkedJobs(id);
    console.log("is exist is",isExists);

    switch (method.toUpperCase()) {
      case 'GET':
        if (linkedJob) {
          console.log('idididid', id);
       
          console.log('susccsul', linkedJob);
          return { body: linkedJob, message: '' };
        } else {
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
