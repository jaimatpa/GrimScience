import { tblComplaints } from "~/server/models";

export const  getComplaints = async (params) => {
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