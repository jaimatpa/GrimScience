import { getAllEquipmentList } from '~/server/controller/maintenance/equipment';

export default eventHandler(async (event) => {
  try {
    const { method } = event.node.req;  
    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getAllEquipmentList();
        return list 
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
//     const method = event._method;
//     switch(method.toUpperCase()){
//       case 'GET':
//         const list = await getAllCategoryList();
//         return { body: list, message: '' }
//       default:
//         setResponseStatus(event, 405);
//         return { error: 'Method Not Allowed' };
//     }
//   } catch (error) {
//     throw new Error(`Error fetching data from table: ${error.message}`);
//   }
// });