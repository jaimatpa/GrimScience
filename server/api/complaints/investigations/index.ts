import { getComplaints } from '~/server/controller/complaints';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const {...params} = getQuery(event);

    switch(method){
      case 'GET':
        const investigations = await getComplaints(params)
        return {body: investigations, message: ''}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});