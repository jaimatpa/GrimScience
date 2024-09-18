import { Sequelize, Op, QueryTypes } from 'sequelize'
import { tblBP, tblEmployee, tblPermissions, tblPreventiveActions, tblWorkCenters } from '~/server/models'
import sequelize from '~/server/utils/databse'

const formatDate = (dateString) => {
  // const date = new Date(dateString);
  // return date.toISOString(); // Converts date to ISO 8601 format

  const date = new Date(dateString)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  // Format as YYYY-MM-DD HH:MM:SS
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

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

export const createCapa = async (data) => {
  try {
    // Step 1: Check if a Preventive Action already exists with the same description
    console.log('Check if a Preventive Action already exists with the same description:')
    const existingCapa = await tblPreventiveActions.findOne({
      where: { DESCRIPTION: data.DESCRIPTION }
    })

    if (existingCapa) {
      return {
        message: 'There is another action that already has this description. Please change your description and try adding it again.',
        messageType: 'error'
      }
    }

    console.log('Generate max id:')

    // Step 2: Get the max uniqueID and generate a new one
    const maxUniqueIdResult = await tblPreventiveActions.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('uniqueID')), 'maxUniqueID']],
      group: ['uniqueID'],
      order: [['uniqueID', 'DESC']]
    })

    const newUniqueId = parseInt(maxUniqueIdResult?.dataValues?.maxUniqueID || 0) + 1

    // Step 3: Prepare data for the new Preventive Action
    data.DIAGDATE = formatDate(data.DIAGDATE)
    data.IMPLEMENTDATE = formatDate(data.IMPLEMENTDATE)

    const newCapaData = {
      ...data,
      PANO: newUniqueId,
      uniqueID: newUniqueId
    }

    console.log('New Preventive Action:', newCapaData)

    // Step 4: Insert new Preventive Action
    const query = `
      INSERT INTO tblPreventiveActions
      (PANO, PRODLINE, DIAGDATE, ACTIONTYPE, DESCRIPTION, PROBLEMDESC, DIAGBY, PROBLEMDIAG, PART, VENDOR, WORKCENTERS, PREVENTPROB, ECO, Status, IMPLEMENTBY, IMPLEMENTDATE)
      VALUES
      (${newCapaData.PANO}, '${newCapaData.PRODLINE}', '${newCapaData.DIAGDATE}', '${newCapaData.ACTIONTYPE}', '${newCapaData.DESCRIPTION}', '${newCapaData.PROBLEMDESC}', '${newCapaData.DIAGBY}', '${newCapaData.PROBLEMDIAG}', '${newCapaData.PART}', '${newCapaData.VENDOR}', '${newCapaData.WORKCENTERS}', '${newCapaData.PREVENTPROB}', '${newCapaData.ECO}', '${newCapaData.Status}', '${newCapaData.IMPLEMENTBY}', '${newCapaData.IMPLEMENTDATE}');
    `

    const newCapa = await sequelize.query(query)

    return {
      message: 'Preventive Action created successfully',
      messageType: 'success',
      capa: newCapa
    }
  } catch (error) {
    console.error('Error creating Preventive Action: ', error)
    throw new Error('Failed to create Preventive Action')
  }
}

export const updateCapa = async (data) => {
  try {
    // Step 1: Check if an investigation already exists with the same description
    console.log('Check if an investigation already exists with the same description:')
    const existingCapa = await tblPreventiveActions.findOne({
      where: { DESCRIPTION: data.DESCRIPTION, uniqueID: { [Op.ne]: data.uniqueID } }
    })

    if (existingCapa) {
      // throw new Error('There is another action that already has this description. Please change your description and try adding it again.')
      return {
        message: 'There is another action that already has this description. Please change your description and try adding it again.',
        messageType: 'error'
      }
    }

    // Step 2: Fetch the investigation by uniqueID
    const uniqueID = data.uniqueID
    const capa = await tblPreventiveActions.findByPk(uniqueID)

    if (!capa) {
      // throw new Error("Investigation not found");
      return {
        message: 'Capa not found',
        messageType: 'error'
      }
    }

    // Format the date fields
    if (data.DIAGDATE) data.DIAGDATE = formatDate(data.DIAGDATE)
    if (data.IMPLEMENTDATE) data.IMPLEMENTDATE = formatDate(data.IMPLEMENTDATE)

    // Prepare raw SQL query for updating
    const updateFields = []
    const replacements = { uniqueID }

    // Add each field from data that should be updated
    Object.keys(data).forEach((key) => {
      if (key !== 'uniqueID' && data[key] !== undefined && data[key] !== null) {
        updateFields.push(`${key} = :${key}`)
        replacements[key] = data[key]
      }
    })

    // Generate the SQL query string
    const sqlQuery = `
      UPDATE tblPreventiveActions 
      SET ${updateFields.join(', ')}
      WHERE uniqueID = :uniqueID;
    `

    // Execute the raw SQL query
    await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.UPDATE
    })

    return {
      message: 'Preventive Action updated successfully',
      messageType: 'success',
      investigation: data
    }
  } catch (error) {
    console.error('Error updating Preventive Action:', error)
    throw new Error('Failed to update Preventive Action')
  }
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

export const getCapaProductLines = async () => {
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

export const getCapaEmployees = async () => {
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
