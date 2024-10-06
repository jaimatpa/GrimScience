
// import { eventHandler, getQuery, createError } from 'h3';
// import { getPOPartsDetails } from '~/server/controller/materials';


// export default eventHandler(async (event) => {
//     try {
//         const method = event._method;
//         const { model } = getQuery(event);

//         if (!model) {
//             event.node.res.statusCode = 400;
//             return { error: 'model is required' };
//         }
//         switch (method.toUpperCase()) {
//             case 'GET':
//                 const result = await getPOPartsDetails(model);
//                 return { body: result, message: '' };
//             default:
//                 event.node.res.statusCode = 405;
//                 return { error: 'Method Not Allowed' };
//         }
//     } catch (error) {
//         throw createError({
//             statusCode: 500,
//             statusMessage: `Error fetching inventory transactions: ${error.message}`,
//         });
//     }
// });
