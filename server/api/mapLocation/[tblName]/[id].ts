import {
  customerIDFromComplaints,
  customerIDFromOrder,
} from "~/server/controller/mapLocation/getID";

export default eventHandler(async (event) => {
  try {
    const tblName = event.context.params.tblName;
    const id = event.context.params.id;
    const method = event._method;

    switch (method.toUpperCase()) {
      case "GET":
        if (tblName === "tblComplaints") {
          const customerID = await customerIDFromComplaints(id);
          return { body: customerID, message: "Success!" };
        }
        if (tblName === "tblOrder") {
          const customerID = await customerIDFromOrder(id);
          return { body: customerID, message: "Success!" };
        }

      case "POST":

      case "PUT":

      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
