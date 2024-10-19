import { tblMaintainenceOrders , tblMaintainenceReports } from '~/server/models';

export default defineEventHandler(async (event) => {
  const orderId = event.context.params.id;
  const body = await readBody(event);

  const { MANo, date, type, reports } = body;

  // Check if order exists
  const order = await tblMaintainenceOrders .findByPk(orderId);
  if (!order) {
    setResponseStatus(event, 404);
    return { message: 'Order not found' };
  }

  // Update order details
  await order.update({
    MANo,
    date,
    type,
  });

  // If reports are provided, update them as well
  if (reports && reports.length > 0) {
    await tblMaintainenceReports.destroy({ where: { orderid: orderId } });
    
    const newReports = reports.map(report => ({
      ...report,
      orderid: orderId,
    }));

    await tblMaintainenceReports.bulkCreate(newReports);
  }

  return { message: 'Order updated successfully', order };
});