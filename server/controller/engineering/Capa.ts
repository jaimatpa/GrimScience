import { Sequelize, Op, QueryTypes } from 'sequelize'
import { tblPermissions, tblPreventiveActions, tblWorkCenters } from '~/server/models'
import sequelize from '~/server/utils/databse'

export const applyPermissions = async (employeeId) => {
  console.log('Employee ID:', employeeId)

  // Define the system and subsystem for permission checks
  const system = 'Engineering'
  const subsystem = 'Approvals'

  // Fetch permissions for the given system and subsystem
  const permissions = await tblPermissions.findOne({
    where: {
      system: system,
      subsystem: subsystem
    }
  })

  // console.log('Permissions:', permissions)

  // If no permissions found, return restricted access
  if (!permissions) {
    return { enabled: false, message: 'You are not authorized to access this part of the system.' }
  }

  let accessLevel = 'Restricted' // Default access level
  let readOnly = false
  let message = ''

  // Check for full access based on 'MenuItem' or 'FullAdminIDs'
  if (permissions.MenuItem === 'Full' || permissions.FullAdminIDs.includes(employeeId)) {
    accessLevel = 'Full'

    console.log('Full Access:', accessLevel)
  }
  // Check for read-only access based on 'MenuItem' or 'ReadOnlyIDs'
  else if (permissions.MenuItem === 'Read Only' || permissions.ReadOnlyIDs.includes(employeeId)) {
    accessLevel = 'Read Only'
    readOnly = true
    message = 'READ-ONLY ACCESS'

    console.log('Read-Only Access:', accessLevel)
  }

  // If access level is restricted, deny access
  if (accessLevel === 'Restricted') {
    return { enabled: false, message: 'You are not authorized to access this part of the system.' }
  }

  // Return the determined permissions
  return { enabled: true, readOnly, message }
}

const applyFilters = (params) => {
  const filterParams = ['PANO', 'PRODLINE', 'ACTIONTYPE', 'DESCRIPTION']
  const whereClause = {}

  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      }
    }
  })

  return whereClause
}

export const getCapas = async (params) => {
  const { PANO, PRODLINE, DIAGDATE, ACTIONTYPE, DESCRIPTION, chkOpenOnly } = params

  // Iterate over the keys of the params object
  const whereClause = applyFilters(params)

  // Handle chkOpenOnly filtering
  if (chkOpenOnly == 'true') {
    whereClause['Status'] = {
      [Op.like]: 'Open'
    }
  }

  // Fetch the data from the table
  const list = await tblPreventiveActions.findAll({
    attributes: [
      'uniqueID',
      'PANO',
      'PRODLINE',
      [Sequelize.fn('FORMAT', Sequelize.col('DIAGDATE'), 'MM/dd/yyyy'), 'DIAGDATE'],
      'ACTIONTYPE',
      'DESCRIPTION'
    ],
    where: whereClause,
    order: [['PANO', 'ASC']]
  })

  return list
}

export const getCapaDetail = async (id) => {
  console.log('id', id)
  const capaDetail = await tblPreventiveActions.findByPk(id)

  console.log('capaDetail', capaDetail)
  return capaDetail
}

export const getCapaComplaints = async (params) => {
  const { capaId, COMPLAINTDATE, SERIALNO, CUSTOMERNUMBER } = params

  try {
    // Build the SQL query
    const sqlQuery = `
        WITH RankedComplaints AS (
          SELECT 
            tblComplaints.complaintdate AS COMPLAINTDATE, 
            tblComplaints.serialno AS SERIALNO, 
            tblComplaints.complaintnumber AS COMPLAINTNUMBER, 
            tblComplaints.uniqueid AS ComplaintID, 
            tblCustomers.number AS CUSTOMERNUMBER,
            ROW_NUMBER() OVER (PARTITION BY tblComplaints.uniqueid ORDER BY tblComplaints.complaintdate DESC) AS rn
          FROM tblComplaints
          INNER JOIN tblCustomers 
            ON tblCustomers.uniqueid = tblComplaints.CustomerID
          INNER JOIN tblPAComplaint 
            ON tblPAComplaint.ComplaintID = tblComplaints.UniqueID
          WHERE tblPAComplaint.PreventiveActionID = :capaId
        )
        SELECT 
          COMPLAINTDATE, 
          SERIALNO, 
          COMPLAINTNUMBER, 
          ComplaintID, 
          CUSTOMERNUMBER
        FROM RankedComplaints
        WHERE rn = 1
          AND (SERIALNO LIKE :SERIALNO)
          AND (CUSTOMERNUMBER LIKE :CUSTOMERNUMBER)
        ORDER BY COMPLAINTDATE DESC;
      `

    // Execute the raw SQL query
    const complaints = await sequelize.query(sqlQuery, {
      replacements: {
        capaId,
        COMPLAINTDATE: COMPLAINTDATE ? new Date(COMPLAINTDATE).toISOString().slice(0, 10) : '%',
        SERIALNO: SERIALNO ? `%${SERIALNO}%` : '%',
        CUSTOMERNUMBER: CUSTOMERNUMBER ? `%${CUSTOMERNUMBER}%` : '%'
      },
      type: QueryTypes.SELECT
    })

    // Format COMPLAINTDATE for each complaint
    complaints.forEach((complaint) => {
      complaint.COMPLAINTDATE = complaint.COMPLAINTDATE ? new Date(complaint.COMPLAINTDATE).toLocaleDateString() : null
    })

    return complaints
  } catch (error) {
    console.error('Error fetching complaints:', error)
    throw error
  }
}

export const getInvestigations = async (params) => {
  const { PreventiveActionID } = params

  try {
    const sqlQuery = `
      SELECT 
        tblInvestigations.uniqueID,
        tblInvestigations.PANO, 
        tblInvestigations.PRODLINE, 
        tblInvestigations.DESCRIPTION AS DESCRIPTION, 
        tblInvestigations.DIAGDATE AS DIAGDATE 
      FROM tblPAInvestigation 
      INNER JOIN tblInvestigations 
        ON tblPAInvestigation.investigationID = tblInvestigations.uniqueID 
      INNER JOIN tblPreventiveActions 
        ON tblPAInvestigation.PreventiveActionID = tblPreventiveActions.uniqueID 
      WHERE tblPAInvestigation.PreventiveActionID = :PreventiveActionID
    `

    // Execute the raw SQL query
    const investigations = await sequelize.query(sqlQuery, {
      replacements: { PreventiveActionID: parseInt(PreventiveActionID, 10) },
      type: QueryTypes.SELECT
    })

    // Format the DiagDate for each investigation

    if (investigations) {
      investigations.forEach((investigation) => {
        investigation.DIAGDATE = investigation.DIAGDATE ? new Date(investigation.DIAGDATE).toLocaleDateString() : null
      })
    }

    // Return the list of investigations
    return investigations
  } catch (error) {
    console.error('Error fetching investigations:', error)
    throw error
  }
}

export const getWorkCenters = async () => {
  const workCenters = await tblWorkCenters.findAll({
    attributes: ['NAME', 'NUMBER'],
    order: [['NUMBER', 'ASC']]
  })

  // return each entity in the format #NUMBER NAME
  return workCenters.map((workCenter) => {
    return `#${workCenter.NUMBER} ${workCenter.NAME}`
  })
}
