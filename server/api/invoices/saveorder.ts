import { createOrder, creteOrderDetail } from "~/server/controller/invoices";

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        
      case 'POST':
        const data = await readBody(event);
        const { orderDetail, ...orderData  } = data
        const newOrder: any = await createOrder(orderData)
        let formattedOrderDetail = [];
        orderDetail.forEach(order => {
          const tmp = {
            quantity: order.quantity, 
            name: order.DESCRIPTION,
            price: order.PRIMARYPRICE1,
            serial: order?.serial??'',
            orderid: newOrder.UniqueID,
            bpid: order.UniqueID
          }
          formattedOrderDetail.push(tmp)
        });
        formattedOrderDetail.map(async (order) => {
          await creteOrderDetail(order)
        })
        setResponseStatus(event, 201);
        return {body: newOrder, message: "New order created successfully." }
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    console.error(error);
    if (error.message.includes('Validation') || error.message.includes('already exists')) {
      setResponseStatus(event, 400);
    } else if (error.message.endsWith('not defined') || error.message.includes('not found') || error.message.includes('not exist')) {
      setResponseStatus(event, 404);
    } else {
      setResponseStatus(event, 500);
    }
    return { error: error.message };
  }
});
