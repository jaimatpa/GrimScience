import { Op, Sequelize } from 'sequelize';
import { 
  tblCustomers, 
  tblOrder, 
  tblOrderDetail, 
  tblSourceCodes, 
  tblComplaints, 
  tblServiceReport, 
  tblInventoryTransactions, 
  tblInventoryTransactionDetails 
} from "~/server/models";
import { format } from 'date-fns';

const applyFilters = (params) => {
  const filterParams = ['number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip', 'market', 'source', 'SourceConfrence', 'ParadynamixCatagory'];
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

export const customerExistByID = async (id) => {
  const tableDetail = await tblCustomers.findByPk(id);
  if(tableDetail)
    return true;
  else
    return false;
}

export const getCustomers = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblCustomers.findAll({
    attributes: ['UniqueID', 'number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
    offset,
    limit
  });
  return list;
}

export const getAllCustomers = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyFilters(filterParams);

  const list = await tblCustomers.findAll({
    attributes: ['UniqueID', 'number', 'fname', 'lname', 'company1', 'homephone', 'workphone', 'state', 'zip'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
  });
  return list;
}

export const getNumberOfCustomers = async (filterParams) => {
  const whereClause = applyFilters(filterParams);
  const numberOfCustomers = await tblCustomers.count({
    where: whereClause
  });
  return numberOfCustomers;
}

export const getCustomerDetail = async (id) => {
  const tableDetail = await tblCustomers.findByPk(id);
  return tableDetail
}

export const createCustomer = async (data) => {
  const fullname = `${data.lname}, ${data.fname}`
  const createReqData = {
    ...data,
    fullname: fullname
  };
  const newCustomer = await tblCustomers.create(createReqData);
  return newCustomer
}

export const updateCustomer = async (id, reqData) => {
  let updatedReqData
  if (typeof reqData.adddate === 'string'){
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`,
      adddate: Sequelize.literal(`CAST('${reqData.adddate}' AS DATETIME)`)
    };
  } else {
    updatedReqData = {
      ...reqData,
      fullname: `${reqData.lname}, ${reqData.fname}`
    };
  }
  await tblCustomers.update(updatedReqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteCustomer = async (id) => {
  await tblCustomers.destroy({where: { UniqueID: id }});
  return id;
}

export const getMarkets = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.fn('TRIM', Sequelize.col('market'))), 'market']
    ],
    where: {
      [Op.and]: [
        { market: { [Op.ne]: null } },
        { market: { [Op.ne]: '' } }
      ]
    },
    order: [['market', 'ASC']],
    raw: true
  });

  const distinctMarkets = result.map((item: any) => item.market);
  return distinctMarkets;
}

export const getProfessions = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
    ],
    where: {
      [Op.and]: [
        { source: { [Op.ne]: null } },
        { source: { [Op.ne]: '' } }
      ]
    },
    order: [['source', 'ASC']],
    raw: true
  });

  const distinctProfessions = result.map((item: any) => item.source);
  return distinctProfessions;
}

export const getCategories = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ParadynamixCatagory')), 'ParadynamixCatagory']
    ],
    where: {
      [Op.and]: [
        { ParadynamixCatagory: { [Op.ne]: null } },
        { ParadynamixCatagory: { [Op.ne]: '' } }
      ]
    },
    order: [['ParadynamixCatagory', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item.ParadynamixCatagory);
  return distinctCategories;
}

export const getConferences = async () => {
  const result = await tblCustomers.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SourceConfrence')), 'SourceConfrence']
    ],
    where: {
      [Op.and]: [
        { SourceConfrence: { [Op.ne]: null } },
        { SourceConfrence: { [Op.ne]: '' } }
      ]
    },
    order: [['SourceConfrence', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item.SourceConfrence);
  return distinctCategories;
}

export const getSerialsByCustomerID = async (id) => {
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
        where: {
          customerid: id
        },
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

export const getSources = async () => {
  const list = await tblSourceCodes.findAll({
    attributes: [ 
      [Sequelize.fn('DISTINCT', Sequelize.col('source')), 'source']
    ], 
    where: {
      [Op.and]: [
        { source: { [Op.ne]: null } },
        { source: { [Op.ne]: '' } }
      ]
    }
  })
  const result = list.map((item: any) => {
    return item.source
  })
  return result;
}

export const getSourceDescriptiosBySource = async (source: string | number) => {
  const list = await tblSourceCodes.findAll({
    attributes: [ 
      [Sequelize.fn('DISTINCT', Sequelize.col('description')), 'description']
    ], 
    where: {
      [Op.and]: [
        { description: { [Op.ne]: null } },
        { description: { [Op.ne]: '' } }
      ],
      source: source
    },
    order: [['description', 'ASC']]
  })
  const result = list.map((item: any) => {
    return item.description
  })
  return result;
}

export const getComplaints = async (params) => {
  const { SERIALNO } = params
  let where = {}
  if(SERIALNO) where['SERIALNO'] = SERIALNO
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
      'ValidComplaintReason'
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

export const getServiceOrderInvoicesOfComplaint = async (params) => {
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