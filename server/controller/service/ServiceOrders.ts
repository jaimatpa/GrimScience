import { Op, Sequelize } from 'sequelize';
import { tblCustomers, tblComplaints, tblBP, tblServiceReport, tblInventoryTransactions, tblInventoryTransactionDetails } from "~/server/models";
import { format } from 'date-fns';

export const getServiceOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.company) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company}%`};
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const list = await tblComplaints.findAll({
    attributes: [
      'uniqueID',
      'COMPLAINTNUMBER',
      'SERIALNO',
      'COMPLAINTDATE',
      'FAILINVEST',
      'OPENCASE',
      'INJURYREPORTNO',
      'WarrentyService',
      [Sequelize.col('tblCustomer.company1'), 'company1'],
      [Sequelize.col('tblCustomer.UniqueID'), 'customerID']
    ],
    include: [
      {
        model: tblCustomers,
        attributes: ['UniqueID', 'company1'],
        where: customerWhereClause
      }
    ],
    where: {
      OPENCASE: 0,
      ...whereClause
    },
    order: [[sortBy as string || 'COMPLAINTNUMBER', sortOrder as string || 'DESC']],
    offset,
    limit,
    raw: true
  })
  const formattedList = list.map((item: any) => {
    let openCase;
    let injury;
    let warranty;
    if(item.OPENCASE === '0') 
      openCase = 'OPEN'
    else
      openCase = 'CLOSE'
    if(item.injury === 0)
      injury = 'NO'
    else 
      injury = 'YES'
    if(item.WarrentyService === -1)
      warranty = 'YES'
    else
      warranty = 'NO'
    let complaintDate = new Date(item.COMPLAINTDATE).toISOString().split('T')
    complaintDate = complaintDate[0].split('-')
    let formattedDate = `${complaintDate[1]}/${complaintDate[2]}/${complaintDate[0]}`
    return {
      uniqueID: item.uniqueID,
      COMPLAINTNUMBER: item.COMPLAINTNUMBER,
      SERIALNO: item.SERIALNO,
      FAILINVEST: item.FAILINVEST,
      COMPLAINTDATE: formattedDate,
      Status: openCase,
      INJURYREPORTNO: injury,
      Warranty: warranty,
      customerID: item['tblCustomer.UniqueID'],
      company1: item['tblCustomer.company1']
    }
  })
  return formattedList;
}

export const getAllServiceOrders = async (sortBy, sortOrder, filterParams) => {
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.company) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company}%`};
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const list = await tblComplaints.findAll({
    attributes: [
      'uniqueID',
      'COMPLAINTNUMBER',
      'SERIALNO',
      'COMPLAINTDATE',
      'FAILINVEST',
      'OPENCASE',
      'INJURYREPORTNO',
      'WarrentyService',
      [Sequelize.col('tblCustomer.company1'), 'company1'],
      [Sequelize.col('tblCustomer.UniqueID'), 'customerID']
    ],
    include: [
      {
        model: tblCustomers,
        attributes: ['UniqueID', 'company1'],
        where: customerWhereClause
      }
    ],
    where: {
      OPENCASE: 0,
      ...whereClause
    },
    order: [[sortBy as string || 'COMPLAINTNUMBER', sortOrder as string || 'DESC']],
    raw: true
  })
  const formattedList = list.map((item: any) => {
    let openCase;
    let injury;
    let warranty;
    if(item.OPENCASE === '0') 
      openCase = 'OPEN'
    else
      openCase = 'CLOSE'
    if(item.injury === 0)
      injury = 'NO'
    else 
      injury = 'YES'
    if(item.WarrentyService === -1)
      warranty = 'YES'
    else
      warranty = 'NO'
    let complaintDate = new Date(item.COMPLAINTDATE).toISOString().split('T')
    complaintDate = complaintDate[0].split('-')
    let formattedDate = `${complaintDate[1]}/${complaintDate[2]}/${complaintDate[0]}`
    return {
      uniqueID: item.uniqueID,
      COMPLAINTNUMBER: item.COMPLAINTNUMBER,
      SERIALNO: item.SERIALNO,
      FAILINVEST: item.FAILINVEST,
      COMPLAINTDATE: formattedDate,
      Status: openCase,
      INJURYREPORTNO: injury,
      Warranty: warranty,
      customerID: item['tblCustomer.UniqueID'],
      company1: item['tblCustomer.company1']
    }
  })
  return formattedList;
}

