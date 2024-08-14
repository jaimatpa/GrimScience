import { Op, Sequelize } from 'sequelize';
import { tblCustomers, tblComplaints, tblServiceReport, tblInventoryTransactions, tblInventoryTransactionDetails, tblCurrentInventory, tblInventory, tblBP } from "~/server/models";
import { format } from 'date-fns';

export const getServiceTotalBuilt = async (filterParams) => {
  tblInventory.belongsTo(tblBP, { foreignKey: 'BPID', targetKey: 'UniqueID' });
  tblBP.hasMany(tblInventory, { foreignKey: 'BPID', sourceKey: 'UniqueID' });

  let whereClause = {}
  if (filterParams.PRODUCTLINE !== 'null') whereClause['ProductLine'] = { [Op.like]: `%${filterParams.PRODUCTLINE}%` };

  const countDistinctSerials = await tblInventory.count({
    distinct: true,
    col: "serial",
    include: [{
      model: tblBP,
      attributes: ['UniqueID'],
      where: {
        ...whereClause,
        UniqueID: {
          [Op.like]: Sequelize.col('tblInventory.bpid')
        }
      }
    }],
  });

  return countDistinctSerials;
};

export const getServiceOrders = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;
  let whereClause = {}
  let customerWhereClause = {}
  if(filterParams.COMPLAINTNUMBER) whereClause['COMPLAINTNUMBER'] = {[Op.like]: `%${filterParams.COMPLAINTNUMBER}%`};
  if(filterParams.PRODUCTDESC) whereClause['PRODUCTDESC'] = {[Op.like]: `%${filterParams.PRODUCTDESC}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.OPENCASE === 'true') whereClause['OPENCASE'] = 0
  if(filterParams.OPENCASE === 'false') whereClause['OPENCASE'] = 1
  if(filterParams.CRYOThermCheckup === 'true') whereClause['ValidComplaintReason'] = {[Op.like]: `%CRYOTherm Checkup%`};
  if(filterParams.NonMedicalDevice === 'true') whereClause['ValidComplaintReason'] = {[Op.like]: `%Non-Medical Device%`};
  if(filterParams.ValidComplaint === 'true') whereClause['ValidComplaint'] = -1
  if(filterParams.INJURYREPORTNO === 'true') whereClause['INJURYREPORTNO'] = 1
  if(filterParams.company1) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company1}%`};
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
      'ValidComplaint',
      'WarrentyService',
      'ValidComplaintReason',
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
    let complaint;
    if(item.OPENCASE === '0') 
      openCase = 'OPEN'
    else
      openCase = 'CLOSED'
    if(item.INJURYREPORTNO === 0)
      injury = 'NO'
    else 
      injury = 'YES'
    if(item.WarrentyService === -1)
      warranty = 'YES'
    else
      warranty = 'NO'
    if(item.ValidComplaint === '-1')
      complaint = 'Yes'
    else
      complaint = 'NO'
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
      Complaint: complaint,
      customerID: item['tblCustomer.UniqueID'],
      company1: item['tblCustomer.company1']
    }
  })
  return formattedList;
}

