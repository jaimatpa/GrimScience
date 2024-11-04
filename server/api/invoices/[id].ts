import { orderExistByID, getOrderByID, updateOrder, creteOrderDetail, updateOrderDetail } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const id = event.context.params.id;
    const method = event._method;

    const idExist = await orderExistByID(id);
    switch (method.toUpperCase()) {
      case 'GET':
        if (idExist) {
          const detail = await getOrderByID(id)
          return { body: detail, message: '' };
        } else {
          setResponseStatus(event, 404);
          return { error: 'The order does not exist' }
        }
      case 'PUT':
        if (idExist) {
          const data = await readBody(event);
          const { orderDetail, ...orderData } = data
          const updatedID: any = await updateOrder(id, orderData)
          let formattedOrderDetail = [];
          if (orderDetail) {
            orderDetail.forEach(order => {
              const tmp = {
                quantity: order.quantity,
                name: order.DESCRIPTION,
                price: order.PRIMARYPRICE1,
                serial: order?.serial ?? '',
                orderid: id,
                bpid: order.bpid,
                UniqueID: order.UniqueID,

                type: order.model
              }
              formattedOrderDetail.push(tmp)
            });
            formattedOrderDetail.map(async (order) => {
              if (order.UniqueID === null) {
                await creteOrderDetail(order)
              } else {
                await updateOrderDetail(order.UniqueID, order)
              }
            })
          }
          return { body: updatedID, message: "Order updated successfully" }
        } else {
          setResponseStatus(event, 404);
          return { error: 'The customer does not exist' }
        }
      case 'DELETE':
        const updatedID: any = await updateOrder(id, { status: 'Closed' })
        return { body: updatedID, message: "Order deleted successfully" }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }

  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});