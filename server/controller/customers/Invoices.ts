import { Op, Sequelize } from 'sequelize';
import { tblOrder, tblOrderDetail, tblCustomers } from "~/server/models";

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

  tblOrder.belongsTo(tblCustomers, {foreignKey: 'customerid', targetKey: 'UniqueID' })

  let customerWhere = {}

  if(filterParams.customerid) customerWhere['UniqueID'] = {[Op.like]: `%${filterParams.customerid}%`};
  if(filterParams.company) customerWhere['company1'] = {[Op.like]: `%${filterParams.company}%`};
  if(filterParams.zip) customerWhere['zip'] = {[Op.like]: `%${filterParams.zip}%`};
  if(filterParams.customer) customerWhere[Op.or] = Sequelize.where(Sequelize.fn('concat', Sequelize.col('fname'), Sequelize.col('lname')), 'LIKE', `%${filterParams.customer}%`)

  let queryOptions:any = {
    attributes: [
      'UniqueID',
      'orderdate',
      'shipdate',
      'customerid',
      'source',
      'sourcedescription',
      'total'
    ],
    include: [
      {
        model: tblCustomers,
        attributes: ['fname', 'lname', 'company1', 'zip'],
        required: true,
        where: customerWhere
      }
    ],
    order: [['UniqueID', 'ASC']],
    where:{},
    offset,
    limit,
  };
  
  if(filterParams.UniqueID) queryOptions.where['UniqueID'] = {[Op.like]: `%${filterParams.UniqueID}%`}
  if(filterParams.orderdate) queryOptions.where['orderdate'] = {[Op.like]: `%${filterParams.orderdate}%`};
  if(filterParams.shipdate) queryOptions.where['shipdate'] = {[Op.like]: `%${filterParams.shipdate}%`};
  if(filterParams.source) queryOptions.where['source'] = {[Op.like]: `%${filterParams.source}%`};
  if(filterParams.sourcedescription) queryOptions.where['sourcedescription'] = {[Op.like]: `%${filterParams.sourcedescription}%`};

  const list = await tblOrder.findAll(queryOptions);
  
  const formattedList = list.map((item: any) => {
    const parsedOrderDate = new Date(item.orderdate);
    let formattedOrderDate = `${(parsedOrderDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedOrderDate.getDate().toString().padStart(2, '0')}/${parsedOrderDate.getFullYear()}`;
    const parsedShipDate = new Date(item.shipdate);
    let formattedShipDate = `${(parsedShipDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedShipDate.getDate().toString().padStart(2, '0')}/${parsedShipDate.getFullYear()}`;
    
    return {
      UniqueID: item.UniqueID,
      orderdate: formattedOrderDate,
      shipdate: formattedShipDate,
      customerid: item.customerid,
      source: item.source,
      sourcedescription: item.sourcedescription,
      customer: `${item.tblCustomer.fname} ${item.tblCustomer.lname}`,
      company: item.tblCustomer.company1,
      zip: item.tblCustomer.zip,
    }
  })
  return formattedList;
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
  tblOrder.belongsTo(tblCustomers, {foreignKey: 'customerid', targetKey: 'UniqueID' })

  let customerWhere = {}

  if(filterParams.customerid) customerWhere['UniqueID'] = {[Op.like]: `%${filterParams.customerid}%`};
  if(filterParams.company) customerWhere['company1'] = {[Op.like]: `%${filterParams.company}%`};
  if(filterParams.zip) customerWhere['zip'] = {[Op.like]: `%${filterParams.zip}%`};
  if(filterParams.customer) customerWhere[Op.or] = Sequelize.where(Sequelize.fn('concat', Sequelize.col('fname'), Sequelize.col('lname')), 'LIKE', `%${filterParams.customer}%`)

  let queryOptions:any = {
    include: [
      {
        model: tblCustomers,
        required: true,
        where: customerWhere
      }
    ],
    where:{},
  };
  
  if(filterParams.UniqueID) queryOptions.where['UniqueID'] = {[Op.like]: `%${filterParams.UniqueID}%`}
  if(filterParams.orderdate) queryOptions.where['orderdate'] = {[Op.like]: `%${filterParams.orderdate}%`};
  if(filterParams.shipdate) queryOptions.where['shipdate'] = {[Op.like]: `%${filterParams.shipdate}%`};
  if(filterParams.source) queryOptions.where['source'] = {[Op.like]: `%${filterParams.source}%`};
  if(filterParams.sourcedescription) queryOptions.where['sourcedescription'] = {[Op.like]: `%${filterParams.sourcedescription}%`};

  const numberOfOrders = await tblOrder.count(queryOptions);
  return numberOfOrders;
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