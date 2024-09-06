import { getNumberOfJobs } from '~/server/controller/jobs/Jobs';
import { getSkillCategory, getSkillSubCategory } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch(method.toUpperCase()){
      case 'GET':
        
        const numberOfCustomers = await getSkillSubCategory();
        return { body: numberOfCustomers, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});