import {
    getAllEmployeeList,
  } from '~/server/controller/materials/requisitions';
  
  export default eventHandler(async (event) => {
    try {
      const { method } = event.node.req;
  
      switch (method.toUpperCase()) {
        case 'GET':
          const { type} = getQuery(event);
  
          if (type === 'employee') {
            const employeeList = await getAllEmployeeList();
          
            return { employeeList };
  
          }else if (type === 'instrument') {
            // const search1List = await getReportInstrumentData(subCategory);
            //return { search1List }
  
          }
          else {
            return { error: 'Invalid type specified. Use "equipment" or "types".' };
          }
  
        default:
          setResponseStatus(event, 405);
          return { error: 'Method Not Allowed' };
      }
    } catch (error) {
      throw new Error(`Error fetching data from table: ${error.message}`);
    }
  });
  