export const getComplaintDetail = async (id) => {
  const detail = await tblComplaints.findByPk(id)
  return detail
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
  if(filterParams.PRODUCTDESC) whereClause['PRODUCTDESC'] = {[Op.like]: `%${filterParams.PRODUCTDESC}%`};
  if(filterParams.SERIALNO) whereClause['SERIALNO'] = {[Op.like]: `%${filterParams.SERIALNO}%`};
  if(filterParams.COMPLAINTDATE) whereClause[Op.and] = [
      Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('COMPLAINTDATE'), 'MM/dd/yyyy'), {
        [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`)
      })
    ]
  if(filterParams.FAILINVEST) whereClause['FAILINVEST'] = {[Op.like]: `%${filterParams.FAILINVEST}%`};
  if(filterParams.OPENCASE === 'true') whereClause['OPENCASE'] = 0
  if(filterParams.OPENCASE === 'false') whereClause['OPENCASE'] = 1
  if(filterParams.ValidComplaint === 'true') whereClause['ValidComplaint'] = -1
  if(filterParams.INJURYREPORTNO === 'true') whereClause['INJURYREPORTNO'] = 1
  if(filterParams.company1) customerWhereClause['company1'] = {[Op.like]: `%${filterParams.company1}%`};
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
  const { uniqueID, COMPLAINTID, CANO } = params
  let where = {}
  if(uniqueID) where['uniqueID'] = uniqueID
  if(COMPLAINTID) where['COMPLAINTID'] = COMPLAINTID
  if(CANO) where['CANO'] = `${CANO}`
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

export const  getComplaints = async (params) => {
  const { SERIALNO,COMPLAINTNUMBER } = params
  let where = {}
  if(SERIALNO) where['SERIALNO'] = SERIALNO
  if(COMPLAINTNUMBER) where['COMPLAINTNUMBER'] = COMPLAINTNUMBER
  const list = await tblComplaints.findAll({
    attributes: [
      'uniqueID',
      'COMPLAINTDATE',
      'COMPLAINTNUMBER',
      'COMPLAINT',
      'COMPLAINTDATE',
      'RECBY',
      'PRODUCTDESC',
      'COMPLAINTNUMBER',
      'SERIALNO',
      'FAILINVEST',
      'ValidComplaintReason',
      'OPENCASE',
      'INJURYREPORTNO',
      'WARRANTYUNTIL',
      'ClosedOutBy',
      "MODELNO"
    ],
    where: where,
    raw: true
  })
  const formattedList = list.map((item: any) => {
    let complaintDate = new Date(item.COMPLAINTDATE).toISOString().split('T')
    complaintDate = complaintDate[0].split('-')
    let formattedDate = `${complaintDate[1]}/${complaintDate[2]}/${complaintDate[0]}`
    return {
      ...item,
      COMPLAINTDATE: formattedDate
    }
  })
  return formattedList;
}

export const  getAllComplaints = async () => {
  tblComplaints.hasOne(tblCustomers, {foreignKey: 'UniqueID', sourceKey: 'CustomerID'})
  const list = await tblComplaints.findAll({
    attributes: [
      'uniqueID',
      'COMPLAINTDATE',
      'COMPLAINTNUMBER',
      'COMPLAINT',
      'COMPLAINTDATE',
      'COMPLAINTNUMBER',
      'SERIALNO',
      'ValidComplaintReason',
      'OPENCASE',
      [Sequelize.col('tblCustomer.number'), 'cusomternumber'],
      [Sequelize.col('tblCustomer.fname'), 'cusomterfname'],
      [Sequelize.col('tblCustomer.lname'), 'cusomterlname'],
      [Sequelize.col('tblCustomer.company1'), 'cusomtercompany1'],
    ],
    include: [
      {
        model: tblCustomers,
        attributes: [
          'number',
          'fname',
          'lname',
          'company1'
        ]
      }
    ],
    order: [['COMPLAINTNUMBER', 'asc']],
    raw: true
  })
  const formattedList = list.map((item: any) => {
    let complaintDate = new Date(item.COMPLAINTDATE).toISOString().split('T')
    complaintDate = complaintDate[0].split('-')
    let formattedDate = `${complaintDate[1]}/${complaintDate[2]}/${complaintDate[0]}`
    let status = item.OPENCASE === '1'?'Open':'Closed'

    return {
      COMPLAINTNUMBER: item.COMPLAINTNUMBER,
      COMPLAINTDATE: formattedDate,
      SERIALNO: item.SERIALNO,
      ValidComplaintReason: item.ValidComplaintReason,
      Status: status,
      cusomternumber: item.cusomternumber,
      cusomterfname: item.cusomterfname,
      cusomterlname: item.cusomterlname,
      cusomtercompany1: item.cusomtercompany1,
    }
  })
  return formattedList;
}

export const updateComplaint = async (id, reqData) => {
  const { 
    COMPLAINTDATE, 
    DATEREPORTED, 
    DATEINJURED, 
    DEATH, 
    REPORTBYDATE, 
    REVIEWBYDATE, 
    LASTVISIT,
    DATEREPORTED2, 
    DATEINJURED2,
    DEATH2,
    REPORTBYDATE2, 
    REVIEWBYDATE2,
    LASTVISIT2
  } = reqData
  let updatedReqData
  
  updatedReqData = {
    ...reqData,
    COMPLAINTDATE: COMPLAINTDATE ? Sequelize.literal(`CAST('${COMPLAINTDATE}' AS DATETIME)`): null,
    DATEREPORTED: DATEREPORTED ? format(new Date(DATEREPORTED), 'MM/dd/yyyy'): null,
    DATEINJURED: DATEINJURED ? format(new Date(DATEINJURED), 'MM/dd/yyyy'): null,
    DEATH: DEATH ? format(new Date(DEATH), 'MM/dd/yyyy'): null,
    REPORTBYDATE: REPORTBYDATE ? format(new Date(REPORTBYDATE), 'MM/dd/yyyy'): null,
    REVIEWBYDATE: REVIEWBYDATE ? format(new Date(REVIEWBYDATE), 'MM/dd/yyyy'): null,
    LASTVISIT: LASTVISIT ? format(new Date(LASTVISIT), 'MM/dd/yyyy'): null,
    DATEREPORTED2: DATEREPORTED2 ? format(new Date(DATEREPORTED2), 'MM/dd/yyyy'): null,
    DATEINJURED2: DATEINJURED2 ? format(new Date(DATEINJURED2), 'MM/dd/yyyy'): null,
    DEATH2: DEATH2 ? format(new Date(DEATH2), 'MM/dd/yyyy'): null,
    REPORTBYDATE2: REPORTBYDATE2 ? format(new Date(REPORTBYDATE2), 'MM/dd/yyyy'): null,
    REVIEWBYDATE2: REVIEWBYDATE2 ? format(new Date(REVIEWBYDATE2), 'MM/dd/yyyy'): null,
    LASTVISIT2: LASTVISIT2 ? Sequelize.literal(`CAST('${LASTVISIT2}' AS DATETIME)`): null,
  }
  await tblComplaints.update(updatedReqData, {
    where: { uniqueID: id }
  })
  return id
}


export const getComplainNo = async () => {
  console.log("result")
  const result = await tblComplaints.findAll({
      attributes: [
        [Sequelize.literal('MAX(COMPLAINTNUMBER) + 1'), 'COMPLAINTNUMBER']
      ],
      
      raw: true
  });
  const distinctCatagory = result.length > 0 && result[0]['COMPLAINTNUMBER'] 
    ? result[0]['COMPLAINTNUMBER'] 
    : null;
  
  return distinctCatagory;
}


export const getSerialByCustomer = async (customerId) => {
  
  const result = await tblCurrentInventory.findAll({
    attributes: [
      ['uniqueid', 'SERIALID'],
      'descriptionstring',
      'modelstring'
    ],
    where: {
      Customer: customerId
    },
    raw: true
  });
  return result;
}


export const createComplaint = async (reqData,newCompId,getSerialRes) => {

  const serialID = getSerialRes.length > 0 ? getSerialRes[0]['SERIALID'] : null;
  const prodDesc =  getSerialRes.length > 0 ? getSerialRes[0]['descriptionstring'] : null;
  const modelNo = getSerialRes.length > 0 ? getSerialRes[0]['modelstring'] : null;

  const { 
    COMPLAINTDATE, 
    DATEREPORTED, 
    DATEINJURED, 
    DEATH, 
    REPORTBYDATE, 
    REVIEWBYDATE, 
    LASTVISIT,
    DATEREPORTED2, 
    DATEINJURED2,
    DEATH2,
    REPORTBYDATE2, 
    REVIEWBYDATE2,
    LASTVISIT2,
    CustomerID,
    RECBY
  } = reqData

  let createReqData = null
  
  createReqData = {
    ...reqData,
    COMPLAINTDATE: COMPLAINTDATE ? Sequelize.literal(`CAST('${COMPLAINTDATE}' AS DATETIME)`): null,
    DATEREPORTED: DATEREPORTED ? format(new Date(DATEREPORTED), 'MM/dd/yyyy'): null,
    DATEINJURED: DATEINJURED ? format(new Date(DATEINJURED), 'MM/dd/yyyy'): null,
    DEATH: DEATH ? format(new Date(DEATH), 'MM/dd/yyyy'): null,
    REPORTBYDATE: REPORTBYDATE ? format(new Date(REPORTBYDATE), 'MM/dd/yyyy'): null,
    REVIEWBYDATE: REVIEWBYDATE ? format(new Date(REVIEWBYDATE), 'MM/dd/yyyy'): null,
    LASTVISIT: LASTVISIT ? format(new Date(LASTVISIT), 'MM/dd/yyyy'): null,
    DATEREPORTED2: DATEREPORTED2 ? format(new Date(DATEREPORTED2), 'MM/dd/yyyy'): null,
    DATEINJURED2: DATEINJURED2 ? format(new Date(DATEINJURED2), 'MM/dd/yyyy'): null,
    DEATH2: DEATH2 ? format(new Date(DEATH2), 'MM/dd/yyyy'): null,
    REPORTBYDATE2: REPORTBYDATE2 ? format(new Date(REPORTBYDATE2), 'MM/dd/yyyy'): null,
    REVIEWBYDATE2: REVIEWBYDATE2 ? format(new Date(REVIEWBYDATE2), 'MM/dd/yyyy'): null,
    LASTVISIT2: LASTVISIT2 ? Sequelize.literal(`CAST('${LASTVISIT2}' AS DATETIME)`): null,
    CustomerID: CustomerID,
    COMPLAINTNUMBER: newCompId,
    SERIALID: serialID,
    PRODUCTDESC: `#${modelNo} ${prodDesc} `,
    MODELNO :  modelNo,
    RECBY :RECBY

  }
  const newComplaint = await tblComplaints.create(createReqData)
  return newComplaint
}