import { getInvestigationsOfComplaint, createInvestigationComplaint } from '~/server/controller/engineering';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const {...params} = getQuery(event);

    switch(method){
      case 'GET':
        const investigations = await getInvestigationsOfComplaint(params)
        return {body: investigations, message: ''}
      case 'POST':
        const reqData = await readBody(event)
        const newInvestigationComplaint = await createInvestigationComplaint(reqData)
        return { body: newInvestigationComplaint, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
    
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});