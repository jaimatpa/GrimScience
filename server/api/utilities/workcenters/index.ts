// import { defineEventHandler, getQuery, readBody, H3Event } from 'h3'
// import { Op } from 'sequelize'
// import WorkCenter from '~/server/models/tblWorkCenters'
// import Organization from '~/server/models/tblOrganization'
// import Skill from '~/server/models/tblSkills'
// import Employee from '~/server/models/tblEmployee'
// import { QBXMLGenerator } from '~/utils/qbxml-generator'

// // Interfaces matching exact database schemas
// interface IWorkCenter {
//   uniqueID?: number
//   instanceID?: number
//   NAME: string
//   NUMBER: string
//   position?: string
//   QB_Activity?: string
//   TimeEntryWithoutJob?: boolean
//   Paid?: boolean
// }

// interface ISkill {
//   UniqueID?: number
//   Name: string
//   WorkCenters?: string
//   [key: string]: any // For other fields that might be needed
// }

// interface IEmployee {
//   UniqueID?: number
//   fname: string
//   lname: string
//   WORKCENTERS?: string
//   [key: string]: any // For other fields that might be needed
// }

// interface IOrganization {
//   UniqueID?: number
//   Title: string
//   Employee?: string
//   WorkCenters?: string
//   [key: string]: any // For other fields that might be needed
// }

// export default defineEventHandler(async (event: H3Event) => {
//   const method = event.method
//   const query = getQuery(event)

//   switch (method) {
//     case 'GET':
//       if (query.type === 'qb-activities') {
//         // return await getQBActivities()
//         return {body:""}
//       } else if (query.type === 'skills' && query.workcenterId) {
//         return await getSkills(query.workcenterId as string)
//       } else if (query.type === 'employees' && query.workcenterId) {
//         return await getEmployees(query.workcenterId as string)
//       } else if (query.type === 'positions') {
//         return await getPositions()
//       } else {
//         return await getWorkCenters()
//       }
//     case 'POST':
//       return await createWorkCenter(event)
//     case 'PUT':
//       return await updateWorkCenter(event)
//     default:
//       throw createError({
//         statusCode: 405,
//         statusMessage: 'Method Not Allowed'
//       })
//   }
// })

// async function getWorkCenters() {
//   try {
//     const workCenters = await WorkCenter.findAll({
//       include: [{
//         model: Organization,
//         attributes: ['Title', 'Employee'],
//         required: false
//       }],
//       order: [['NUMBER', 'ASC']]
//     })

//     return workCenters.map(wc => ({
//       ...wc.toJSON(),
//       position: wc.position || null,
//       QB_Activity: wc.QB_Activity || null,
//       TimeEntryWithoutJob: !!wc.TimeEntryWithoutJob,
//       Paid: !!wc.Paid
//     }))
//   } catch (error) {
//     console.error('Error fetching work centers:', error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error fetching work centers'
//     })
//   }
// }

// async function getPositions() {
//   try {
//     const positions = await Organization.findAll({
//       attributes: ['Title', 'Employee'],
//       order: [['Title', 'ASC']]
//     })
    
//     return positions.map(pos => ({
//       label: pos.Title,
//       value: pos.Title,
//       employee: pos.Employee || null
//     }))
//   } catch (error) {
//     console.error('Error fetching positions:', error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error fetching positions'
//     })
//   }
// }

// async function createWorkCenter(event: H3Event) {
//   try {
//     const body = await readBody(event) as IWorkCenter
    
//     if (!body.NAME || !body.NUMBER) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Name and number are required'
//       })
//     }

//     const existingWorkCenter = await WorkCenter.findOne({
//       where: {
//         NUMBER: body.NUMBER
//       }
//     })
    
//     if (existingWorkCenter) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Duplicate work center number detected'
//       })
//     }

//     const newWorkCenter = await WorkCenter.create({
//       NAME: body.NAME,
//       NUMBER: body.NUMBER,
//       position: body.position || null,
//       QB_Activity: body.QB_Activity || null,
//       TimeEntryWithoutJob: body.TimeEntryWithoutJob || false,
//       Paid: body.Paid || false,
//       instanceID: body.instanceID || null
//     })

//     return newWorkCenter
//   } catch (error) {
//     console.error('Error creating work center:', error)
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.message || 'Error creating work center'
//     })
//   }
// }

// async function updateWorkCenter(event: H3Event) {
//   try {
//     const body = await readBody(event) as IWorkCenter & { uniqueID: number }
    
