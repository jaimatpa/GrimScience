import { Op, Sequelize } from 'sequelize';
import { tblOrder, tblOrderDetail, tblCustomers, tblServiceReport } from "~/server/models";

export const orderExistByID = async (id: number | string) => {
  const tableDetail = await tblOrder.findByPk(id);
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
  tblOrder.hasMany(tblOrderDetail, { foreignKey: 'orderid', sourceKey: 'UniqueID' })

  let customerWhere = {}
  let orderDetailWhere = {}

  if(filterParams.customerid) customerWhere['UniqueID'] = {[Op.like]: `%${filterParams.customerid}%`};
  if(filterParams.company) customerWhere['company1'] = {[Op.like]: `%${filterParams.company}%`};
  if(filterParams.zip) customerWhere['zip'] = {[Op.like]: `%${filterParams.zip}%`};
  if(filterParams.customer) customerWhere[Op.or] = Sequelize.where(Sequelize.fn('concat', Sequelize.col('fname'), Sequelize.col('lname')), 'LIKE', `%${filterParams.customer}%`)
  if(filterParams.serial) orderDetailWhere['serial'] = {[Op.like]: `%${filterParams.serial}%`};
  let queryOptions:any = {
    attributes: { exclude: [] },
    include: [
      {
        model: tblCustomers,
        attributes: ['fname', 'lname', 'company1', 'zip'],
        required: true,
        where: customerWhere
      },
      {
        model: tblOrderDetail,
        attributes: ['serial'],
        required: true,
        where: orderDetailWhere
      }
    ],
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    where:{
      status: 'Open'
    },
    offset,
    limit,
    disticnt: true
  };
  if(filterParams.UniqueID) queryOptions.where['UniqueID'] = {[Op.like]: `%${filterParams.UniqueID}%`}
  if(filterParams.orderdate) queryOptions.where['orderdate'] = {[Op.like]: `%${filterParams.orderdate}%`};
  if(filterParams.shipdate) queryOptions.where['shipdate'] = {[Op.like]: `%${filterParams.shipdate}%`};
  if(filterParams.source) queryOptions.where['source'] = {[Op.like]: `%${filterParams.source}%`};
  if(filterParams.sourcedescription) queryOptions.where['sourcedescription'] = {[Op.like]: `%${filterParams.sourcedescription}%`};
  if(!filterParams.orderdate && !filterParams.shipdate) queryOptions.where[Op.and] =[
      {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.orderdate')),  '>=', `${filterParams.from.replace(/"/g, '')}`),
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.orderdate')),  '<=', `${filterParams.to.replace(/"/g, '')}`)
        ]
      }, {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.shipdate')),  '>=', `${filterParams.from.replace(/"/g, '')}`),
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.shipdate')),  '<=', `${filterParams.to.replace(/"/g, '')}`)
        ]
      }
    ] 
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

