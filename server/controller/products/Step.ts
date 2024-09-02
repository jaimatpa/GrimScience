import { Op, Sequelize } from 'sequelize';
import  sequelize  from '../../utils/databse';  
import { tblBP, tblPlan, tblBPParts, tblSteps, tblMedia } from "~/server/models";
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

export const saveStepDetails = async (stepData, partsList, mediaList) => {
  const { stepDescription, stepLetter, planID, instanceID, notes } = stepData;

  if (!stepDescription) {
    throw new Error("Please enter a description to save this step.");
  }

  if (!stepLetter) {
    throw new Error("Please enter a Step Letter to save this step.");
  }

  let stepID;
  
  // Check if the step already exists
  let step = await tblSteps.findOne({ where: { UniqueID: stepData.UniqueID } });

  if (!step) {
    // If the step doesn't exist, create a new one
    step = await tblSteps.create({
      PLANID: planID,
      Step: stepLetter.charCodeAt(0) - 64, // Convert letter to step number
      Description: stepDescription,
      notes: notes
    });
    stepID = step.UniqueID;
  } else {
    // Update existing step
    step.Description = stepDescription;
    step.notes = notes;
    await step.save();
    stepID = step.UniqueID;
  }

  // Handle Parts - First, remove existing parts for the step
  await tblBPParts.destroy({ where: { stepid: stepID } });

  // Then, add new parts
  for (const part of partsList) {
    const partRecord = await tblBPParts.create({
      qty: part.qty,
      instanceid: instanceID,
      partid: part.partid,
      stepid: stepID,
      note: part.note
    });

    // Update inspection level if needed
    const bpRecord = await tblBP.findOne({ where: { UniqueID: part.partid } });
    if (bpRecord && bpRecord.InspectionLevel === 0) {
      bpRecord.InspectionLevel = 1;
      await bpRecord.save();
    }
  }

  // Handle Media - First, remove existing media for the step
  await tblMedia.destroy({ where: { StepId: stepID } });

  // Then, add new media
  for (const media of mediaList) {
    await tblMedia.create({
      Name: media.name,
      Path: media.path,
      StepID: stepID
    });
  }

  // Save or update the plan record
  let plan = await tblPlan.findOne({ where: { uniqueid: planID } });
  const planData = {
    PreparedBy: "EmployeeName", // Replace with actual employee name
    PreparedDate: new Date(),
    ApprovedBy: "",
    ApprovedDate: ""
  };

  if (plan) {
    await plan.update(planData);
  }

  // Final operations (e.g., refreshing data, redirecting, etc.)
  return stepID;
};
