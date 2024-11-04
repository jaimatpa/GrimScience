// import sequelize from "~/server/utils/databse";


// export default eventHandler(async (event) => {
//     try {
//         const method = event._method;

//         switch (method) {
//             case 'GET':
//                 const [techs] = await sequelize.query(`SELECT DISTINCT soldby FROM tblOrder WHERE soldby LIKE N'#%'`)
//                 const fields = await sequelize.query(`SELECT DISTINCT soldby FROM tblOrder WHERE soldby LIKE N'#%'`)

//                 return { body: { techs: ["", ...techs.map(e => e.soldby)],{ fields }
//         }, message: ''
//     }

//             default:
//     setResponseStatus(event, 405);
//     return { error: 'Method Not Allowed' };
// }

//     } catch (error) {
//     throw new Error(`Error fetching data from table: ${error.message}`);
// }
// });