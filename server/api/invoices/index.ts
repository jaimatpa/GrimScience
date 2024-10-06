import { getOrders, createOrder, creteOrderDetail } from '~/server/controller/invoices';

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event);
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'GET':
        const list = await getOrders(page, pageSize, sortBy, sortOrder, filterParams);
        return { body: list, message: '' }
      case 'POST':
        const data = await readBody(event);
        const { orderDetail, ...orderData } = data
        const newOrder: any = await createOrder(orderData)
        let formattedOrderDetail = [];
        orderDetail.forEach(order => {
          const tmp = {
            quantity: order.quantity,
            name: order.DESCRIPTION,
            price: order.PRIMARYPRICE1,
            serial: order?.serial ?? '',
            orderid: newOrder.UniqueID,
            bpid: order.bpid
          }
          formattedOrderDetail.push(tmp)
        });
        formattedOrderDetail.map(async (order) => {
          await creteOrderDetail(order)
        })
        setResponseStatus(event, 201);
        return { body: newOrder, message: "New order created successfully." }
      case 'PUT':

      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
});