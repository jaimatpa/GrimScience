import { getNumberOfJobs } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    const {isOpen, isReleased, startDate, endDate, ...filterParams} = getQuery(event);
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const numberOfCustomers = await getNumberOfJobs(isOpen, isReleased, filterParams, startDate.slice(1, -1), endDate.slice(1, -1));
        return { body: numberOfCustomers, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});