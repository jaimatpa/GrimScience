import { getNumberOfEmplyees } from "~/server/controller/employees";

export default eventHandler(async (event) => {
  try {
    const filterParams = getQuery(event);
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const numberOfCustomers = await getNumberOfEmplyees(filterParams);
        return { body: numberOfCustomers, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});