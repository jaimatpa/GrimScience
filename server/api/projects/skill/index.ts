import { createSkill, getAllSkill } from "~/server/controller/projects/projects";

export default eventHandler(async (event) => {
    try {
      const method = event._method;
      const { page, pageSize, sortBy, sortOrder } = getQuery(event);
      switch(method.toUpperCase()) {
        case 'GET':
          const numberOfCustomers = await getAllSkill(page, pageSize, sortBy, sortOrder);
          return { body: numberOfCustomers, message: '' } // or { _data: { body: numberOfCustomers }, message: '' } if required
          case 'POST':
            const data = await readBody(event)
            console.log("data isss",data);
            const newProject = await createSkill(data)
            return { body: { newProject }, message: 'New skill created successfully!'}
       
            
          default:
          setResponseStatus(event, 405);
          return { error: 'Method Not Allowed' };
      }
    } catch (error) {
      throw new Error(`Error fetching data from table: ${error.message}`);
    }
  });
  