//     if (!body.uniqueID) {
//       throw createError({
//         statusCode: 400,
//         statusMessage: 'Work center ID is required for update'
//       })
//     }

//     const [updatedCount, updatedWorkCenters] = await WorkCenter.update({
//       NAME: body.NAME,
//       NUMBER: body.NUMBER,
//       position: body.position || null,
//       QB_Activity: body.QB_Activity || null,
//       TimeEntryWithoutJob: body.TimeEntryWithoutJob || false,
//       Paid: body.Paid || false
//     }, {
//       where: {
//         uniqueID: body.uniqueID
//       },
//       returning: true
//     })

//     if (updatedCount === 0) {
//       throw createError({
//         statusCode: 404,
//         statusMessage: 'Work center not found'
//       })
//     }

//     return updatedWorkCenters[0]
//   } catch (error) {
//     console.error('Error updating work center:', error)
//     throw createError({
//       statusCode: error.statusCode || 500,
//       statusMessage: error.message || 'Error updating work center'
//     })
//   }
// }

// async function getSkills(workcenterId: string) {
//   try {
//     const skills = await Skill.findAll({
//       where: {
//         WorkCenters: {
//           [Op.like]: `%,${workcenterId},%`
//         }
//       },
//       attributes: ['Name', 'TrainingNotes', 'Prerequisites'],
//       order: [['Name', 'ASC']]
//     })
    
//     return skills.map(skill => ({
//       name: skill.Name,
//       trainingNotes: skill.TrainingNotes || null,
//       prerequisites: skill.Prerequisites || null
//     }))
//   } catch (error) {
//     console.error('Error fetching skills:', error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error fetching skills'
//     })
//   }
// }

// async function getEmployees(workcenterId: string) {
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
//     })
    
//     return employees.map(emp => ({
//       name: `${emp.lname}, ${emp.fname}`,
//       department: emp.department || null
//     }))
//   } catch (error) {
//     console.error('Error fetching employees:', error)
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error fetching employees'
//     })
//   }
// }

// // async function getQBActivities() {
// //   try {
// //     const gen = new QBXMLGenerator('PayrollItemWageQueryRq')
// //     gen.appendRequest('FullName')
// //     const response = await gen.processRequest()
    
// //     return response.map((item: any) => ({
// //       label: item.Name,
// //       value: item.Name
// //     }))
// //   } catch (error) {
// //     console.error('Error fetching QuickBooks activities:', error)
// //     throw createError({
// //       statusCode: 500,
// //       statusMessage: 'Error fetching QuickBooks activities'
// //     })
// //   }
// // }


import { defineEventHandler, getQuery, readBody, H3Event } from 'h3';
import { Op } from 'sequelize';
import WorkCenter from '~/server/models/tblWorkCenters';
import Organization from '~/server/models/tblOrganization';
import Skill from '~/server/models/tblSkills';
import Employee from '~/server/models/tblEmployee';
// import { QBXMLGenerator } from '~/utils/qbxml-generator';

// Interfaces matching exact database schemas
interface IWorkCenter {
  uniqueID?: number;
  instanceID?: number;
  NAME: string;
  NUMBER: string;
  position?: string;
  QB_Activity?: string;
  TimeEntryWithoutJob?: boolean;
  Paid?: boolean;
}

interface ISkill {
  UniqueID?: number;
  Name: string;
  WorkCenters?: string;
  [key: string]: any; // For other fields that might be needed
}

interface IEmployee {
  UniqueID?: number;
  fname: string;
  lname: string;
  WORKCENTERS?: string;
  [key: string]: any; // For other fields that might be needed
}

interface IOrganization {
  UniqueID?: number;
  Title: string;
  Employee?: string;
  WorkCenters?: string;
  [key: string]: any; // For other fields that might be needed
}

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method;
  const query = getQuery(event);

  switch (method) {
    case 'GET':
      if (query.type === 'qb-activities') {
        // return await getQBActivities();
      } else if (query.type === 'skills' && query.workcenterId) {
        return await getSkills(query.workcenterId as string);
      } else if (query.type === 'employees' && query.workcenterId) {
        return await getEmployees(query.workcenterId as string);
      } else if (query.type === 'positions') {
        return await getPositions();
      } else {
        return await getAllData();
      }
    case 'POST':
      return await createWorkCenter(event);
    case 'PUT':
      return await updateWorkCenter(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      });
  }
});

