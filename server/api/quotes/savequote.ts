// import { eventHandler, setResponseStatus } from "h3";

// export default eventHandler(async (event) => {
//   try {
//     const result = await saveQuote(event);
//     setResponseStatus(event, 200);
//     return {
//       statusCode: 200,
//       body: {
//         success: true,
//         message: "Quote saved successfully",
//         data: result.body,
//       },
//     };
//   } catch (error) {
//     console.error("Error in saveQuote API:", error);
//     setResponseStatus(event, 500);
//     return {
//       statusCode: 500,
//       body: {
//         success: false,
//         message: "Failed to save quote",
//         error: error.message,
//       },
//     };
//   }
// });

import { eventHandler, setResponseStatus } from "h3";
import { saveQuote } from "~/server/controller/quotes/quotes";

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case "POST":
        const result = await saveQuote(event);
        return { body: result, message: "Success" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching product lines: ${error.message}`);
  }
});
