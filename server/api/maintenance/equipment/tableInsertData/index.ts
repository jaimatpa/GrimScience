// import { insertEquipmentTableData } from '~/server/controller/maintenance/equipment';

// export default eventHandler(async (event) => {
//   try {
//     const method = event._method;

//     if (method === 'POST') {
//       const body = await readBody(event);
//       const result = await insertEquipmentTableData(body);
//       return { body: result , message: ''};
//     } else {
//       setResponseStatus(event, 405);
//       return { error: 'Method Not Allowed' };
//     }
//   } catch (error) {
//     console.error('Error in API handler:', error);
//     throw new Error(`Error processing request: ${error.message}`);
//   }
// });


import { insertEquipmentTableData, createNewReport } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const method = event.req.method; // POST/GET/PATCH method
    const query = getQuery(event); // Get query parameters, e.g., type

    if (method === 'POST') {
      const body = await readBody(event);
      if (query.type === 'table') {
        const result = await insertEquipmentTableData(body); 
        return { body: result, message: 'Table data inserted successfully' };
      } else if (query.type === 'newReport') {
        const result = await createNewReport(body); 
        return { body: result, message: 'Table data updated successfully' };
      } else {
        return { error: 'Unknown type' };
      }

    } else {
      setResponseStatus(event, 405);
      return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw new Error(`Error processing request: ${error.message}`);
  }
});
