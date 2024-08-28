import { DeleteSteps, gePartsHours, getSteps } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const PlanID = getQuery(event).PLANID; // Assuming you are getting JobId from query params
    const method = event._method;
    const UniqueID=getQuery(event).UniqueID;
    console.log("unique id is",UniqueID);

    switch (method.toUpperCase()) {
      case 'GET':
        if(PlanID){

          const parts = await getSteps(PlanID);
          return { body: parts, message: '' };
        }
        case 'DELETE':
          if(UniqueID){

            const Deleted = await DeleteSteps(UniqueID);
            return { body: Deleted, message: '' };
          }


      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error(`Error fetching data from table: ${error.message}`);
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
});
