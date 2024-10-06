import { tblEmployee, tblWorkCenters, tblOrganization, tblSkills } from '~/server/models';
import { Sequelize, Op } from 'sequelize';
import { H3Event } from 'h3';



export const getAllData = async () => {
    try {
      const workCenters = await tblWorkCenters.findAll({
        attributes: ['uniqueID', '*'], 
        include: [
          {
            model: tblOrganization,
            as: 'organization', 
            where: {
              title: Sequelize.col('tblWorkCenters.position'),
            },
          },
        ],
        order: [['number', 'DESC']], 
      });
  
      return workCenters; 
    } catch (error) {
      console.error('Error fetching data:', error); 
      return { error: error.message }; 
    }
  };



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

// Function to create a work center
export const createWorkCenter = async (event: H3Event) => {
  // Implementation remains unchanged
};

// Function to update a work center
export const updateWorkCenter = async (event: H3Event) => {
  // Implementation remains unchanged
};

// Function to get skills by work center ID
export const getSkills = async (workcenterId: string) => {
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
};



// Function to get employees by work center ID
export const getEmployees = async (workcenterId: string) => {
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
};

// Function to get QuickBooks activities
export const getQBActivities = async () => {
  // Implementation remains unchanged
};

// Example function for position responsibility
export const positionResponsibility = async () => {

  try {
    const list = await tblEmployee.findAll({
      attributes: [
        [Sequelize.literal("CONCAT(fname, ' ', lname)"), 'fullName'],
      ],
      where: {
        ACTIVE: true
      }
    });
    console.log(list)
    return list.map(employee => employee.get('fullName'));
   
  } catch (err) {
    return err.message;
  }
};
