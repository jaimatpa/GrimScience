import { getSources } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case "GET":
        const sources = await getSources();
        return { body: sources, message: "Success" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching sources: ${error.message}`);
  }
});