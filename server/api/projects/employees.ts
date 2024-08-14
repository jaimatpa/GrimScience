import {   getEmployees, getJobTypes } from '~/server/controller/jobs';
import { getEmployeess } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        const jobTypes = await getEmployeess()
        return { body: jobTypes, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});