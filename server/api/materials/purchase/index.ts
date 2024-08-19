import {
  createPurchase,
  deletePurchase,
  getAllPurchase,
} from "../../../controller/materials/purchase";

export default eventHandler(async (event) => {
  const method = event._method;
  const body = readBody(event);
  console.log(body);

  const { UniqueId, sortBy, sortOrder, ...filterParams } = getQuery(event);
  console.log({ UniqueId, sortBy, sortOrder, ...filterParams });

  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const list = await getAllPurchase(sortBy, sortOrder, filterParams);
        console.log(list);
        return { body: list, status: 200 };
      }
      case "DELETE": {
        const deleteConfirmation = await deletePurchase(UniqueId);
        return {
          body: deleteConfirmation,
          status: 201,
          message: "Purchase deleted successfully",
        };
      }
      case "POST": {
        const createConfirmation = await createPurchase(body);

        return {
          body: createConfirmation,
          status: 201,
          message: "Purchase created successfully",
        };
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});
