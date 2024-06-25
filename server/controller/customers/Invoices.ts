import { Op, Sequelize } from 'sequelize';
import { tblOrder, tblOrderDetail } from "~/server/models";

const applyFilters = (params) => {
  const filterParams = ['uniqueid', 'date', 'customer', 'vendor', 'name', 'for', 'takenby'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  return whereClause;
};

export const orderExistByID = async (id: number | string) => {
  const tableDetail = await tblOrder.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const orderDetailExistByOrderID = async (id: number | string) => {
  const tableDetail = await tblOrderDetail.findOne({
    where: {orderid: id}
  });
  if(tableDetail)
    return true;
  else
    return false;
}

export const orderDetailExistByUniqueID = async (id: number | string) => {
  const tableDetail = await tblOrderDetail.findOne({
    where: {UniqueID: id}
  });
  if(tableDetail)
    return true;
  else
    return false;
}

export const getOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblOrder.findAll({
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getOrderDetail = async (id: number | string) => {
  const list = await tblOrderDetail.findAll({
    where: {
      orderid: id
    },
    order: [['UniqueID', 'ASC']],
  });
  return list;
}

export const getLastCusomterID  = async () => {
  const result = await tblOrder.max('UniqueID')
  return result;
}

export const getNumberOfOrders = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfMessages = await tblOrder.count({
    where: whereClause
  });
  return numberOfMessages;
}

export const createOrder = async (data) => {
  try{
    const newOrder = await tblOrder.create(data);
    return newOrder
  }catch(error){
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
}

export const creteOrderDetail = async (data) => {
  try{
    const newOrderDetail = await tblOrderDetail.create(data);
    return newOrderDetail
  }catch(error){
    throw new Error(`Error fetching data from table: ${error.message}`);
  }
}

export const getOrderByID = async (id) => {
  const tableDetail = await tblOrder.findByPk(id);
  return tableDetail
}

export const updateOrder = async (id, reqData) => {
  await tblOrder.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const updateOrderDetail = async (id, reqData) => {
  await tblOrderDetail.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteOrderDetail = async (id) => {
  await tblOrderDetail.destroy({where: { UniqueID: id }});
  return id
}