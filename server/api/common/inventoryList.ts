import { getInventoryList } from "~/server/controller/common/Vendors";

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    switch (method.toUpperCase()) {
      case "GET":
        const inventoryList = await getInventoryList();
        return { body: inventoryList, message: "Success!" };
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
