import { Sequelize, Op, QueryTypes } from 'sequelize'
import { tblInvestigations, tblInvestigationComplaint, tblBP, tblEmployee, tblPermissions } from '~/server/models'
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

export const getInvestigations = async (params) => {
  const { uniqueID, PROBLEMDIAG, DIAGDATE, PRODLINE, DESCRIPTION, Status } = params
  const whereClause = {}
  if (uniqueID) whereClause['uniqueID'] = { [Op.like]: `%${uniqueID}%` }
  if (PROBLEMDIAG) whereClause['PROBLEMDIAG'] = { [Op.like]: `%${PROBLEMDIAG}%` }
  if (DIAGDATE)
    whereClause[Op.and] = [
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

export const createInvestigation = async (data) => {
  try {
    // Step 1: Check if an investigation already exists with the same description
    console.log('Check if an investigation already exists with the same description:')
    const existingInvestigation = await tblInvestigations.findOne({
      where: { PROBLEMDESC: data.PROBLEMDESC }
    })

    if (existingInvestigation) {
      // throw new Error('There is another action that already has this description. Please change your description and try adding it again.')
      return {
        message: 'There is another action that already has this description. Please change your description and try adding it again.',
        messageType: 'error'
      }
    }

    console.log('Generate max id:')

    // Step 2: Get the max uniqueid and generate a new one
    const maxUniqueIdResult = await tblInvestigations.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('uniqueID')), 'maxUniqueid']],
      group: ['uniqueID'],
      order: [['uniqueID', 'DESC']]
    })
    const newUniqueId = parseInt(maxUniqueIdResult.dataValues.maxUniqueid) + 1

    // console.log('newUniqueId:', newUniqueId)

    // Step 3: Prepare data for the new investigation
    // data.PANO = newUniqueId;
    data.DIAGDATE = formatDate(data.DIAGDATE)
    data.IMPLEMENTDATE = formatDate(data.IMPLEMENTDATE)
    const newInvestigationData = {
      ...data,
      PANO: newUniqueId
    }
    // const { uniqueID, ...newInvestigationDataWOUID } = newInvestigationData;
    // console.log('newInvestigationData:', newInvestigationData)

    // Step 4: Create the new investigation
    // const newInvestigation = await tblInvestigations.create(newInvestigationData)

    const query = `
      INSERT INTO tblInvestigations
      (PREVENTPROB, PROBLEMDIAG, PROBLEMDESC, DIAGBY, DIAGDATE, IMPLEMENTBY, IMPLEMENTDATE, PRODLINE, PANO, DESCRIPTION, Status)
      VALUES
      ('${newInvestigationData.PREVENTPROB}', '${newInvestigationData.PROBLEMDIAG}', '${newInvestigationData.PROBLEMDESC}', '${newInvestigationData.DIAGBY}', '${newInvestigationData.DIAGDATE}', '${newInvestigationData.IMPLEMENTBY}', '${newInvestigationData.IMPLEMENTDATE}', '${newInvestigationData.PRODLINE}', '${newInvestigationData.PANO}', '${newInvestigationData.DESCRIPTION}', '${newInvestigationData.Status}');
    `

    const newInvestigation = await sequelize.query(query)

    // const query = `
    //   INSERT INTO tblInvestigations
    //   (PREVENTPROB, PROBLEMDIAG, PROBLEMDESC, DIAGBY, DIAGDATE, IMPLEMENTBY, IMPLEMENTDATE, PRODLINE, PANO, DESCRIPTION, Status)
    //   VALUES
    //   ('test', 'test', 'test', 'Mike Augenstein', '2024-09-10 18:00:00', 'Mike Augenstein', '2024-09-10 18:00:00', 'DURALast', 10252, 'test desc alvi', 'Open');
    // `

    // await sequelize.query(query)

    return {
      message: 'Investigation created successfully',
      messageType: 'success',
      investigation: newInvestigation
    }
  } catch (error) {
    console.error('Error creating investigation: ', error)
    throw new Error('Failed to create investigation')
  }
}

