import { getServiceReports, createServiceReport } from '~/server/controller/service';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { ...params } = getQuery(event);

    switch (method) {
      case 'GET':
        const serviceReports = await getServiceReports(params)
        return { body: serviceReports, message: '' };
      case 'POST':
        const data = await readBody(event)
        const newServiceReport = await createServiceReport(data)
        return { body: { newServiceReport }, message: 'New service report created successfully!' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});