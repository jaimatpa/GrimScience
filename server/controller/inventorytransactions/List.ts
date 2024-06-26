import { Sequelize } from "sequelize";
import { tblInventoryTransactions, tblServiceReport, tblComplaints, tblJobs } from "~/server/models";

export const getInventoryTransactions = async () => {
  try {
    tblInventoryTransactions.hasOne(tblServiceReport, { foreignKey: 'uniqueID', sourceKey: 'ServiceReportID'})
    tblServiceReport.hasOne(tblComplaints, {foreignKey:'uniqueID', sourceKey: 'COMPLAINTID'})
    tblInventoryTransactions.hasOne(tblJobs, {foreignKey: 'UniqueID', sourceKey: 'JobID'})
    const list = await tblInventoryTransactions.findAll({
      attributes: [
        'uniqueid',
        [Sequelize.fn('FORMAT', Sequelize.col('Dated'), 'MM/dd/yyyy'), 'Dated'],
        'By',
        'JobDetailID',
        'JobID',
        'ServiceReportID',
        'InvoiceID',
        'VendorInvoiceID',
        'PONumber',
        'OperationID'
      ],
      include: [
        {
          model: tblServiceReport, 
          attributes: ['uniqueID'],
          include: [
            {
              model: tblComplaints,
              attributes: ['COMPLAINTNUMBER']
            }
          ]
        }, 
        {
          model: tblJobs,
          attributes: ['NUMBER']
        }
      ],
      order: [[Sequelize.fn('CONVERT', Sequelize.literal('date'), Sequelize.col('Dated')), 'DESC']],
      limit: 50
    });
    
    const formattedList = list.map((item: any) => {
      let type = item.JobID?'Job':item.ServiceReportID?'Service Report':item.InvoiceID?'Invoice':item.PONumber?'PO':null
      return {
        uniqueid: item.uniqueid,
        Dated: item.Dated,
        By: item.By,
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
    return err.message;
  }
};