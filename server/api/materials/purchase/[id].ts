import { getPurchaseById } from "~/server/controller/materials";

export default eventHandler(async (event) => {
  const method = event._method;
  const id = event.context.params.id;

  console.log(id);
  try {
    switch (method.toUpperCase()) {
      case "GET": {
        const purchase = await getPurchaseById(parseInt(id));
        return { body: purchase, status: 200 };
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
});