// Function to fetch all required data without relying on relationships
async function getAllData() {
  try {
    // Fetch Work Centers
    const workCenters = await WorkCenter.findAll({
      order: [['NUMBER', 'ASC']]
    });

    // Fetch Organizations
    const organizations = await Organization.findAll();

    // Fetch Skills
    const skills = await Skill.findAll();

    // Fetch Employees
    const employees = await Employee.findAll();

    return {
      workCenters: workCenters.map(wc => ({
        ...wc.toJSON(),
        position: wc.position || null,
        QB_Activity: wc.QB_Activity || null,
        TimeEntryWithoutJob: !!wc.TimeEntryWithoutJob,
        Paid: !!wc.Paid
      })),
      organizations: organizations.map(org => ({
        uniqueID: org.UniqueID,
        Title: org.Title,
        Employee: org.Employee || null,
        WorkCenters: org.WorkCenters || null
      })),
      skills: skills.map(skill => ({
        uniqueID: skill.UniqueID,
        Name: skill.Name,
        WorkCenters: skill.WorkCenters || null
      })),
      employees: employees.map(emp => ({
        uniqueID: emp.UniqueID,
        fname: emp.fname,
        lname: emp.lname,
        WORKCENTERS: emp.WORKCENTERS || null
      })),
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching all data'
    });
  }
}

async function getPositions() {
  try {
    const positions = await Organization.findAll({
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
}

async function createWorkCenter(event: H3Event) {
  try {
    const body = await readBody(event) as IWorkCenter;

    if (!body.NAME || !body.NUMBER) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and number are required'
      });
    }

    const existingWorkCenter = await WorkCenter.findOne({
      where: {
        NUMBER: body.NUMBER
      }
    });

    if (existingWorkCenter) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Duplicate work center number detected'
      });
    }

    const newWorkCenter = await WorkCenter.create({
      NAME: body.NAME,
      NUMBER: body.NUMBER,
      position: body.position || null,
      QB_Activity: body.QB_Activity || null,
      TimeEntryWithoutJob: body.TimeEntryWithoutJob || false,
      Paid: body.Paid || false,
      instanceID: body.instanceID || null
    });

    return newWorkCenter;
  } catch (error) {
    console.error('Error creating work center:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error creating work center'
    });
  }
}

async function updateWorkCenter(event: H3Event) {
  try {
    const body = await readBody(event) as IWorkCenter & { uniqueID: number };

    if (!body.uniqueID) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Work center ID is required for update'
      });
    }

    const [updatedCount, updatedWorkCenters] = await WorkCenter.update({
      NAME: body.NAME,
      NUMBER: body.NUMBER,
      position: body.position || null,
      QB_Activity: body.QB_Activity || null,
      TimeEntryWithoutJob: body.TimeEntryWithoutJob || false,
      Paid: body.Paid || false
    }, {
      where: {
        uniqueID: body.uniqueID
      },
      returning: true
    });

    if (updatedCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Work center not found'
      });
    }

    return updatedWorkCenters[0];
  } catch (error) {
    console.error('Error updating work center:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Error updating work center'
    });
  }
}

async function getSkills(workcenterId: string) {
  try {
    const skills = await Skill.findAll({
      where: {
        WorkCenters: {
          [Op.like]: `%,${workcenterId},%`
        }
      },
      attributes: ['Name', 'TrainingNotes', 'Prerequisites'],
      order: [['Name', 'ASC']]
    });

    return skills.map(skill => ({
      name: skill.Name,
      trainingNotes: skill.TrainingNotes || null,
      prerequisites: skill.Prerequisites || null
    }));
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching skills'
    });
  }
}

async function getEmployees(workcenterId: string) {
  try {
    const employees = await Employee.findAll({
      where: {
        WORKCENTERS: {
          [Op.like]: `%,${workcenterId},%`
        }
      },
      attributes: ['fname', 'lname', 'department'],
      order: [
        ['lname', 'ASC'],
        ['fname', 'ASC']
      ]
    });

    return employees.map(emp => ({
      name: `${emp.lname}, ${emp.fname}`,
      department: emp.department || null
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching employees'
    });
  }
}

async function getQBActivities() {
  try {
    const gen = new QBXMLGenerator('PayrollItemWageQueryRq');
    gen.appendRequest('FullName');
    const response = await gen.processRequest();

    return response.map((item: any) => ({
      label: item.Name,
      value: item.Name
    }));
  } catch (error) {
    console.error('Error fetching QuickBooks activities:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching QuickBooks activities'
    });
  }
}
