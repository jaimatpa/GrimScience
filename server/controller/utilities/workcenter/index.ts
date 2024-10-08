import { tblEmployee, tblWorkCenters, tblOrganization, tblSkills } from '~/server/models';
import { Sequelize, Op } from 'sequelize';
import { H3Event } from 'h3';

// ok code 
export const getPositions = async () => {
  try {
    const positions = await tblOrganization.findAll({
      attributes: ['Title', 'Employee'],
      order: [['Title', 'ASC']]
    });

    return positions.map(pos => ({
      label: pos.Title,
      value: pos.Title,
      employee: pos.Employee || null
    }));

  } catch (error) {
    console.error('Error fetching positions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching positions'
    });
  }
};

// ok code 
export const getAllWorkCenterData = async () => {
  try {
    const workCenters = await tblWorkCenters.findAll({
      attributes: ['uniqueID', 'position', 'NAME', 'NUMBER', 'Paid', 'TimeEntryWithoutJob'],
      order: [['NUMBER', 'ASC']],
      raw: true, 
      logging: console.log 
    });

    if (workCenters.length > 0) {
      console.log('Check if Paid and TimeEntryWithoutJob are missing:', {
        hasPaid: 'Paid' in workCenters[0],
        hasTimeEntryWithoutJob: 'TimeEntryWithoutJob' in workCenters[0],
      });
    }
    const organizations = await tblOrganization.findAll({
      attributes: ['Title', 'Employee'],
      raw: true 
    });
    const combinedResults = workCenters.map(wc => {
      const matchingOrg = organizations.find(org => org.Title === wc.position);
      return {
        ...wc, // Spread all fields from the work center
        Employee: matchingOrg ? matchingOrg.Employee : null 
      };
    });

    console.log('Combined results:', JSON.stringify(combinedResults, null, 2));

    return combinedResults;
  } catch (error) {
    console.error('Error fetching work centers:', error); 
    throw error; 
  }
};


// ok code
export const insertDataWorkCenters = async (data) => {
  try {
    const newWorkCenter = await tblWorkCenters.create({
      NAME: data.name,
      NUMBER: data.number,
      position: data.position,
      QB_Activity: data.QB_Activity, 
      TimeEntryWithoutJob: data.TimeEntryWithoutJob,
      Paid: data.Paid,
    });
    return newWorkCenter;
  } catch (error) {
    console.error('Error inserting data into tblWorkCenters:', error);
    throw new Error(`Error inserting data: ${error.message}`);
  }
};

// ok code
export const updateDataWorkCenters = async (data) => {
  console.log(data)
  try {
    const workCenter = await tblWorkCenters.findByPk(data.uniqueID);
    
    if (!workCenter) {
      throw new Error(`Work center with ID ${data.uniqueID} not found`);
    }

    const updatedWorkCenter = await workCenter.update({
      NAME: data.name,
      NUMBER: data.number,
      position: data.position,
      TimeEntryWithoutJob: data.timeEntryWithoutJob,
      Paid: data.paid,
    });

    return updatedWorkCenter;
  } catch (error) {
    console.error('Error updating work center:', error);
    throw error;
  }
};








// export const getAllWorkCenterData = async () => {
//   try {
//     // Fetch Work Centers data
//     const workCenters = await tblWorkCenters.findAll({
//       attributes: ['uniqueID', 'position', 'NAME', 'NUMBER', 'Paid', 'TimeEntryWithoutJob'],
//       order: [['NUMBER', 'ASC']],
//       raw: true, // Return plain objects instead of Sequelize instances
//       logging: console.log // Logs the SQL query for debugging
//     });

//     console.log('Raw workCenters data:', workCenters); // Debug log to check raw data

//     // Fetch organization data (ensure tblOrganization is properly defined)
//     const organizations = await tblOrganization.findAll({
//       attributes: ['Title', 'Employee'],
//       raw: true // Return plain objects
//     });

//     // Manual join - match each work center with corresponding organization data
//     const combinedResults = workCenters.map(wc => {
//       const matchingOrg = organizations.find(org => org.Title === wc.position);
//       return {
//         ...wc, // Spread all fields from the work center
//         Employee: matchingOrg ? matchingOrg.Employee : null // Add Employee from the matching organization
//       };
//     });

//     // console.log('Combined results:', JSON.stringify(combinedResults, null, 2)); // Pretty-print the combined results

//     return combinedResults;
//   } catch (error) {
//     console.error('Error fetching work centers:', error); // Log the error
//     throw error; // Rethrow to handle it in higher-level code
//   }
// };
// export const getAllWorkCenterData = async () => {
//   try {
//     // First, ensure both tables exist and have data
//     const workCenters = await tblWorkCenters.findAll({
//       attributes: ['uniqueID', 'position', 'NAME', 'NUMBER','Paid','TimeEntryWithoutJob'],
//       order: [['NUMBER', 'ASC']],
//       raw: true
//     });

//     const organizations = await tblOrganization.findAll({
//       attributes: ['Title', 'Employee'],
//       raw: true
//     });

//     // Perform a manual join
//     const combinedResults = workCenters.map(wc => {
//       const matchingOrg = organizations.find(org => org.Title === wc.position);
//       return {
//         ...wc,
//         Employee: matchingOrg ? matchingOrg.Employee : null
//       };
//     });

//     console.log('Combined results:', combinedResults);
//     return combinedResults;
//   } catch (error) {
//     console.error('Error fetching work centers:', error);
//     throw error;
//   }
// };


// export const getAllWorkCenterData = async () => {
//   try {
//     // First, ensure both tables exist and have data
//     const workCenters = await tblWorkCenters.findAll({
//       attributes: ['position', 'NAME', 'NUMBER'],
//       raw: true
//     });

//     const organizations = await tblOrganization.findAll({
//       attributes: ['Title', 'Employee'],
//       raw: true
//     });

//     // Perform a manual join
//     const combinedResults = workCenters.map(wc => {
//       const matchingOrg = organizations.find(org => org.Title === wc.position);
//       return {
//         ...wc,
//         Employee: matchingOrg ? matchingOrg.Employee : null
//       };
//     });

//     console.log('Combined results:', combinedResults);
//     return combinedResults;
//   } catch (error) {
//     console.error('Error fetching work centers:', error);
//     throw error;
//   }
// };


// Function to get employees by work center ID
// export const getEmployees = async (workcenterId: string) => {
//   try {
//     const employees = await Employee.findAll({
//       where: {
//         WORKCENTERS: {
//           [Op.like]: `%,${workcenterId},%`
//         }
//       },
//       attributes: ['fname', 'lname', 'department'],
//       order: [
//         ['lname', 'ASC'],
//         ['fname', 'ASC']
//       ]
//     });

//     return employees.map(emp => ({
//       name: `${emp.lname}, ${emp.fname}`,
//       department: emp.department || null
//     }));
//   } catch (error) {
//     console.error('Error fetching employees:', error);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error fetching employees'
//     });
//   }
// };

// Function to get QuickBooks activities
// export const getQBActivities = async () => {
//   // Implementation remains unchanged
// };

