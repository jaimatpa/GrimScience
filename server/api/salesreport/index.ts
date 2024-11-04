import { getSalesReport } from '~/server/controller/salesreport';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    const { page, pageSize, filterValues, startDate, endDate } = getQuery(event)
    
    switch(method.toUpperCase()){
      case 'GET':
        const { results, totalReports, total, units } = await getSalesReport(page, pageSize, filterValues, startDate.slice(1, -1), endDate.slice(1, -1))
        return { body:{ results, totalReports, total, units }, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});