import { getVendorNames } from "~/server/controller/materials/Parts";
import { defineEventHandler, setResponseStatus } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const method = event.req.method;

    switch (method.toUpperCase()) {
      case "GET":
        const list = await getVendorNames();
        return { body: list, message: "" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error("Error fetching data from table:", error.message);
    setResponseStatus(event, 500);
    return { error: `Error fetching data from table: ${error.message}` };
  }
});
