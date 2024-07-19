import { createNewSkill, getAllSkills } from "~/server/controller/skills";

export default eventHandler(async (event) => {
  try {
    const { sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getAllSkills(sortBy, sortOrder, filterParams);
        return { body: list, message: 'List Fetched successfully' }
      case 'POST':
        const data = await readBody(event)
        const newCustomer = await createNewSkill(data)
        return { body: { newCustomer }, message: 'New Skill created successfully!' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});