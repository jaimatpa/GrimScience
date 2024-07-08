import { Sequelize, Op } from "sequelize";
import { tblNonConformance, tblServiceReport, tblComplaints } from "~/server/models";

export const getNonConformances = async (params) => {
  const { uniqueID, STATUS, OpenClosed, TAGASSIGNEDTO, TAGLOCATION, PARTS, SERVICEREPORT, JobNum, InvestigationNum, complaintnumber } = params
  let whereClause = {}
  if(uniqueID) whereClause['uniqueID'] = {[Op.like]: `%${uniqueID}%`}
  if(STATUS) whereClause['STATUS'] = {[Op.like]: `%${STATUS}%`}
  if(TAGASSIGNEDTO) whereClause['TAGASSIGNEDTO'] = {[Op.like]: `%${TAGASSIGNEDTO}%`}
  if(TAGLOCATION) whereClause['TAGLOCATION'] = {[Op.like]: `%${TAGLOCATION}%`}
  if(PARTS) whereClause['PARTS'] = {[Op.like]: `%${PARTS}%`}
  if(SERVICEREPORT) whereClause['SERVICEREPORT'] = {[Op.like]: `%${SERVICEREPORT}%`}
  if(JobNum) whereClause['JobNum'] = {[Op.like]: `%${JobNum}%`}
  if(InvestigationNum) whereClause['InvestigationNum'] = {[Op.like]: `%${InvestigationNum}%`}
  if(OpenClosed === 'true') whereClause['OpenClosed'] = 'Open' 

  tblNonConformance.hasOne(tblServiceReport, {foreignKey: 'uniqueID', sourceKey: 'SERVICEREPORT'})
  tblServiceReport.hasOne(tblComplaints, {foreignKey: 'uniqueID', sourceKey: 'COMPLAINTID'})
  const list = await tblNonConformance.findAll({
    attributes: [
      'uniqueID',
      'STATUS',
      'TAGASSIGNEDTO',
      'TAGLOCATION',
      'PARTS',
      'SERVICEREPORT',
      'JobNum',
      'InvestigationNum',
      'OpenClosed',
      'DISPOSITION',
      'Justification',
      'SERIAL',
    ],
    include: [
      {
        model: tblServiceReport, 
        attributes: ['COMPLAINTID'],
        include: [
          {
            model: tblComplaints,
            attributes: ['COMPLAINTNUMBER'],
            required: true
          }
        ],
      }
    ],
    where: whereClause,
    order: [['uniqueID', 'desc']],
    raw: true
  })

  const formattedList = list.map((item: any) => {
    return {
      uniqueID: item.uniqueID,
      STATUS: item.STATUS,
      TAGASSIGNEDTO: item.TAGASSIGNEDTO,
      TAGLOCATION: item.TAGLOCATION,
      PARTS: item.PARTS,
      SERVICEREPORT: !item.SERVICEREPORT?null:item.SERVICEREPORT,
      JobNum: item.JobNum,
      InvestigationNum: item.InvestigationNum,
      OpenClosed: item.OpenClosed,
      DISPOSITION: item.DISPOSITION,
      Justification: item.Justification,
      SERIAL: item.SERIAL,
      COMPLAINTNUMBER: item['tblServiceReport.tblComplaint.COMPLAINTNUMBER']
    }
  })
  return formattedList;
}