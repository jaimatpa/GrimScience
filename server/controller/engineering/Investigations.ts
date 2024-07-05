import { Sequelize, Op, where } from "sequelize";
import { tblInvestigations, tblInvestigationComplaint } from "~/server/models";

export const getInvestigations = async (params) => {
  const { uniqueID, PROBLEMDIAG, DIAGDATE, PRODLINE, DESCRIPTION, Status } = params
  let whereClause = {}
  if(uniqueID) whereClause['uniqueID'] = {[Op.like]: `%${uniqueID}%`};
  if(PROBLEMDIAG) whereClause['PROBLEMDIAG'] = {[Op.like]: `%${PROBLEMDIAG}%`};
  if(DIAGDATE) whereClause[Op.and] = [
    Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('DIAGDATE'), 'MM/dd/yyyy'), {
      [Op.like]: Sequelize.literal(`'%${DIAGDATE}%'`)
    })
  ]
  if(PRODLINE) whereClause['PRODLINE'] = {[Op.like]: `%${PRODLINE}%`};
  if(DESCRIPTION) whereClause['DESCRIPTION'] = {[Op.like]: `%${DESCRIPTION}%`};
  if(Status === 'true') whereClause['Status'] = 'Open'

  const list = await tblInvestigations.findAll({
    attributes: [
      'uniqueID',
      'PROBLEMDIAG',
      [Sequelize.fn('FORMAT', Sequelize.col('tblInvestigations.DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      'PRODLINE',
      'DESCRIPTION',
      'Status',
    ],
    where: whereClause,
    raw: true
  })
  return list;
}

export const getInvestigationDetail = async (id: number | string) => {
  const detail = tblInvestigations.findByPk(id)
  return detail;
}

export const getInvestigationsOfComplaint = async (params) => {
  const { ComplaintID } = params
  let whereClause = {}
  if(ComplaintID) whereClause['ComplaintID'] = ComplaintID

  tblInvestigationComplaint.hasMany(tblInvestigations, { foreignKey: 'uniqueID', sourceKey: 'investigationID' })
  const list = await tblInvestigationComplaint.findAll({
    attributes: [
      'uniqueid',
      'investigationID',
      'ComplaintID',
      [Sequelize.fn('FORMAT', Sequelize.col('tblInvestigations.DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      [Sequelize.col('tblInvestigations.PROBLEMDIAG'), 'PROBLEMDIAG'],
      [Sequelize.col('tblInvestigations.DESCRIPTION'), 'DESCRIPTION'],
      [Sequelize.col('tblInvestigations.ACTIONTYPE'), 'ACTIONTYPE'],
    ],
    include: [
      {
        model: tblInvestigations,
        attributes: ['uniqueID', 'DIAGDATE', 'PROBLEMDIAG', 'DESCRIPTION', 'ACTIONTYPE'],
        where: {
          uniqueID: {
            [Op.ne]: null
          }
        }
      }
    ],
    where: whereClause,
    raw: true
  })
  const formattedList = list.map((item: any) => {
    return {
      uniqueid: item.uniqueid,                            
      investigationID: item.investigationID,                            
      DIAGDATE: item.DIAGDATE,                            
      PROBLEMDIAG: item.PROBLEMDIAG,                           
      DESCRIPTION: item.DESCRIPTION,       
      ACTIONTYPE: item.ACTIONTYPE                    
    }
  })
  return formattedList;
}

export const createInvestigationComplaint = async (data) => {
  const { ComplaintID, investigationID } = data
  const newInvestigationComplaint = await tblInvestigationComplaint.create({
    ComplaintID: ComplaintID,
    investigationID: investigationID
  })
  return newInvestigationComplaint
}

export const deleteInvestigationComplaint = async (id) => {
  const deletedInvestigationComplaint = await tblInvestigationComplaint.destroy({where: { uniqueid: id }})
  return deletedInvestigationComplaint
}