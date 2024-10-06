import {
  createPurchase,
  deletePurchase,
  getAllPurchase,
} from "~/server/controller/materials/purchase";

export default eventHandler(async (event) => {
  const method = event._method;

  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const { offset, limit, sortBy, sortOrder, ...filterParams } = getQuery(event);
        const list = await getAllPurchase(offset, limit, sortBy, sortOrder, filterParams);
        console.log(list);
        return { body: list, status: 200 };
      }
      case "DELETE": {
        const { UniqueID } = getQuery(event);
        console.log(UniqueID);
        const deleteConfirmation = await deletePurchase(UniqueID);
        return {
          body: deleteConfirmation,
          status: 201,
          message: "Purchase deleted successfully",
        };
      }
      case "POST": {
        const purchaseData = await readBody(event);
        const createConfirmation = await createPurchase(purchaseData);

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
