import { getSubCategoryForCategory } from "~/server/controller/materials";

export default eventHandler(async (event) => {
  try {
    const category = event.context.params.category;
    const method = event._method;

    switch (method.toUpperCase()) {
      case "GET":
        const list = await getSubCategoryForCategory(category);
        return { body: list, message: "Success!" };

      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
