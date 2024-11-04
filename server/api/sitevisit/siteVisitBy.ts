import { getSiteVisitBy } from "~/server/controller/sitevisit";

// export default eventHandler(async (event) => {
//   try {
//     const method = event._method;

//     switch (method.toUpperCase()) {
//       case "GET":
//         const professions = await getSiteVisitBy();
//         return { body: professions, message: "" };
//       default:
//         setResponseStatus(event, 405);
//         return { error: "Method Not Allowed" };
//     }
//   } catch (error) {
//     throw new Error(`Error fetching data from table: ${error.message}`);
//   }
// });


export default eventHandler(async (event) => {
  try {
    const employees = await getSiteVisitBy();
    return { body: employees };
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
});