export const getNumberOfServiceOrders = async (filterParams) => {
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.company) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company}%`};
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const numberOfServiceOrders = await tblComplaints.count({
    include: [
      {
        model: tblCustomers,
        attributes: ['company1'],
        where: customerWhereClause
      }
    ],
    where: {
      OPENCASE: 0,
      ...whereClause
    },
  })
  return numberOfServiceOrders;
}

export const getServiceReports = async (params) => {
  const { uniqueID, COMPLAINTID } = params
  let where = {}
  if(uniqueID) where['uniqueID'] = uniqueID
  if(COMPLAINTID) where['COMPLAINTID'] = COMPLAINTID
  const reports = await tblServiceReport.findAll({
    where: where,
    raw: true
  })
  const formattedReports = reports.map((item: any) => {
    return {
      ...item,
      REPAIRDATE: format(new Date(item.REPAIRDATE), 'MM/dd/yyyy')
    }
  })
  return formattedReports
}

export const createServiceReport = async (data) => {
  const { Parts, PartsReceived, DATESHIPPED } = data
  const lastUniqueID: number = await tblServiceReport.max('uniqueID')
  let PARTS = ''
  let PARTSRECEIVED = ''
  let shippingDate;
  if(Parts) {
    Parts.forEach((part: any) => {
      PARTS += `${part.UniqueID}=${part.Quantity}=${part.PRIMARYPRICE1}=`
    })
  }
  if(PartsReceived) {
    PartsReceived.forEach((part: any) => {
      PARTSRECEIVED += `${part.UniqueID}=${part.Quantity}=${part.PRIMARYPRICE1}=`
    })
  }
  if(DATESHIPPED !== null) {
    shippingDate = Sequelize.literal(`CAST('${DATESHIPPED}' AS DATETIME)`)
  } else {
    shippingDate = null
  }
  const reqData = {
    ...data,
    DATESHIPPED: shippingDate,
    CANO: lastUniqueID + 1,
    Year: new Date(data.REPAIRDATE).getFullYear(),
    REPAIRDATE: format(new Date(data.REPAIRDATE), 'MM/dd/yyyy hh:mm:ss a'),
    PARTS: PARTS,
    PARTSRECEIVED: PARTSRECEIVED
  }
  const newServiceReport = await tblServiceReport.create(reqData);
  if(Parts) {
    const newInventoryTransaction = await tblInventoryTransactions.create({
      Dated: format(new Date(data.REPAIRDATE), 'yyyy-MM-dd HH:mm:ss.SSS'),
      By: data.REPAIRSBY,
      Justification: 'System Generated - Service Report',
      ServiceReportID: newServiceReport.dataValues?.uniqueID,
      JobDetailID: 0,
      JobID: 0, 
      InvoiceID: 0,
      VendorInvoiceID: 0,
      Manual: '',
      PONumber: 0,
      OperationID: 0
    })
    for(const part of Parts) {
      const newInventoryTransactionDetail = await tblInventoryTransactionDetails.create({
        InventoryTransactionID: newInventoryTransaction.dataValues?.uniqueID,
        InstanceID: part.instanceID,
        BPID: part.UniqueID,
        QtyChange: -part.Quantity,
        OnHand: part.OnHand
      })
    }
  }
  
  return newServiceReport
}

export const serviceReportExistByID = async (id) => {
  const tableDetail = await tblServiceReport.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const updateServiceReport = async (id, reqData) => {
  const { Parts, PartsReceived, DATESHIPPED } = reqData
  let PARTS = ''
  let PARTSRECEIVED = ''
  let shippingDate;
  if(Parts) {
    Parts.forEach((part: any) => {
      PARTS += `${part.UniqueID}=${part.Quantity}=${part.PRIMARYPRICE1}=`
    })
  }
  if(PartsReceived) {
    PartsReceived.forEach((part: any) => {
      PARTSRECEIVED += `${part.UniqueID}=${part.Quantity}=${part.PRIMARYPRICE1}=`
    })
  }
  if(DATESHIPPED !== null) {
    shippingDate = Sequelize.literal(`CAST('${DATESHIPPED}' AS DATETIME)`)
  } else {
    shippingDate = null
  }
  let updatedReqData
  updatedReqData = {
    ...reqData,
    DATESHIPPED: shippingDate,
    Year: new Date(reqData.REPAIRDATE).getFullYear(),
    REPAIRDATE: format(new Date(reqData.REPAIRDATE), 'MM/dd/yyyy hh:mm:ss a'),
    PARTS: PARTS,
    PARTSRECEIVED: PARTSRECEIVED
  }
  await tblServiceReport.update(updatedReqData, {
    where: { uniqueID: id }
  });
  return id;
}