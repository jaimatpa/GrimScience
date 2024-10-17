import { Op, Sequelize } from 'sequelize';
import { tblBP, tblPlan, tblSteps, tblBPParts, tblMedia ,tblJobOperations } from "~/server/models";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';  

const formatDate = (date) => {
  const today = new Date(date);
  return String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
  String(today.getDate()).padStart(2, '0') + '/' + 
  today.getFullYear();
}


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

const reorderOperations = async (instanceID) => {
  // Fetch all records for the given instanceID, ordered by week and number
  const dt = await sequelize.query(`
    SELECT * FROM tblPlan 
    WHERE instanceid = :instanceID 
    ORDER BY CAST(week AS INT), number ASC
  `, {
    replacements: { instanceID },
    type: QueryTypes.SELECT
  });

  let start = 1;

  // Iterate through each row and update the NUMBER field
  for (const row of dt) {
    await sequelize.query(`
      UPDATE tblPlan 
      SET NUMBER = :start 
      WHERE UniqueID = :uniqueID
    `, {
      replacements: { start, uniqueID: row.UniqueID },
      type: QueryTypes.UPDATE
    });
    start += 1;
  }
};

export const operationExistByID = async (id) => {
  const tableDetail = await tblPlan.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const productExistByModel = async (model) => {
  const maxItem = await tblBP.findOne({
    where: { MODEL: model },
    order: [['UniqueID', 'DESC']],
  });

  if (!maxItem) {
    return false;
  }

  return maxItem.CODE !== 'Inactive';
};

export const getProductOperations = async (id) => {
  const tableDetail = await tblBP.findByPk(id);
  const instanceID = tableDetail.dataValues.instanceID;
  await reorderOperations(instanceID)
  // Fetch the plan details for the given instanceID
  const plans = await sequelize.query(`
    SELECT * FROM tblPlan 
    WHERE instanceid = :instanceID 
    ORDER BY CAST(number AS INT) ASC
  `, {
    replacements: { instanceID },
    type: QueryTypes.SELECT
  });

  let totalHours = 0;
  const results = await Promise.all(plans.map(async plan => {

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
      instanceid: plan.instanceid,
      Number: plan.Number,
      week: plan.week,
      Operation: plan.Operation,
      WorkCenter: plan.WorkCenter,
      Hours: parseFloat(plan.Hours),
      material: parseFloat((cost / multiple).toFixed(2))
    };

    // Accumulate total hours
    totalHours += item.Hours;

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

  return {
    skills: skillData
  };
}

export const createProductOperation = async (data) => {

  const tableDetail = await tblBP.findByPk(data.prodID);
  const instanceID = tableDetail.dataValues.instanceID;

  const { Number, Operation, WorkCenter, Hours, week, skills, username } = data;
  const strSkills = skills.map(skill => skill.UniqueID).join('=');

  if (!Operation || !WorkCenter || !Hours || !week) return { error: 'Please provide all the fields' };

  const createOperation = {
    instanceid: instanceID,
    Operation,
    WorkCenter,
    Hours,
    week,
    skills: strSkills,
    Number: parseInt(Number),
    PreparedBy: username,
    PreparedDate: formatDate(new Date()),
    ApprovedBy: '',
    ApprovedDate: '',

  }

  const newOperation = await tblPlan.create(createOperation);

  // Reorder operations (implement this function as needed)
  await reorderOperations(instanceID);
  return newOperation

}

export const editProductOperation = async (data,id) => {
  const tableDetail = await tblBP.findByPk(data.prodID);
  const instanceID = tableDetail.dataValues.instanceID;

  const { Number, Operation, WorkCenter, Hours, week, skills, username } = data;

  const strSkills = skills.map(skill => skill.UniqueID).join('=');

  if (!Operation || !WorkCenter || !Hours || !week) return { error: 'Please provide all the fields' };
  const today = new Date();
  const editOperation = {
    Operation,
    WorkCenter,
    Hours,
    week,
    skills: strSkills,
    Number: parseInt(Number),
    PreparedBy: username,
    PreparedDate: formatDate(today),
    ApprovedBy: '',
    ApprovedDate: '',

  }

  await tblPlan.update(editOperation, {
    where: { UniqueID: id}
  });
  await reorderOperations(instanceID);

  return id

}

export const deleteProductOperation = async (id) => {
  const tableDetail = await tblPlan.findByPk(id);
  const instanceID = tableDetail.dataValues.instanceid;
  // Fetch steps related to the plan
  const steps = await sequelize.query(`
    SELECT * FROM tblsteps 
    WHERE planid = :planUniqueID
  `, {
    replacements: { planUniqueID:id },
    type: QueryTypes.SELECT
  });

  // Loop through each step and delete related records from tblsteps, tblBPParts, and tblMedia
  for (const step of steps) {
    const stepID = step.UniqueID;

    await sequelize.query(`
      DELETE FROM tblsteps 
      WHERE UniqueID = :stepID
    `, {
      replacements: { stepID },
      type: QueryTypes.DELETE
    });

    await sequelize.query(`
      DELETE FROM tblBPParts 
      WHERE stepid = :stepID
    `, {
      replacements: { stepID },
      type: QueryTypes.DELETE
    });

    await sequelize.query(`
      DELETE FROM tblMedia 
      WHERE StepID = :stepID
    `, {
      replacements: { stepID },
      type: QueryTypes.DELETE
    });
  }

  // Delete the plan itself from tblplan
  await sequelize.query(`
    DELETE FROM tblplan 
    WHERE UniqueID = :planUniqueID
  `, {
    replacements: { planUniqueID:id },
    type: QueryTypes.DELETE
  });
  await reorderOperations(instanceID);
  return id

}

export const getOperationReportData = async (id) => {
  const reportData = await sequelize.query(`
    Select (select verified from tblJobOperations where tblJobOperations.PlanID = tblPlan.UniqueID and tblJobOperations.JobID=0) as verified,(select verifiedby from tblJobOperations where tblJobOperations.PlanID = tblPlan.UniqueID and tblJobOperations.JobID=0) as verifiedby,tblPlan.uniqueID as OUID, tblSteps.UniqueID as SID, (select top 1 '#' + model + ' ' + description from tblBP  Where instanceID = tblPlan.InstanceID  and uniqueid in ( select max(uniqueid) from tblbp where instanceid=tblPlan.InstanceID)) as PlanModel, tblPlan.hours,tblBP.ProductLine, tblPlan.Number, tblPlan.Operation, tblSteps.Step, tblSteps.description as StepDescription, tblSteps.notes as notes, tblBPParts.Note, tblBPParts.Qty, tblBP.InventoryUnit, tblBP.model, tblBP.description as BPDescription, tblPlan.WorkCenter, ApprovedBy, ApprovedDate, PreparedBy, PreparedDate  from tblPlan left join tblSteps on tblSteps.PlanID = tblPlan.UniqueID left join tblBPParts on tblBPParts.StepID = tblSteps.UniqueID left join tblBP on tblBP.uniqueID = tblBPParts.partID Where tblPlan.InstanceID = :instanceId Order by tblPlan.Number, cast(step as int), model
  `, {
    replacements: { instanceId:id },
    type: QueryTypes.SELECT
  });

  return reportData
}

export const OperationExistByID = async (id: number | string) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
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

export const cloneOperations = async (sourceModelName, targetModelName, username) => {

  // Step 1: Fetch target model details
  const targetModel = await sequelize.query(`
    SELECT * FROM tblBP WHERE MODEL = :targetModelName AND CODE <> 'inactive' 
    AND uniqueID IN (SELECT MAX(UniqueID) FROM tblBP GROUP BY instanceID)
  `, {
    replacements: { targetModelName },
    type: QueryTypes.SELECT
  });

  if (targetModel.length === 0) {
    throw new Error("This model does not exist. Please create a model before cloning its instructions.");
  }

  const productInstanceID = targetModel[0].instanceID;

  // Step 2: Fetch source model details
  const sourceModel = await sequelize.query(`
    SELECT instanceID FROM tblBP WHERE MODEL = :sourceModelName 
  `, {
    replacements: { sourceModelName },
    type: QueryTypes.SELECT
  });

  const sourceInstanceID = sourceModel[0].instanceID;

  // Step 3: Fetch operations from the source model
  const sourceOperations = await sequelize.query(`
    SELECT UniqueID FROM tblPlan WHERE instanceID = :sourceInstanceID
  `, {
    replacements: { sourceInstanceID },
    type: QueryTypes.SELECT
  });

  // Step 4: Clone operations and steps
  for (const operation of sourceOperations) {
    const operationDetails = await sequelize.query(`
      SELECT * FROM tblPlan WHERE UniqueID = :operationID
    `, {
      replacements: { operationID: operation.UniqueID },
      type: QueryTypes.SELECT
    });

    
    // throw new Error("gasdg")
    // Create new operation for target model
    const today = new Date();
    const formattedDate = String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
    String(today.getDate()).padStart(2, '0') + '/' + 
    today.getFullYear();
    const newOperation = await tblPlan.create({
      instanceid: productInstanceID,
      Operation: operationDetails[0].Operation,
      WorkCenter: operationDetails[0].WorkCenter,
      Hours: operationDetails[0].Hours,
      Number: operationDetails[0].Number,
      week: operationDetails[0].week,
      skills: operationDetails[0].skills,
      PreparedBy: username,
      PreparedDate: formattedDate,
      ApprovedBy: '',
      ApprovedDate: '',
    });
    
    const newOperationID = newOperation.UniqueID;
    // Step 5: Clone steps for the operation
    const sourceSteps = await sequelize.query(`
      SELECT * FROM tblSteps WHERE PLANID = :operationID
    `, {
      replacements: { operationID: operation.UniqueID },
      type: QueryTypes.SELECT
    });

    for (const step of sourceSteps) {
      const newStep = await tblSteps.create({
        Step: step.Step,
        Description: step.Description,
        notes: step.notes,
        PLANID: newOperationID,
      });

      const newStepID = newStep.UniqueID;

      // Step 6: Clone media linked to the step
      const stepMedia = await sequelize.query(`
        SELECT * FROM tblMedia WHERE StepID = :stepID
      `, {
        replacements: { stepID: step.UniqueID },
        type: QueryTypes.SELECT
      });

      for (const media of stepMedia) {
        await tblMedia.create({
          Path: media.Path,
          Name: media.Name,
          StepID: newStepID,
        });
      }

      // Step 7: Clone parts linked to the step
      const stepParts = await sequelize.query(`
        SELECT * FROM tblBPParts WHERE stepid = :stepID
      `, {
        replacements: { stepID: step.UniqueID },
        type: QueryTypes.SELECT
      });

      for (const part of stepParts) {
        delete part.uniqueid
        await tblBPParts.create({
          ...part,
          stepid: newStepID,
          instanceid: productInstanceID,
        });
      }
    }
  }
  await reorderOperations(productInstanceID);
  return targetModelName;
};

export const cloneOperationAndSteps = async (frmInstanceId, selectedOperation, username) => {
  try {
    // Exit if the form instance ID is 0 or no operation is selected
    if (!frmInstanceId || !selectedOperation) {
      return;
    }

    const operationDetails = await sequelize.query(`
      SELECT * FROM tblPlan WHERE UniqueID = :operationID
    `, {
      replacements: { operationID: selectedOperation },
      type: QueryTypes.SELECT
    });

    const newOperation = await tblPlan.create({
      instanceid: frmInstanceId,
      Operation: operationDetails[0].Operation,
      WorkCenter: operationDetails[0].WorkCenter,
      Hours: operationDetails[0].Hours,
      Number: operationDetails[0].Number,
      week: operationDetails[0].week,
      skills: operationDetails[0].skills,
      PreparedBy: username,
      PreparedDate: formatDate(new Date()),
      ApprovedBy: '',
      ApprovedDate: '',
    });

    const newOperationID = newOperation.UniqueID;

    // Step 5: Clone steps for the operation
    const sourceSteps = await sequelize.query(`
      SELECT * FROM tblSteps WHERE PLANID = :operationID
    `, {
      replacements: { operationID: selectedOperation },
      type: QueryTypes.SELECT
    });

    for (const step of sourceSteps) {
      const newStep = await tblSteps.create({
        Step: step.Step,
        Description: step.Description,
        notes: step.notes,
        PLANID: newOperationID,
      });

      const newStepID = newStep.UniqueID;

      // Step 6: Clone media linked to the step
      const stepMedia = await sequelize.query(`
        SELECT * FROM tblMedia WHERE StepID = :stepID
      `, {
        replacements: { stepID: step.UniqueID },
        type: QueryTypes.SELECT
      });

      for (const media of stepMedia) {
        await tblMedia.create({
          Path: media.Path,
          Name: media.Name,
          StepID: newStepID,
        });
      }

      // Step 7: Clone parts linked to the step
      const stepParts = await sequelize.query(`
        SELECT * FROM tblBPParts WHERE stepid = :stepID
      `, {
        replacements: { stepID: step.UniqueID },
        type: QueryTypes.SELECT
      });

      for (const part of stepParts) {
        delete part.uniqueid
        await tblBPParts.create({
          ...part,
          stepid: newStepID,
          instanceid: frmInstanceId,
        });
      }
    }

  } catch (error) {
    console.error('Error cloning operation and steps:', error.message);
    throw new Error(error.message);
  }
};

