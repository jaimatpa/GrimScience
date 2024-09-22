import { getNumberOfBugs } from "~/server/controller/bugs/Bug";


export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const numberOfBugs = await getNumberOfBugs(filterParams);
        return { body: numberOfBugs, message: 'Success!' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});