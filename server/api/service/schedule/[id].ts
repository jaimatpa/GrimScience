import { ScheduleExistByID, getScheduleDetail } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await ScheduleExistByID(id);
    
    switch(method.toUpperCase()){
      case 'GET':
        if (idExist){
          const detail = await getScheduleDetail(id)
          console.log('detail',detail);
          
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The Employee does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});