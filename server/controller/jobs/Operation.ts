import { tblEmployee, tblJobOperations, tblOperationHoursWorked } from "~/server/models";
import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';

const applyFilters = (params) => {
  const filterParams = ['JobID', 'week', 'Operation', 'WorkCenter', 'Hours', 'reworkhrs', 'verified', 'DateScheduled', 'OperationID'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`
      };
    }
  });

  return whereClause;
};

export const getAllOperation = async (jobId, model) => {
  const modelNumber = model.trim().split(" ")[0];
  const query = `SELECT TOP 1 instanceID FROM tblBP WHERE MODEL = :model`;
  const [result] = await sequelize.query(query, {
    replacements: { model: modelNumber },
    type: QueryTypes.SELECT
  });

  const list = await sequelize.query(`
    Select distinct tblJobOperations.*, tblPlan.UniqueID as PID from tblJobOperations left join tblPlan on tblJobOperations.PlanID = tblPlan.uniqueID Where tblJobOperations.instanceid = :instanceid and jobID = :jobId order by number asc
  `, {
    replacements: { jobId: jobId, instanceid: result.instanceID },
    type: QueryTypes.SELECT
  });
  console.log(list)
  return list;
}

export const refreshJobOperations = async (lngJob, instanceid, model) => {
  try {
    const modelNumber = model.trim().split(" ")[0];
    const query = `SELECT TOP 1 instanceID FROM tblBP WHERE MODEL = :model`;
    const [result] = await sequelize.query(query, {
      replacements: { model: modelNumber },
      type: QueryTypes.SELECT
    });
    const recJOainstanceID = result.instanceID
    console.log(lngJob, instanceid, recJOainstanceID)
    // Fetch the existing job operations
    const jobOperationDt = await sequelize.query(`
      SELECT * FROM tblJobOperations
    `, { type: QueryTypes.SELECT });

    // Fetch the new operations from tblPlan excluding the ones already in tblJobOperations
    const newOperationDT = await sequelize.query(`
      SELECT * FROM tblPlan 
      WHERE instanceID = :instanceid 
      EXCEPT 
      SELECT tblPlan.* 
      FROM tblPlan 
      LEFT JOIN tblJobOperations ON tblJobOperations.PlanID = tblPlan.uniqueID 
      WHERE tblJobOperations.jobID = :lngJob
    `, {
      replacements: { instanceid, lngJob },
      type: QueryTypes.SELECT
    });

    // Iterate over each new operation and insert into tblJobOperations
    for (const row of newOperationDT) {
      const newOperationAddDT = await sequelize.query(`
        SELECT DISTINCT tblPlan.* 
        FROM tblPlan 
        LEFT JOIN tblBP ON tblPlan.instanceid = tblBP.instanceID 
        WHERE tblPlan.instanceid = :recJOainstanceID AND tblPlan.uniqueID = :uniqueID 
        ORDER BY number DESC
      `, {
        replacements: { recJOainstanceID, uniqueID: row.UniqueID },
        type: QueryTypes.SELECT
      });
      
      if (newOperationAddDT.length > 0) {
        const newOpDataRow = newOperationAddDT[0];
        console.log('newOpDataRow',newOpDataRow)
        // Insert new job operation
        await sequelize.query(`
          INSERT INTO tblJobOperations (JobID, PlanID, instanceid, Operation, WorkCenter, Hours, Number, week)
          VALUES (:lngJob, :PlanID, :instanceid, :Operation, :WorkCenter, :Hours, :Number, :week)
        `, {
          replacements: {
            lngJob,
            PlanID: newOpDataRow.UniqueID,
            instanceid: newOpDataRow.instanceid,
            Operation: newOpDataRow.Operation,
            WorkCenter: newOpDataRow.WorkCenter,
            Hours: newOpDataRow.Hours,
            Number: newOpDataRow.Number,
            week: newOpDataRow.week
          },
          type: QueryTypes.INSERT
        });
      }
    }

    // Update existing job operations based on changes in tblPlan
    const jobOperationsDT = await sequelize.query(`
      SELECT * FROM tblJobOperations WHERE JobID = :lngJob
    `, {
      replacements: { lngJob },
      type: QueryTypes.SELECT
    });

    for (const row of jobOperationsDT) {
      const updateOpDataRow = await sequelize.query(`
        SELECT DISTINCT tblPlan.* 
        FROM tblPlan 
        WHERE tblPlan.uniqueID = :PlanID 
        ORDER BY number DESC
      `, {
        replacements: { PlanID: row.PlanID },
        type: QueryTypes.SELECT
      });

      if (updateOpDataRow.length > 0) {
        const updateOp = updateOpDataRow[0];
        // Update job operation details
        await sequelize.query(`
          UPDATE tblJobOperations 
          SET Operation = :Operation, WorkCenter = :WorkCenter, Hours = :Hours, Number = :Number, week = :week
          WHERE PlanID = :PlanID AND JobID = :lngJob
        `, {
          replacements: {
            Operation: updateOp.Operation,
            WorkCenter: updateOp.WorkCenter,
            Hours: updateOp.Hours,
            Number: updateOp.Number,
            week: updateOp.week,
            PlanID: row.PlanID,
            lngJob
          },
          type: QueryTypes.UPDATE
        });
      }
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

tblOperationHoursWorked.belongsTo(tblEmployee, { foreignKey: 'EmployeeID', targetKey: 'UniqueID' });

export const getEmployeeSchedules = async (sortBy, sortOrder, filterParams) => {

  const whereClause = applyFilters(filterParams);

  const list = await tblOperationHoursWorked.findAll({
    attributes: [
      'UniqueID',
      'JobID',
      'OperationID',
      'StartTime',
      'Hours',
      'StartTime'
    ],
    include: [
      {
        model: tblEmployee,
        attributes: ['UniqueID', 'payrollnumber', 'fname', 'lname'],
      }
    ],
    where: whereClause,
    order: [[sortBy || 'UniqueID', sortOrder || 'ASC']],
  });

  const formattedList = list.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      JobID: item.JobID,
      OperationID: item.OperationID,
      StartTime: item.StartTime,
      Hours: item.Hours,
      employee: `#${item.tblEmployee.payrollnumber} ${item.tblEmployee.fname} ${item.tblEmployee.lname}`
    }
  })

  return formattedList;
};

