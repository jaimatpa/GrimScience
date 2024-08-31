import { Op, Sequelize } from 'sequelize';
import { tblBP, tblPlan, tblJobOperations } from "~/server/models";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';  

const formatDateForSQLServer = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

export const operationExistByID = async (id) => {
  const tableDetail = await tblPlan.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}



export const getProductOperations = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  const instanceID = tableDetail.dataValues.instanceID;
  // Fetch the plan details for the given instanceID
  const plans = await sequelize.query(`
    SELECT * FROM tblPlan 
    WHERE instanceid = :instanceID 
    ORDER BY CAST(number AS INT) ASC
  `, {
    replacements: { instanceID },
    type: QueryTypes.SELECT
  });
  // console.log(plans)
  let totalHours = 0;
  const results = await Promise.all(plans.map(async plan => {
    console.log(plan)
    // Calculate cost for each item
    const costDetails = await sequelize.query(`
      SELECT ordercost, Multiple 
      FROM vwPlan 
      WHERE uniqueid = :UniqueID
    `, {
      replacements: { UniqueID: plan.UniqueID },
      type: QueryTypes.SELECT
    });

    let cost = 0;
    let multiple = 1;
    costDetails.forEach(detail => {
      cost += parseFloat(detail.ordercost);
      multiple = detail.Multiple || 1;
    });
    
    // Build the response object
    const item = {
      UniqueID: plan.UniqueID,
      Number: plan.Number,
      week: plan.week,
      Operation: plan.Operation,
      WorkCenter: plan.WorkCenter,
      Hours: parseFloat(plan.Hours),
      material: parseFloat((cost / multiple).toFixed(2))
    };

    // Accumulate total hours
    totalHours += item.Hours;
    // console.log(item)
    return item;
  }));

  return {
    totalHours: totalHours.toFixed(2),
    items: results
  };
};

export const getOperationSteps = async (id) => {
  // Fetch the steps associated with the given plan ID
  const steps = await sequelize.query(`
    SELECT * FROM tblSteps 
    WHERE planid = :planUniqueID 
    ORDER BY CAST(step AS INT)
  `, {
    replacements: { planUniqueID:id },
    type: QueryTypes.SELECT
  });

  // Array to hold the steps and skills data
  const stepData = [];

  // Loop through each step to process and format data
  for (const step of steps) {
    const Step = (parseInt(step.Step) >= 0)
      ? String.fromCharCode(64 + parseInt(step.Step))  // Convert step to letter (A, B, C, etc.)
      : step.Step;

    // Push step information to the array
    stepData.push({
      Step,
      Description: step.Description,
      UniqueID: step.UniqueID
    });
  }
  console.log(stepData)
  return {
    steps: stepData,
  };
}

export const getOperationSkills = async (id) => {
  // Fetch the plan information based on the planUniqueID
  const planDetails = await sequelize.query(`
    SELECT * FROM tblPlan 
    WHERE uniqueid = :planUniqueID
  `, {
    replacements: { planUniqueID:id },
    type: QueryTypes.SELECT
  });
  console.log( planDetails[0].skills)
  // Extract and split the skills associated with the plan
  const skills = planDetails[0].skills.split('=');
  const skillData = [];

  for (const skillID of skills) {
    if (parseInt(skillID) > 0) {
      const skillDetails = await sequelize.query(`
        SELECT * FROM tblskills 
        WHERE uniqueid = :skillID
      `, {
        replacements: { skillID: parseInt(skillID) },
        type: QueryTypes.SELECT
      });

      if (skillDetails.length > 0) {
        // Push skill information to the array
        skillData.push({
          Name: skillDetails[0].Name,
          UniqueID: skillDetails[0].UniqueID
        });
      }
    }
  }
  console.log(skillData)
  return {
    skills: skillData
  };
}

export const createProductOperation = async (data) => {

  const tableDetail = await tblBP.findByPk(data.id);
  const instanceID = tableDetail.dataValues.instanceID;

  const { Number, Operation, WorkCenter, Hours, week } = data;

  if (!Operation || !WorkCenter || !Hours || !week) return { error: 'Please provide all the fields' };
  const today = new Date();
  const createOperation = {
    instanceid: instanceID,
    Operation,
    WorkCenter,
    Hours,
    week,
    Number: parseInt(Number),
    PreparedBy: 'Leith',
    PreparedDate: formatDateForSQLServer(today),
    ApprovedBy: '',
    ApprovedDate: '',

  }

  const newOperaion = await tblBP.create(createOperation);
  return newOperaion

}

const addOrUpdatePlan = async (data, instanceID) => {
  const { txtOperation, cboWorkCenter, txtStep, txtHours, txtweek, lstSkills, tag } = data;

  // Validate input
  if (!txtOperation || !cboWorkCenter || !txtStep || !txtHours || !txtweek) return;

  let xxx = tag || 0;

  // Fetch existing plan data
  const existingPlan = await sequelize.query(`
    SELECT * FROM tblPlan WHERE uniqueid = :uniqueID
  `, {
    replacements: { uniqueID: xxx },
    type: QueryTypes.SELECT
  });

  let isNew = false;
  let planRecord;

  if (existingPlan.length === 0) {
    planRecord = {}; // New record
    isNew = true;
  } else {
    planRecord = existingPlan[0]; // Existing record
  }

  // Set plan record fields
  planRecord.instanceid = instanceID;
  planRecord.operation = txtOperation;
  planRecord.Week = txtweek;
  planRecord.workcenter = cboWorkCenter;
  planRecord.hours = parseFloat(txtHours);
  planRecord.Number = parseInt(txtStep);
  planRecord.PreparedBy = gStrEmployee;
  planRecord.PreparedDate = new Date().toLocaleDateString();
  planRecord.ApprovedBy = '';
  planRecord.ApprovedDate = '';

  // Handle skills
  const strSkills = lstSkills.map(skill => skill.tag).join('=');
  planRecord.skills = strSkills;

  // Save or update the record
  if (isNew) {
    await tblPlan.create(planRecord);
  } else {
    await tblPlan.update(planRecord, { where: { uniqueid: xxx } });
  }

  // Clear form fields
  data.txtHours = '';
  data.txtOperation = '';
  data.txtweek = '';
  data.txtStep = '';
  data.cboWorkCenter = '';
  data.lstSkills = [];

  const str = cboWorkCenter;

  // Reorder operations (implement this function as needed)
  await reorderOperations(instanceID);

  // Reload the manufacturing sequence
  await getManufacturingSequence(instanceID);

  data.cboWorkCenter = str;
};



export const OperationExistByID = async (id: number | string) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const deleteOperation = async (id) => {
  await tblJobOperations.destroy({ where: { UniqueID: id } });
  return id;
}

export const getJobOperationDetail = async (id) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  return tableDetail
}

export const updateJobOperation = async (id, reqData) => {
  await tblJobOperations.update(reqData, {
    where: { UniqueID: id }
  });
  return id;
}

export const getWorkCenter = async () => {
  const result = await tblJobOperations.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('WorkCenter')), 'WorkCenter']
    ],
    where: {
      [Op.and]: [
        { 'WorkCenter': { [Op.ne]: null } },
        { 'WorkCenter': { [Op.ne]: '' } }
      ]
    },
    order: [['WorkCenter', 'ASC']],
    raw: true
  });

  const distinctWorkCenter = result.map((item: any) => item['WorkCenter']);
  return distinctWorkCenter;
}
