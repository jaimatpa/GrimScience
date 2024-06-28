import { Sequelize, Op } from "sequelize";
import { tblInventoryTransactions, tblServiceReport, tblComplaints, tblJobs, tblInventoryTransactionDetails, tblBP } from "~/server/models";

export const getInventoryTransactions = async (filterParams) => {
  try {
    const { Dated, By, uniqueid, JobID, COMPLAINTNUMBER, ServiceReportID, InvoiceID, PONumber, VendorInvoiceID } = filterParams
    let inventoryTransactionsWhere = {}
    let complaintWhere = {}
    let jobWhere = {}
    // if(Dated) inventoryTransactionsWhere[Op.and] = [
    //   Sequelize.fn('FORMAT', Sequelize.col('Dated'), 'MM/dd/yyyy'),
    //   { [Op.like]: `${Dated}%` }
    // ]
    if(By) inventoryTransactionsWhere['By'] = {[Op.like]: `%${By}%`}
    if(uniqueid) inventoryTransactionsWhere['uniqueID'] = {[Op.like]: `%${uniqueid}%`}
    if(ServiceReportID) inventoryTransactionsWhere['ServiceReportID'] = {[Op.like]: `%${ServiceReportID}%`}
    if(InvoiceID) inventoryTransactionsWhere['InvoiceID'] = {[Op.like]: `%${InvoiceID}%`}
    if(PONumber) inventoryTransactionsWhere['PONumber'] = {[Op.like]: `%${PONumber}%`}
    if(VendorInvoiceID) inventoryTransactionsWhere['VendorInvoiceID'] = {[Op.like]: `%${VendorInvoiceID}%`}

    if(JobID) jobWhere['NUMBER'] = {[Op.like]: `%${JobID}%`}

    if(COMPLAINTNUMBER) complaintWhere['COMPLAINTNUMBER'] = {[Op.like]: `%${COMPLAINTNUMBER}%`}
    
    tblInventoryTransactions.hasOne(tblServiceReport, { foreignKey: 'uniqueID', sourceKey: 'ServiceReportID'})
    tblServiceReport.hasOne(tblComplaints, {foreignKey:'uniqueID', sourceKey: 'COMPLAINTID'})
    tblInventoryTransactions.hasOne(tblJobs, {foreignKey: 'UniqueID', sourceKey: 'JobID'})
    const list = await tblInventoryTransactions.findAll({
      attributes: [
        'uniqueid',
        [Sequelize.fn('FORMAT', Sequelize.col('Dated'), 'MM/dd/yyyy'), 'Dated'],
        'By',
        'Justification',
        'JobDetailID',
        'JobID',
        'ServiceReportID',
        'InvoiceID',
        'VendorInvoiceID',
        'PONumber',
        'OperationID'
      ],
      where: inventoryTransactionsWhere,
      include: [
        {
          model: tblServiceReport, 
          required: !COMPLAINTNUMBER?false:true,
          include: [
            {
              model: tblComplaints,
              attributes: ['COMPLAINTNUMBER'],
              where: complaintWhere,
              required: !COMPLAINTNUMBER?false:true 
            }
          ]
        }, 
        {
          model: tblJobs,
          attributes: ['NUMBER'],
          where: jobWhere,
          required: !JobID?false:true
        }
      ],
      order: [[Sequelize.fn('CONVERT', Sequelize.literal('date'), Sequelize.col('Dated')), 'DESC']],
      limit: 50
    });
    
    const formattedList = await list.map((item: any) => {
      let type = item.JobID?'Job':item.ServiceReportID?'Service Report':item.InvoiceID?'Invoice':item.PONumber?'PO':null
      return {
        uniqueid: item.uniqueid,
        Dated: item.Dated,
        By: item.By,
        Justification: item.Justification,
        JobID: item.tblJob?.NUMBER??null,
        ServiceReportID: !item.ServiceReportID?null:item.ServiceReportID,
        InvoiceID: !item.InvoiceID?null:item.InvoiceID,
        VendorInvoiceID: !item.VendorInvoiceID?null:item.VendorInvoiceID,
        PONumber: !Number(item.PONumber)?null:item.PONumber,
        COMPLAINTNUMBER: item.tblServiceReport?.tblComplaint?.COMPLAINTNUMBER??null,
        type: type
      }
    })
    return formattedList;
  } catch(err) {
    throw new Error(err.message);
  }
};

export const getInventoryTransactionDetails = async (id, filterParams) => {
  try {
    const { MODEL } = filterParams
    let bpWhere = {}
    if(MODEL) bpWhere['MODEL'] = {[Op.like]: `%${MODEL}%`}
    if(id === 'undefined'){
      return []
    } else {
      tblInventoryTransactionDetails.hasOne(tblBP, {foreignKey: 'uniqueID', sourceKey: 'BPID'})
      const list = await tblInventoryTransactionDetails.findAll({
        attributes: [
          'uniqueID',
          'QtyChange',
          'OnHand',
          [Sequelize.col('tblBP.UNIT'), 'UNIT'],  
          [Sequelize.col('tblBP.MODEL'), 'MODEL'],  
          [Sequelize.col('tblBP.DESCRIPTION'), 'DESCRIPTION'],  
        ],
        where: {
          InventoryTransactionID: id
        },
        include: [
          {
            model: tblBP,
            attributes: [
              'UNIT',
              'MODEL',
              'DESCRIPTION'
            ],
            required: true,
            where: bpWhere
          }
        ]
      })
      const formattedList = list.map((item: any) => {
        return {
          uniqueID: item.uniqueID,
          QtyChange: item.QtyChange,
          OnHand: item.OnHand,
          UNIT: item.tblBP.UNIT,
          MODEL: item.tblBP.MODEL,
          DESCRIPTION: item.tblBP.DESCRIPTION
        }
      })
      return list
    } 
  } catch(err) {
    throw new Error(err.message)
  }
};

export const createInventoryTransactionDetail = async (data) => {
  try{
    const { onhand, bpid, inventoryid } = data
    const bpRow: any = await tblBP.findByPk(bpid)
    const newDetail = await tblInventoryTransactionDetails.create({
      InventoryTransactionID: inventoryid,
      InstanceID: bpRow.instanceID,
      BPID: bpid,
      QtyChange: 0,
      OnHand: onhand
    })
    return newDetail
  } catch(err) {
    throw new Error(err.message)
  }
}

export const deleteInventoryTransaction = async (id) => {
  try{
    const deleteResult = await tblInventoryTransactions.destroy({
      where: {
        uniqueID: id
      }
    })
    return deleteResult
  } catch(err) {
    throw new Error(err.message)
  }
}

export const deleteInventoryTransactionDetail = async (id) => {
  try{
    const deleteResult = await tblInventoryTransactionDetails.destroy({
      where: {
        uniqueID: id
      }
    })
    return deleteResult
  } catch(err) {
    throw new Error(err.message)
  }
}

export const updateInventoryTransaction = async (id, data) => {
  try{
    // console.log(data.Dated)
    // if(data.Dated) {
    //   data.Dated = new Date(data.Dated)
    //   data.Dated = data.Dated.toISOString();
    //   console.log(data.Dated)
    // }

    console.log(data)
    const updateResult = await tblInventoryTransactions.update({
      By: data.By,
      Justification: data.Justification,
      Dated: data.Dated,
    }, {
      where: {
        uniqueID: id
      }
    })
    return updateResult
  } catch(err) {
    console.log(err)
    throw new Error(err.message)
  }
}