export const getOrderDetail = async (params) => {
  const { orderid } = params
  let whereClause = {}
  if(orderid) whereClause['orderid'] = orderid
  const list = await tblOrderDetail.findAll({
    where: whereClause,
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
  tblOrder.hasMany(tblOrderDetail, { foreignKey: 'orderid', sourceKey: 'UniqueID' })

  let customerWhere = {}
  let orderDetailWhere = {}

  if(filterParams.customerid) customerWhere['UniqueID'] = {[Op.like]: `%${filterParams.customerid}%`};
  if(filterParams.company) customerWhere['company1'] = {[Op.like]: `%${filterParams.company}%`};
  if(filterParams.zip) customerWhere['zip'] = {[Op.like]: `%${filterParams.zip}%`};
  if(filterParams.customer) customerWhere[Op.or] = Sequelize.where(Sequelize.fn('concat', Sequelize.col('fname'), Sequelize.col('lname')), 'LIKE', `%${filterParams.customer}%`)
  if(filterParams.serial) orderDetailWhere['serial'] = {[Op.like]: `%${filterParams.serial}%`};
  let queryOptions:any = {
    attributes: { exclude: [] },
    include: [
      {
        model: tblCustomers,
        attributes: ['fname', 'lname', 'company1', 'zip'],
        required: true,
        where: customerWhere
      },
      {
        model: tblOrderDetail,
        attributes: ['serial'],
        required: true,
        where: orderDetailWhere
      }
    ],
    where:{
      status: 'Open'
    },
    disticnt: true
  };
  if(filterParams.UniqueID) queryOptions.where['UniqueID'] = {[Op.like]: `%${filterParams.UniqueID}%`}
  if(filterParams.orderdate) queryOptions.where['orderdate'] = {[Op.like]: `%${filterParams.orderdate}%`};
  if(filterParams.shipdate) queryOptions.where['shipdate'] = {[Op.like]: `%${filterParams.shipdate}%`};
  if(filterParams.source) queryOptions.where['source'] = {[Op.like]: `%${filterParams.source}%`};
  if(filterParams.sourcedescription) queryOptions.where['sourcedescription'] = {[Op.like]: `%${filterParams.sourcedescription}%`};
  if(!filterParams.orderdate && !filterParams.shipdate) queryOptions.where[Op.and] =[
      {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.orderdate')),  '>=', `${filterParams.from.replace(/"/g, '')}`),
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.orderdate')),  '<=', `${filterParams.to.replace(/"/g, '')}`)
        ]
      }, {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.shipdate')),  '>=', `${filterParams.from.replace(/"/g, '')}`),
          Sequelize.where(Sequelize.fn('convert',Sequelize.literal('date'), Sequelize.col('tblOrder.shipdate')),  '<=', `${filterParams.to.replace(/"/g, '')}`)
        ]
      }
    ] 
  const numberOfOrders = await tblOrder.count(queryOptions);
  return numberOfOrders;
}

export const createOrder = async (data) => {
  try{
    let newData = {}
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (['orderdate', 'shipdate', 'invoicedate', 'installationdate', 'acceptancedate', 'expirationdate'].includes(key)) {
        const inputDate = new Date(data[key]);
        const month = inputDate.getMonth() + 1;
        const day = inputDate.getDate();
        const year = inputDate.getFullYear();
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const seconds = inputDate.getSeconds();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedDate = `${month}/${day}/${year} ${formattedHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${amOrPm}`;
        newData[key] = formattedDate
      } else newData[key] = data[key]
    }
    const newOrder = await tblOrder.create(newData);
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

export const getServiceOrderInvoices = async (params) => {
  const { COMPLAINTID } = params
  let where = {}
  if(COMPLAINTID) where['COMPLAINTID'] = COMPLAINTID
  let invoiceList = []
  let invoiceListTmp = await tblServiceReport.findAll({
    attributes: [
      'INVOICES'
    ],
    where: {
      COMPLAINTID: COMPLAINTID
    }
  })
  invoiceListTmp = invoiceListTmp.map((item: any) => item.INVOICES)
  invoiceListTmp.map((item: any) => {
    if(item !=='' && item !== null) {
      const tmp = item.split('=')
      tmp.map((invoice: any) => {
        if(!invoiceList.includes(invoice) && Number(invoice)) invoiceList.push(invoice)
      })
    }
  })
  const result = await tblOrder.findAll({
    attributes: [
      'UniqueID',
      [Sequelize.literal("FORMAT(CONVERT(datetime, [orderdate], 101), 'MM/dd/yyyy')"), 'orderdate'],
      'invoicenumber',
      'terms'
    ],
    where: {
      [Op.or]: [
        {
          invoicenumber: {
            [Op.in]: invoiceList
          }
        }, 
        { complaintID: COMPLAINTID }
      ]
    }
  })
  return result
}

export const getSerials = async (params) => {
  const { customerid } = params
  let whereClause = {}
  if(customerid) whereClause['customerid'] = customerid
  tblOrderDetail.hasOne(tblOrder, { foreignKey: 'UniqueID', sourceKey: 'orderid' })
  const list = await tblOrderDetail.findAll({
    attributes: [ 
      'UniqueID',
      'serial'
    ], 
    where: {
      serial: {
        [Op.not]: null,
        [Op.ne]: ''
      }
    }, 
    include: [
      {
        model: tblOrder,
        attributes: ['UniqueID'],
        where: whereClause,
        required: true,
      }, 
    ],
    order: [['serial', 'ASC']],
    raw: true
  });
  const result = list.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      serial: item.serial
    }
  });
  return result;
}