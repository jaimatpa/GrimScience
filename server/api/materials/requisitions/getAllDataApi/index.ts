import { getAllEmployeeList, getAllTableDataForRequisition, getAllTRefutationData } from '~/server/controller/materials/requisitions';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;
    
    switch (method.toUpperCase()) {
      case 'GET':
        const { type, ...filterParams } = getQuery(event);

        if (type === 'employee') {
          const employeeList = await getAllEmployeeList();
          return { employeeList };

        }else if (type === 'table') {
          const tableData = await getAllTableDataForRequisition(filterParams);
          return { tableData };
        }else if (type === 'table2') {
          const tableData = await getAllTRefutationData(filterParams);
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

// import { getAllEmployeeList, getAllTableDataForRequisition } from '~/server/controller/materials/requisitions';

// export default eventHandler(async (event) => {
//   try {
//     const { method } = event.node.req;
    
//     switch (method.toUpperCase()) {
//       case 'GET':
//         const { type } = getQuery(event);
        
//         if (type === 'employee') {
//           const employeeList = await getAllEmployeeList();
//           return { body: employeeList };
//         } else if (type === 'table') {
//           const tableData = await getAllTableDataForRequisition();
//           return {tableData};
//         } else {
//           setResponseStatus(event, 400);
//           return { error: 'Invalid type specified. Use "employee" or "table".' };
//         }
        
//       default:
//         setResponseStatus(event, 405);
//         return { error: 'Method Not Allowed' };
//     }
//   } catch (error) {
//     console.error(`Error fetching data: ${error.message}`);
//     setResponseStatus(event, 500);
//     return { error: `Error fetching data: ${error.message}` };
//   }
// });



