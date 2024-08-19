import { getParts } from "~/server/controller/materials";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { ...filterParams } = getQuery(event);

    switch(method.toUpperCase()){
      case 'GET':
        const list = await getParts(filterParams);
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});