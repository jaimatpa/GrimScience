import { JobExistByID, deleteJob, getJobDetail, updateJob } from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await JobExistByID(id);
    
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getJobDetail(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Job does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const reqData = await readBody(event);
          const updatedID = await updateJob(id, reqData)
          return { body: { updatedID }, message: 'Job updated successfully' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Job does not exist' }
        }
      case 'DELETE':
        if (idExist) {
          const deletedID = await deleteJob(id);
          return { body: { deletedID }, message: 'Job deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Job does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});