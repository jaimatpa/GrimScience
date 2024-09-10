import { Sequelize, Op, QueryTypes } from 'sequelize'
import { tblInvestigations, tblInvestigationComplaint, tblBP, tblEmployee } from '~/server/models'
import sequelize from '~/server/utils/databse'

export const getInvestigations = async (params) => {
  const { uniqueID, PROBLEMDIAG, DIAGDATE, PRODLINE, DESCRIPTION, Status } = params
  const whereClause = {}
  if (uniqueID) whereClause['uniqueID'] = { [Op.like]: `%${uniqueID}%` }
  if (PROBLEMDIAG) whereClause['PROBLEMDIAG'] = { [Op.like]: `%${PROBLEMDIAG}%` }
  if (DIAGDATE) whereClause[Op.and] = [
    Sequelize.where(Sequelize.fn('FORMAT', Sequelize.col('DIAGDATE'), 'MM/dd/yyyy'), {
      [Op.like]: Sequelize.literal(`'%${DIAGDATE}%'`)
    })
  ]
  if (PRODLINE) whereClause['PRODLINE'] = { [Op.like]: `%${PRODLINE}%` }
  if (DESCRIPTION) whereClause['DESCRIPTION'] = { [Op.like]: `%${DESCRIPTION}%` }
  if (Status === 'true') whereClause['Status'] = 'Open'

  const list = await tblInvestigations.findAll({
    attributes: [
      [Sequelize.cast(Sequelize.col('uniqueID'), 'INTEGER'), 'uniqueID'],
      'PROBLEMDIAG',
      [Sequelize.fn('FORMAT', Sequelize.col('tblInvestigations.DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      'PRODLINE',
      'DESCRIPTION',
      'Status'
    ],
    where: whereClause,
    raw: true
  })
  return list
}

export const getInvestigationDetail = async (id: number | string) => {
  const detail = tblInvestigations.findByPk(id)
  return detail
}

export const getInvestigationsOfComplaint = async (params) => {
  const { ComplaintID } = params
  const whereClause = {}
  if (ComplaintID) whereClause['ComplaintID'] = ComplaintID

  tblInvestigationComplaint.hasMany(tblInvestigations, { foreignKey: 'uniqueID', sourceKey: 'investigationID' })
  const list = await tblInvestigationComplaint.findAll({
    attributes: [
      'uniqueid',
      'investigationID',
      'ComplaintID',
      [Sequelize.fn('FORMAT', Sequelize.col('tblInvestigations.DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      [Sequelize.col('tblInvestigations.PROBLEMDIAG'), 'PROBLEMDIAG'],
      [Sequelize.col('tblInvestigations.DESCRIPTION'), 'DESCRIPTION'],
      [Sequelize.col('tblInvestigations.ACTIONTYPE'), 'ACTIONTYPE']
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
  return formattedList
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
  const deletedInvestigationComplaint = await tblInvestigationComplaint.destroy({ where: { uniqueid: id } })
  return deletedInvestigationComplaint
}

export const getInvestigationProductLines = async () => {
  const distinctProductInfos = await tblBP.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']],
    where: {
      [Op.and]: [{ PRODUCTLINE: { [Op.ne]: null } }, { PRODUCTLINE: { [Op.ne]: '' } }, { productflag: true }]
    },
    order: [['PRODUCTLINE', 'ASC']]
  })

  const productLineValues = distinctProductInfos.map(result => result.get('PRODUCTLINE'))

  return productLineValues
}

export const getInvestigationEmployees = async () => {
  try {
    const distinctEmployeeNames = await tblEmployee.findAll({
      attributes: ['fname', 'lname'],
      where: {
        Active: 1
      },
      group: ['fname', 'lname'], // Ensure unique combinations
      order: [
        ['lname', 'ASC'],
        ['fname', 'ASC']
      ],
      raw: true
    })

    // Process the results and concatenate fname and lname
    const employeeNames = distinctEmployeeNames.map((result) => {
      const fname = result.fname || ''
      const lname = result.lname || ''
      return `${fname} ${lname}`.trim() // Concatenate and trim to handle any extra spaces
    })

    return employeeNames
  } catch (error) {
    console.error('Error fetching data from table:', error)
    throw error
  }
}

export const getInvestigationComplaints = async (params) => {
  const { investigationID, COMPLAINTDATE, SERIALNO, COMPLAINTNUMBER } = params

  try {
    // Start building the SQL query
    let sqlQuery = `
      SELECT complaintdate, 
       serialno, 
       complaintnumber, 
       tblComplaints.uniqueid AS ComplaintID, 
       tblInventory.Today AS Shipdate, 
       number
      FROM tblComplaints
      INNER JOIN tblCustomers 
        ON tblCustomers.uniqueid = tblComplaints.CustomerID
      INNER JOIN tblInventory 
        ON tblInventory.Serial = tblComplaints.serialno 
        AND tblInventory.Status = 'Shipped'
      INNER JOIN tblInvestigationComplaint 
        ON tblInvestigationComplaint.ComplaintID = tblComplaints.UniqueID
      WHERE 1=1
    `;

    // Add filters to the WHERE clause based on provided parameters
    if (investigationID) {
      sqlQuery += ` AND tblInvestigationComplaint.investigationID = :investigationID`
    }
    if (COMPLAINTDATE) {
      sqlQuery += ` AND tblComplaints.complaintdate LIKE :COMPLAINTDATE`
    }
    if (SERIALNO) {
      sqlQuery += ` AND tblComplaints.serialno LIKE :SERIALNO`
    }
    if (COMPLAINTNUMBER) {
      sqlQuery += ` AND tblComplaints.complaintnumber LIKE :COMPLAINTNUMBER`
    }

    // Add ordering
    sqlQuery += ` ORDER BY tblComplaints.complaintdate DESC`

    // Execute the raw SQL query
    const complaints = await sequelize.query(sqlQuery, {
      replacements: {
        investigationID,
        COMPLAINTDATE: COMPLAINTDATE ? `%${COMPLAINTDATE}%` : '%',
        SERIALNO: SERIALNO ? `%${SERIALNO}%` : '%',
        COMPLAINTNUMBER: COMPLAINTNUMBER ? `%${COMPLAINTNUMBER}%` : '%'
      },
      type: QueryTypes.SELECT
    })

    return complaints
  } catch (error) {
    console.error('Error fetching complaints:', error)
    throw error
  }
}
