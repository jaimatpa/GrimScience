import { getInspectionNumberList } from "~/server/controller/common/Vendors";

export default eventHandler(async (event) => {
  try {
    const method = event.node.req.method;

    switch (method.toUpperCase()) {
      case "GET":
        const inspectionNumbers = await getInspectionNumberList();
        return { body: inspectionNumbers, message: "" };
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
