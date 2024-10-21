import { getAllParts, getParts } from "~/server/controller/materials";

export default eventHandler(async (event) => {
  try {
    const method = event._method;
    const { page, pageSize, sortBy, sortOrder, ...filterParams } =
      getQuery(event);

    switch (method.toUpperCase()) {
      case "GET":
        const list = await getAllParts(
          page,
          pageSize,
          sortBy,
          sortOrder,
          filterParams
        );
        return { body: list, message: "" };
      default:
        setResponseStatus(event, 405);
        return { error: "Method Not Allowed" };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});
