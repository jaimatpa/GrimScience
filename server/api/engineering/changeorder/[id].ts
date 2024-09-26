import { getChangeOrderDetail } from '~/server/controller/engineering';


export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const id = event.context.params.id;


    switch(method){
      case 'GET':
        const investigationDetail = await getChangeOrderDetail(id)
        console.log(investigationDetail)
        if(investigationDetail)
          return {body: investigationDetail, message: ''}
        else {
          setResponseStatus(event, 404);
          return { error: 'The Investigation does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
   
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