export const updateInvestigation = async (data) => {
  try {
    // Step 1: Check if an investigation already exists with the same description
    console.log('Check if an investigation already exists with the same description:')
    const existingInvestigation = await tblInvestigations.findOne({
      where: { PROBLEMDESC: data.PROBLEMDESC, uniqueID: { [Op.ne]: data.uniqueID } }
    })

    if (existingInvestigation) {
      // throw new Error('There is another action that already has this description. Please change your description and try adding it again.')
      return {
        message: 'There is another action that already has this description. Please change your description and try adding it again.',
        messageType: 'error'
      }
    }

    // Step 2: Fetch the investigation by uniqueID
    const uniqueID = data.uniqueID
    const investigation = await tblInvestigations.findByPk(uniqueID)

    if (!investigation) {
      // throw new Error("Investigation not found");
      return {
        message: 'Investigation not found',
        messageType: 'error'
      }
    }

    console.log('Params:', data)
    console.log('Investigation found:', investigation)

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
      UPDATE tblInvestigations 
      SET ${updateFields.join(', ')}
      WHERE uniqueID = :uniqueID;
    `

    // Execute the raw SQL query
    await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.UPDATE
    })

    return {
      message: 'Investigation updated successfully',
      messageType: 'success',
      investigation: data
    }
  } catch (error) {
    console.error('Error updating investigation:', error)
    throw new Error('Failed to update investigation')
  }
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
    // Build the SQL query
    const sqlQuery = `
      WITH RankedComplaints AS (
        SELECT 
          tblComplaints.complaintdate AS COMPLAINTDATE, 
          tblComplaints.serialno AS SERIALNO, 
          tblComplaints.complaintnumber AS COMPLAINTNUMBER, 
          tblComplaints.uniqueid AS ComplaintID, 
          tblInventory.Today AS Shipdate, 
          tblCustomers.number AS CustomerNumber,
          ROW_NUMBER() OVER (PARTITION BY tblComplaints.uniqueid ORDER BY tblComplaints.complaintdate DESC) AS rn
        FROM tblComplaints
        INNER JOIN tblCustomers 
          ON tblCustomers.uniqueid = tblComplaints.CustomerID
        INNER JOIN tblInventory 
          ON tblInventory.Serial = tblComplaints.serialno 
          AND tblInventory.Status = 'Shipped'
        INNER JOIN tblInvestigationComplaint 
          ON tblInvestigationComplaint.ComplaintID = tblComplaints.UniqueID
        WHERE tblInvestigationComplaint.investigationID = :investigationID
      )
      SELECT 
        COMPLAINTDATE, 
        SERIALNO, 
        COMPLAINTNUMBER, 
        ComplaintID, 
        Shipdate, 
        CustomerNumber
      FROM RankedComplaints
      WHERE rn = 1
        AND SERIALNO LIKE :SERIALNO
        AND COMPLAINTNUMBER LIKE :COMPLAINTNUMBER
      ORDER BY COMPLAINTDATE DESC;
    `

    // Execute the raw SQL query
    const complaints = await sequelize.query(sqlQuery, {
      replacements: {
        investigationID,
        COMPLAINTDATE: COMPLAINTDATE ? new Date(COMPLAINTDATE).toISOString().slice(0, 10) : '%',
        SERIALNO: SERIALNO ? `%${SERIALNO}%` : '%',
        COMPLAINTNUMBER: COMPLAINTNUMBER ? `%${COMPLAINTNUMBER}%` : '%'
      },
      type: QueryTypes.SELECT
    })

    // Format COMPLAINTDATE and Shipdate dates for each complaint

    complaints.forEach((complaint) => {
      complaint.COMPLAINTDATE = complaint.COMPLAINTDATE ? complaint.COMPLAINTDATE.toLocaleDateString() : null
      complaint.Shipdate = complaint.Shipdate ? complaint.Shipdate.toLocaleDateString() : null
    })

    return complaints
  } catch (error) {
    console.error('Error fetching complaints:', error)
    throw error
  }
}

export const getInvestigationCAPAs = async (params) => {
  try {
    const { investigationID } = params

    const sqlQuery = `
      SELECT tblPAInvestigation.PreventiveActionID AS uid, tblPreventiveActions.*
      FROM tblPreventiveActions
      INNER JOIN tblPAInvestigation 
        ON tblPAInvestigation.PreventiveActionID = tblPreventiveActions.Uniqueid
      WHERE tblPAInvestigation.InvestigationID = :investigationID;
    `

    const preventiveActions = await sequelize.query(sqlQuery, {
      replacements: { investigationID },
      type: QueryTypes.SELECT
    })

    // Format DIAGDATE FOR EACH PREVENTIVE ACTION

    preventiveActions.forEach((action) => {
      action.DIAGDATE = action.DIAGDATE ? action.DIAGDATE.toLocaleDateString() : null
      action.IMPLEMENTDATE = action.IMPLEMENTDATE ? action.IMPLEMENTDATE.toLocaleDateString() : null
    })

    return preventiveActions
  } catch (error) {
    console.error('Error fetching preventive actions: ', error)
    res.status(500).json({ error: 'Failed to fetch preventive actions' })
  }
}

export const removeInvestigationCAPA = async (params) => {
  try {
    const { investigationID, uid } = params

    const sqlQuery = `
      DELETE FROM tblPAInvestigation
      WHERE InvestigationID = :investigationID
        AND PreventiveActionID = :uid;
    `

    const result = await sequelize.query(sqlQuery, {
      replacements: { investigationID, uid },
      type: QueryTypes.DELETE
    })

    return result
  } catch (error) {
    console.error('Error removing preventive action: ', error)
    throw error
  }
}

export const createInvestigationCAPA = async (params) => {
  try {
    const { investigationID, uid } = params

    const sqlQuery = `
      INSERT INTO tblPAInvestigation (investigationID, PreventiveActionID)
      VALUES (:investigationID, :uid);
    `

    const result = await sequelize.query(sqlQuery, {
      replacements: { investigationID: investigationID, uid: uid },
      type: QueryTypes.INSERT
    })

    return result
  } catch (error) {
    console.error('Error creating preventive action entry: ', error)
    throw error
  }
}
