import { getEquipmentTableData } from '~/server/controller/maintenance/equipment';


export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;
    switch(method.toUpperCase()){
      case 'GET':
        const list = await getEquipmentTableData(page, pageSize, sortBy, sortOrder, filterParams);
        return { body: list, message: '' }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});


// import { getAllCategoryList } from '~/server/controller/maintenance/equipment';

// export default eventHandler(async (event) => {
//   try {
//     const { method } = event.node.req;  
//     switch (method.toUpperCase()) {
//       case 'GET':
//         // Fetch the category list
//         const categoryList = await getAllCategoryList();
        
//         if (!categoryList || categoryList.length === 0) {
//           // Handle case where no data is found
//           return { body: [], message: 'No categories found' };
//         }

//         // Return the fetched category list
//         return { body: categoryList };
      
//       default:
//         // Handle unsupported methods
//         setResponseStatus(event, 405);
//         return { error: 'Method Not Allowed' };
//     }
//   } catch (error) {
//     // Log and throw any errors that occur during the fetch operation
//     console.error("Error fetching data from table:", error);
//     throw new Error(`Error fetching data from table: ${error.message}`);
//   }
// });
