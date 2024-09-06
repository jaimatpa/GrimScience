import  sequelize  from '../../utils/databse';  
import { tblBP, tblPlan, tblBPParts, tblSteps, tblMedia } from "~/server/models";
import { QueryTypes } from 'sequelize';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';

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

export const stepExistByID = async (id) => {
  const tableDetail = await tblSteps.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const getStepInformation = async (id) => {

  let stepInfo = await sequelize.query(`
    SELECT * FROM tblSteps WHERE UniqueID = :stepUniqueID
  `, {
    replacements: { stepUniqueID: id },
    type: QueryTypes.SELECT
  });


  const stepText = (parseInt(stepInfo[0].Step) >= 0)
    ? String.fromCharCode(parseInt(stepInfo[0].Step) + 64)
    : stepInfo[0].Step;

  const parts = await sequelize.query(`
    Select *,code from tblBPParts Inner join tblBP on tblbp.uniqueid=tblbpparts.partid where StepID = :stepID order by model asc
  `, {
    replacements: { stepID: id },
    type: QueryTypes.SELECT
  });


  const partData = parts.map(part => ({
    model: part.MODEL,
    description: part.DESCRIPTION,
    qty: parseFloat(part.qty).toFixed(3),
    unit: part.InventoryUnit,
    key: part.note,
    isObsolete: part.CODE === 'Obsolete',
    sortOrder: parseInt(part.sortOrder),
    UniqueID: part.UniqueID
  }));

  // Fetch media associated with the step
  const media = await sequelize.query(`
    SELECT * FROM tblMedia WHERE StepID = :stepID
  `, {
    replacements: { stepID: id },
    type: QueryTypes.SELECT
  });


  const mediaData = media.map(mediaFile => ({
    name: mediaFile.Name,
    path: mediaFile.Path,
    stepId: mediaFile.StepID,
    uniqueID: mediaFile.UniqueID
  }));

  // Return all step details
  return {
    stepInfo: { Description: stepInfo[0].Description, notes:  stepInfo[0].notes || '', step: stepText},
    parts: partData,
    media: mediaData
  };
};
export const saveStepDetails = async (stepData, partsList, mediaList, username, deleteFiles) => {
  
  const { stepDescription, stepLetter, planID, instanceID, notes } = stepData;
  console.log("o;asidfopsadifh", stepData)

  if (!stepDescription) {
    throw new Error("Please enter a description to save this step.");
  }

  if (!stepLetter) {
    throw new Error("Please enter a Step Letter to save this step.");
  }

  let stepID;
  let step;

  // Check if the step already exists
  if(stepData.UniqueID !== null) {
    step = await tblSteps.findOne({ where: { UniqueID: JSON.parse(stepData.UniqueID)} });
    step.Description = stepDescription;
    step.notes = notes;
    await step.save();
    stepID = step.UniqueID;
  }else{
    // Create a new step if it doesn't exist
    step = await tblSteps.create({
      PLANID: planID,
      Step: stepLetter.charCodeAt(0) - 64, // Convert letter to step number
      Description: stepDescription,
      notes: notes
    });
    stepID = step.UniqueID;
  }
  // Handle Parts
  await tblBPParts.destroy({ where: { stepid: stepID } });

  for (const part of partsList) {
    await tblBPParts.create({
      qty: part.qty,
      instanceid: instanceID,
      partid: part.UniqueID,
      stepid: stepID,
      note: part.key
    });

    const bpRecord = await tblBP.findOne({ where: { UniqueID: part.UniqueID } });
    if (bpRecord && bpRecord.InspectionLevel === 0) {
      bpRecord.InspectionLevel = 1;
      await bpRecord.save();
    }
  }

  // console.log(mediaList)

// Handle Media

if(deleteFiles.length > 0){

  for (const id of deleteFiles) {
    if (parseInt(id) > 0) {
      await tblMedia.destroy({ where: { UniqueID: id } });
    }
  }

}

  // Iterate through mediaList and save each file
  if (mediaList[0] !== undefined){
    for (const media of mediaList) {
      const filePath = path.join(process.cwd(), 'public/StepFiles', stepID+"_"+media.originalFilename);
      
      // Create a read stream from the temp file and a write stream to the destination
      const readStream = createReadStream(media.filepath);
      const writeStream = createWriteStream(filePath);
    
      // Pipe the read stream to the write stream
      await new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    
      // Save media record in the database
      await tblMedia.create({
        Name: media.originalFilename,
        Path: "/StepFiles/"+ stepID+"_"+media.originalFilename,
        StepID: stepID,
      });
    }
  }


  // Save or update the plan record
  let plan = await tblPlan.findOne({ where: { uniqueid: planID } });
  const today = new Date();
  const planData = {
    PreparedBy: username, // Replace with the actual employee name
    PreparedDate: formatDateForSQLServer(today),
    ApprovedBy: "",
    ApprovedDate: ""
  };

  if (plan) {
    await plan.update(planData);
  }

  return stepID;
};


export const deleteStep = async (id, employeeName) => {

  // Fetch step details based on the unique ID (Me.Tag in VB.NET)
  const tableDetail = await tblSteps.findByPk(id);

  console.log(tableDetail.dataValues.PLANID)


  // Delete related records from tblsteps, tblBPParts, and tblMedia
  await sequelize.query(`
    DELETE FROM tblsteps WHERE uniqueid = :stepUniqueID
  `, {
    replacements: { stepUniqueID: id },
    type: QueryTypes.DELETE
  });

  await sequelize.query(`
    DELETE FROM tblBPParts WHERE StepId = :stepUniqueID
  `, {
    replacements: { stepUniqueID: id },
    type: QueryTypes.DELETE
  });

  await sequelize.query(`
    DELETE FROM tblMedia WHERE StepId = :stepUniqueID
  `, {
    replacements: { stepUniqueID: id },
    type: QueryTypes.DELETE
  });
  
  
  // Fetch plan details based on the plan ID (lngPlanID in VB.NET)

  let planInfo = await sequelize.query(`
    SELECT * FROM tblPlan WHERE UniqueID = :planID
  `, {
    replacements: { planID: tableDetail.dataValues.PLANID },  // Assuming lngPlanID is available in context
    type: QueryTypes.SELECT
  });

  let isNew = false;
  let planRecord;

  // If no plan is found, create a new one
  if (planInfo.length === 0) {
    isNew = true;
    planRecord = {};  // New plan record
  } else {
    planRecord = planInfo[0];  // Use existing plan record
  }

  // Update fields in the plan record
  const today = new Date()
  planRecord.PreparedBy = employeeName;  // gStrEmployee in VB.NET
  planRecord.PreparedDate = formatDateForSQLServer(today)  // Format as short date
  planRecord.ApprovedBy = "";
  planRecord.ApprovedDate = "";

  // Insert or update the record in tblplan
  if (isNew) {
    await sequelize.query(`
      INSERT INTO tblPlan (PreparedBy, PreparedDate, ApprovedBy, ApprovedDate)
      VALUES (:preparedBy, :preparedDate, :approvedBy, :approvedDate)
    `, {
      replacements: {
        preparedBy: planRecord.PreparedBy,
        preparedDate: planRecord.PreparedDate,
        approvedBy: planRecord.ApprovedBy,
        approvedDate: planRecord.ApprovedDate
      },
      type: QueryTypes.INSERT
    });
  } else {
    await sequelize.query(`
      UPDATE tblplan 
      SET PreparedBy = :preparedBy, PreparedDate = :preparedDate, ApprovedBy = :approvedBy, ApprovedDate = :approvedDate
      WHERE UniqueID = :planID
    `, {
      replacements: {
        preparedBy: planRecord.PreparedBy,
        preparedDate: planRecord.PreparedDate,
        approvedBy: planRecord.ApprovedBy,
        approvedDate: planRecord.ApprovedDate,
        planID: tableDetail.dataValues.PLANID  // Assuming lngPlanID is available
      },
      type: QueryTypes.UPDATE
    });
  }

  // Simulate the call to the frmMfgSequence list view event
  // frmMfgSequence.lvw_SelectedIndexChanged could be another function triggered here
  // await handleListViewChange();  // Placeholder for this function

  return id;
};
