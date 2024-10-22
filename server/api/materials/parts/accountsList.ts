import { getAccountList } from "~/server/controller/materials/Parts";

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;
    switch (method.toUpperCase()) {
      case "GET":
        const categories = await getAccountList();
        return { body: categories, message: "" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error(error);
    setResponseStatus(event, 500);
    return { error: `Error fetching data: ${error.message}` };
  }
});