export const getEmployeeOperationSchedules = async (params) => {

  const { JobID, OperationID } = params
  let where = {}
  if (JobID) where['JobID'] = JobID
  if (OperationID) where['OperationID'] = OperationID

  const list = await tblOperationHoursWorked.findAll({
    attributes: [
      'UniqueID',
      'JobID',
      'OperationID',
      'StartTime',
      'Hours',
      'StartTime'
    ],
    include: [
      {
        model: tblEmployee,
        attributes: ['UniqueID', 'payrollnumber', 'fname', 'lname'],
      }
    ],
    where: where,
  });

  const formattedList = list.map((item: any) => {
    return {
      UniqueID: item.UniqueID,
      JobID: item.JobID,
      OperationID: item.OperationID,
      StartTime: item.StartTime,
      Hours: item.Hours,
      employee: `#${item.tblEmployee.payrollnumber} ${item.tblEmployee.fname} ${item.tblEmployee.lname}`
    }
  })

  return formattedList;
};

export const getJobOperationsById = async (params) => {
  const { JobID } = params
  let where = {}
  if (JobID) where['JobID'] = JobID
  const reports = await tblJobOperations.findAll({
    where: where,
    raw: true
  })
  return reports
}

export const OperationExistByID = async (id: number | string) => {
  const tableDetail = await tblJobOperations.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const deleteRougeOperation = async (lngJob, lngJobOperationID, lngPlanID) => {
  try {
    // Step 1: Check if the operation is part of an active build plan
    const planCount = await sequelize.query(`
      SELECT COUNT(tblPlan.uniqueID) AS cnt 
      FROM tblPlan 
      WHERE uniqueID = :lngPlanID
    `, {
      replacements: { lngPlanID },
      type: QueryTypes.SELECT
    });

    if(planCount.length === 0) {
      throw new Error("You may not delete an active operation. This is part of the build plan.");
    }

    for( let row of planCount) {
      if(row.cnt > 0){
        throw new Error("You may not delete an active operation. This is part of the build plan.");
      }
    }

    // Step 2: Check if the operation has time entries
    const operationHoursCount = await sequelize.query(`
      SELECT COUNT(tblOperationHoursWorked.uniqueID) AS cnt 
      FROM tblOperationHoursWorked 
      WHERE JobID = :lngJob 
      AND OperationID = :selectedItemTag
    `, {
      replacements: { lngJob, lngJobOperationID },
      type: QueryTypes.SELECT
    });

    // Step 3: Delete the operation if no time entries are found
    if (operationHoursCount[0].cnt === 0) {

      await sequelize.query(`
        DELETE FROM tblJobOperations 
        WHERE uniqueID = :lngJobOperationID
      `, {
        replacements: { lngJobOperationID },
        type: QueryTypes.DELETE
      });

      return {message:"Rogue Job Operation Deleted."};
    } else {
      throw new Error("A rogue job operation cannot be deleted while it has time entries. Move time entries and try deleting the operation again.");
    }

  } catch (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
};

export const deleteAllRogueOperations = async (lngJob) => {
  try {
    // Fetch all operations (simulating the lvwOpsProduct items)
    const operations = await sequelize.query(`
      SELECT tblJobOperations.uniqueID, tblJobOperations.PlanID
      FROM tblJobOperations
      WHERE JobID = :lngJob
    `, {
      replacements: { lngJob },
      type: QueryTypes.SELECT
    });

    for (const operation of operations) {
      let cancelit = false;

      // Step 1: Check if the operation is part of an active build plan
      const planCount = await sequelize.query(`
        SELECT COUNT(tblPlan.uniqueID) AS cnt 
        FROM tblPlan 
        WHERE uniqueID = :PlanID
      `, {
        replacements: { PlanID: operation.PlanID },
        type: QueryTypes.SELECT
      });

      for( let row of planCount) {
        if(row.cnt > 0){
          cancelit = true;
        }
      }

      // Step 2: Check if the operation has any time entries
      if (!cancelit) {
        const operationHoursCount = await sequelize.query(`
          SELECT COUNT(tblOperationHoursWorked.uniqueID) AS cnt 
          FROM tblOperationHoursWorked 
          WHERE JobID = :lngJob 
          AND OperationID = :operationID
        `, {
          replacements: { lngJob, operationID: operation.uniqueID },
          type: QueryTypes.SELECT
        });

        // Step 3: Delete the operation if no time entries exist
        if (operationHoursCount[0].cnt === 0) {
          await sequelize.query(`
            DELETE FROM tblJobOperations 
            WHERE uniqueID = :operationID
          `, {
            replacements: { operationID: operation.uniqueID },
            type: QueryTypes.DELETE
          });
        }
      }
    }

    return {message:"Rogue Job Operations Deleted."};
    // Call RefreshLVWOperations or similar if needed for further UI handling
  } catch (error) {
    console.error("Error deleting rogue job operations:", error.message);
    throw new Error(error.message);
  }
};

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