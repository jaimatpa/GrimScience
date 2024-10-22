import { getAllEmployeeList,getAllTRefutationData } from '~/server/controller/materials/requisitions';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;
    
    switch (method.toUpperCase()) {
      case 'GET':
        const { type, ...filterParams } = getQuery(event);

        
        if (type === 'employee') {
          const employeeList = await getAllEmployeeList();
          return { employeeList };
        }else if (type === 'table2') {
            console.log(filterParams)
          const tableData = await getAllTRefutationData(filterParams);
          console.log("Return", tableData)
          return { tableData };
        } else {
          setResponseStatus(event, 400);
          return { error: 'Invalid type specified. Use "employee" or "table".' };
        }
        
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    setResponseStatus(event, 500);
    return { error: `Error fetching data: ${error.message}` };
  }
});
