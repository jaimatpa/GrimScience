import { getFieldSales } from '~/server/controller/fieldsales';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    const { filterValues } = getQuery(event)
    
    switch(method.toUpperCase()){
      case 'GET':
        const { siteVisitResults,
          serviceReportResults,
          installationResults,
          siteVisitCount,
          serviceReportsCount,
          installationCount } = await getFieldSales(filterValues)
        return { body:{ siteVisitResults,
          serviceReportResults,
          installationResults,
          siteVisitCount,
          serviceReportsCount,
          installationCount }, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});