import { JobExistByID, calculateLatestUnitCost} from '~/server/controller/jobs';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await JobExistByID(id);
    
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const cost = await calculateLatestUnitCost(id)
          return { body: cost, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Job does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});