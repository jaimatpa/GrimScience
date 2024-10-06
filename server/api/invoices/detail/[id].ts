import { orderDetailExistByUniqueID, deleteOrderDetail  } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    let idExist;
    switch (method.toUpperCase()) {
      case 'GET':
      case 'PUT':
        break;
      case 'DELETE':
        idExist = await orderDetailExistByUniqueID(id);
        if (idExist) {
          const deletedID = await deleteOrderDetail(Number(id));
          return { body: { deletedID }, message: 'OrderDetail deleted successfully' }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The order detail does not exist' }
        }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});