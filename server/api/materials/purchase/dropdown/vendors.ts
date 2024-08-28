import { getVendorDropDownList } from "~/server/controller/materials";

export default eventHandler(async (event) => {
  const method = event._method;
  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const vendors = await getVendorDropDownList();
        return { body: vendors, status: 200 };
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});
