import { format } from "date-fns";
import { Sequelize, Op } from "sequelize";
import { tblNonConformance, tblServiceReport, tblComplaints, tblNonConformanceTags } from "~/server/models";
import sequelize from "~/server/utils/databse";

export const getNonConformances = async (params) => {
  const { uniqueID, STATUS, OpenClosed, TAGASSIGNEDTO, TAGLOCATION, PARTS, SERVICEREPORT, JobNum, InvestigationNum, complaintnumber } = params
  let whereClause = {}
  if (uniqueID) whereClause['uniqueID'] = { [Op.like]: `%${uniqueID}%` }
  if (STATUS) whereClause['STATUS'] = { [Op.like]: `%${STATUS}%` }
  if (TAGASSIGNEDTO) whereClause['TAGASSIGNEDTO'] = { [Op.like]: `%${TAGASSIGNEDTO}%` }
  if (TAGLOCATION) whereClause['TAGLOCATION'] = { [Op.like]: `%${TAGLOCATION}%` }
  if (PARTS) whereClause['PARTS'] = { [Op.like]: `%${PARTS}%` }
  if (SERVICEREPORT) whereClause['SERVICEREPORT'] = { [Op.like]: `%${SERVICEREPORT}%` }
  if (JobNum) whereClause['JobNum'] = { [Op.like]: `%${JobNum}%` }
  if (InvestigationNum) whereClause['InvestigationNum'] = { [Op.like]: `%${InvestigationNum}%` }
  if (OpenClosed === 'true') whereClause['OpenClosed'] = 'Open'

  tblNonConformance.hasOne(tblServiceReport, { foreignKey: 'uniqueID', sourceKey: 'SERVICEREPORT' })
  tblServiceReport.hasOne(tblComplaints, { foreignKey: 'uniqueID', sourceKey: 'COMPLAINTID' })
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
      SERVICEREPORT: !item.SERVICEREPORT ? null : item.SERVICEREPORT,
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


export const addNonConformances = async (data) => {
  try {
    // Check if uniqueID exists for an update operation
    if (data.uniqueID) {
      // Update operation
      const updatedRecord = await tblNonConformance.update(data, {
        where: { uniqueID: data.uniqueID }
      });

      if (updatedRecord[0] === 0) {
        return { success: false, message: 'Record not found for update' };
      }

      return { success: true, message: 'Record updated successfully', data: updatedRecord };
    } else {
      // Create operation (remove uniqueID field before creating)
      const { uniqueID, ...dataWithoutID } = data;

      const newRecord = await tblNonConformance.create(dataWithoutID);
      return { success: true, message: 'Record created successfully', data: newRecord };
    }
  } catch (error) {
    console.error('Error in addNonConformances:', error);
    return { success: false, message: 'An error occurred', error };
  }
};


export const getNonConformanceTags = async (data) => {
  try {
    const tags = await tblNonConformanceTags.findAll({
      where: {
        NonConformanceID: {
          [Op.like]: data.id,
        },
      },
      order: [['UniqueID', 'ASC']],
    });

    // Format the DateTime for each tag
    const formattedTags = tags.map(tag => ({
      ...tag.toJSON(), // Convert Sequelize instance to plain object
      DateTime: format(tag.DateTime, 'yyyy-MM-dd')
    }));

    console.log(formattedTags);
    return formattedTags;
  } catch (error) {
    console.error('Error fetching non-conformance tags:', error);
    throw error;
  }
};

export const getNonConformancesFilters = async () => {
  try {
    const employees = await sequelize.query(
      "SELECT CONCAT('#', payrollno, ' ', fname, ' ', lname) AS employee FROM tblEmployee WHERE Active = 1 ORDER BY payrollnumber",
    );

    return {
      employees: employees[0].map(item => item.employee)
    };
  } catch (error) {
    console.error('Error fetching non-conformance filters:', error);
    throw error;
  }
};

export const addNonConformancesTags = async (data) => {
  try {
    if (data.uniqueID) {
      const updatedRecord = await tblNonConformanceTags.update(data, {
        where: { uniqueID: data.uniqueID }
      });

      if (updatedRecord[0] === 0) {
        return { success: false, message: 'Record not found for update' };
      }

      return { success: true, message: 'Record updated successfully', data: updatedRecord };
    } else {
      const { uniqueID, ...dataWithoutID } = data;

      const newRecord = await tblNonConformanceTags.create(dataWithoutID);
      return { success: true, message: 'Record created successfully', data: newRecord };
    }
  } catch (error) {
    console.error('Error in addNonConformances:', error);
    return { success: false, message: 'An error occurred', error };
  }
};

export const deleteNonConformancesTag = (id) => {
  return sequelize.query(`Delete from tblNonConformanceTags Where UniqueID =${id}`)
}