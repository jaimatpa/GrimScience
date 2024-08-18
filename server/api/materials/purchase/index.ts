import { getAllPurchase } from "../../../controller/materials/purchase";

export default eventHandler(async (event) => {
  const method = event._method;

  const { sortBy, sortOrder, ...filterParams } = getQuery(event);

  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const list = await getAllPurchase(sortBy, sortOrder, filterParams);
        console.log(list);
        return { body: list, status: 200 };
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});
