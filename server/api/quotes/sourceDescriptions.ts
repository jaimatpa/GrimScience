import { getSourceDescriptions } from "~/server/controller/quotes/quotes";
import { eventHandler, setResponseStatus, getQuery } from "h3";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    
    switch (method.toUpperCase()) {
      case "GET":
        const query = getQuery(event);
        const source = query.source as string;
        
        if (!source) {
          setResponseStatus(event, 400);
          return { error: "Source parameter is required" };
        }

        const sourceDescriptions = await getSourceDescriptions(source);
        return { body: sourceDescriptions, message: "Success" };
        
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error("API Error:", error);
    setResponseStatus(event, 500);
    return { 
      error: `Error fetching source descriptions: ${error.message}`,
      statusCode: 500
    };
  }
});