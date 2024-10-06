import { getInvestigationProductLines } from "~/server/controller/engineering/Investigations";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getInvestigationProductLines();
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});