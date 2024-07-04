import { tblInvestigations, tblInvestigationComplaint } from "~/server/models";

export const  getInvestigations = async (params) => {
  const { uniqueID, ComplaintID } = params
  let where = {}
  const list = await tblInvestigations.findAll({
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

