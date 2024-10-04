import { tblEmployee, tblJobOperations, tblOperationHoursWorked, tblSettings } from "~/server/models";
import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';
import { verifyInventoryTransaction, clearInventoryTransactionDetails, addInventoryTransactionDetail } from "./Jobs";

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
      StartTime: formatDate(new Date(item.StartTime)),
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

export const reScheduledOp = async (lngJobOperationID, txtScheduled) => {
  try {
    // Query to fetch the existing job operation record
    const jobOperation = await sequelize.query(`
      SELECT * 
      FROM tblJobOperations 
      WHERE uniqueID = :lngJobOperationID
    `, {
      replacements: { lngJobOperationID },
      type: QueryTypes.SELECT
    });

    if (jobOperation.length === 0) {
      throw new Error(`Job operation with uniqueID ${lngJobOperationID} not found.`);
    }

    let dr = jobOperation[0]; // This is the first record in the result set

    // Update DateScheduled and WeekScheduled fields

    dr.DateScheduled = formatDate(new Date(txtScheduled));

    // Update the record in the database
    await sequelize.query(`
      UPDATE tblJobOperations 
      SET DateScheduled = :DateScheduled
      WHERE uniqueID = :lngJobOperationID
    `, {
      replacements: {
        DateScheduled: dr.DateScheduled,
        lngJobOperationID
      },
      type: QueryTypes.UPDATE
    });

  } catch (error) {
    console.error("Error updating scheduled date and week:", error.message);
    throw new Error(error.message);
  }
};

export const moveToOperation = async (operationId, listItems) => {
  try {

    if(!operationId) {
      return
    }

    for (const item of listItems) {
      if (item.checked) {

        // Execute the SQL Update query to update tblOperationHoursWorked
        await sequelize.query(`
          UPDATE tblOperationHoursWorked
          SET OperationID = :operationId
          WHERE UniqueID = :uniqueID
        `, {
          replacements: { operationId , uniqueID: item.UniqueID },
          type: QueryTypes.UPDATE
        });

      }
    }

  } catch (error) {
    console.error("Error updating operation hours:", error.message);
    throw new Error(error.message);
  }
};


export const verifyAndCloseOperation = async (lngJob, lngJobOperationID, txtReworkHoursProduct, glob_StrEmployee, recJoaPerType, recJOnQuantity) => {
  
  try {
    if(!reworkHrs){
      reworkHrs = 0
    }
    // Fetch the job record
    const jobDT = await sequelize.query(`
      SELECT * 
      FROM tblJobs 
      WHERE UniqueID = :lngJob
    `, {
      replacements: { lngJob },
      type: QueryTypes.SELECT
    });

    // Assume firstOpen logic is handled elsewhere, and calculate product costs

    await calculateProductCosts(jobDT, lngJobOperationID);

    // Fetch job operation record
    const jobOperationDT = await sequelize.query(`
      SELECT * 
      FROM tblJobOperations 
      WHERE UniqueID = :lngJobOperationID
    `, {
      replacements: { lngJobOperationID },
      type: QueryTypes.SELECT
    });

    if (jobOperationDT.length === 0) {
      throw new Error(`Job operation with uniqueID ${lngJobOperationID} not found.`);
    }

    let dr = jobOperationDT[0]; // The first record from the result
    const date = formatDate(new Date())
    // Update relevant fields in the job operation record
    dr.reworkhrs = Number(txtReworkHoursProduct);  // Assuming this comes as a number
    dr.verified = date; // Format as short date (YYYY-MM-DD)
    dr.verifiedby = glob_StrEmployee;

    // Update the record in the database
    await sequelize.query(`
      UPDATE tblJobOperations 
      SET reworkhrs = :reworkhrs, verified = :verified, verifiedby = :verifiedby 
      WHERE UniqueID = :lngJobOperationID
    `, {
      replacements: {
        reworkhrs: dr.reworkhrs,
        verified: dr.verified,
        verifiedby: dr.verifiedby,
        lngJobOperationID
      },
      type: QueryTypes.UPDATE
    });

    const today = formatDateForSQLServer(new Date())
    // Perform inventory transaction operations if recJoaPerType.Text is "Operation"
    
    if (recJoaPerType === "Operation") {
      const lngTransID = await verifyInventoryTransaction("", today, glob_StrEmployee, { jobID:lngJob, jobOperationID: lngJobOperationID});
      
      await clearInventoryTransactionDetails(lngTransID);

      await removeOperationFromInventory(Number(recJOnQuantity), lngTransID, lngJobOperationID);
    }

    console.log("Product verification and close operation completed successfully.");
  } catch (error) {
    console.error("Error during product verification:", error.message);
    throw new Error(error.message);
  }
};

export const reOpenOperation = async (lngJob, lngJobOperationID, jobCostText, glob_StrEmployee, quantityText) => {
  try {

    // Fetch job operation details
    const jobOperation = await sequelize.query(`
      SELECT * 
      FROM tblJobOperations 
      WHERE uniqueID = :lngJobOperationID
    `, {
      replacements: { lngJobOperationID },
      type: QueryTypes.SELECT
    });

    if (jobOperation.length === 0) {
      throw new Error("Job operation not found");
    }

    let quantity = parseInt(quantityText, 10);
    if (isNaN(quantity)) quantity = 0;

    // Calculate operation cost
    const operationCost = await calculateOperationCosts(lngJobOperationID, quantity, );

    // Calculate job cost from the input (jobCostText should be a currency string)
    let jobCost = parseFloat(jobCostText.replace(/[^0-9.-]+/g, ""));
    if (isNaN(jobCost)) jobCost = 0;

    // Update the latest unit cost
    const updatedCost = jobCost - operationCost;

    // Clear the verified status in the job operation record
    const jobOpRecord = jobOperation[0];
    await sequelize.query(`
      UPDATE tblJobOperations 
      SET verified = '', verifiedby = '' 
      WHERE uniqueID = :lngJobOperationID
    `, {
      replacements: { lngJobOperationID },
      type: QueryTypes.UPDATE
    });
    const today = formatDateForSQLServer(new Date())
    console.log("", today, glob_StrEmployee, { jobID:lngJob, jobOperationID: lngJobOperationID})
    // Process inventory transaction verification and clearing
    const lngTransID = await verifyInventoryTransaction("", today, glob_StrEmployee, { jobID:lngJob, jobOperationID: lngJobOperationID});
    await clearInventoryTransactionDetails(lngTransID);

    console.log(`Operation reopened successfully. Updated cost: ${updatedCost}`);

  } catch (error) {
    console.error("Error reopening operation:", error.message);
    throw new Error(error.message);
  }
};

export const removeOperationFromInventory = async (qty, lngTransID, lngJobOperationID) => {
  try {
    // Query to get the parts related to the job operation
    const jobParts = await sequelize.query(`
      SELECT * 
      FROM vwJobParts 
      WHERE JobOperationID = :lngJobOperationID
    `, {
      replacements: { lngJobOperationID },
      type: QueryTypes.SELECT
    });

    // Loop through each job part and adjust the inventory
    for (const part of jobParts) {
      const model = part.Model;
      const partQty = parseFloat(part.qty);  // Assuming 'qty' is numeric
      const adjustedQty = 0 - (qty * partQty); // Subtracting the total quantity

      // Add the inventory transaction detail (function assumed to exist)
      await addInventoryTransactionDetail(lngTransID, model, adjustedQty, 0, 2);
    }
    console.log("removing operation from inventory")
    return true;  // Return success or a relevant response as needed
  } catch (error) {
    console.error("Error removing operation from inventory:", error.message);
    throw new Error(error.message);
  }
};

export const calculateProductCosts = async (job, latestUnitCost, OperationID = 0) => {
  try {
    
    // Check if the operation is closed
    if (!job.DATECLOSED) {
      if (job.PerType === "Operation") {
        let operationCost;

        // Calculate operation costs
        if (OperationID === 0) {
          operationCost = calculateOperationCosts(job.QUANTITY, OperationID);
        } else {
          const jobCost = parseFloat(latestUnitCost) || 0;  // Assuming the latest cost is already available
          operationCost = calculateOperationCosts(job.QUANTITY, OperationID);
          operationCost += jobCost
        }

      } else {

        const qty = parseInt(job.QUANTITY) || 0;
        const unitCost = calculateUnitCosts(qty, OperationID);
      }

      // Perform any additional job-related actions like triggering the next process

      // Fetch job detail records and process them
      // const jobDetails = await sequelize.query(`
      //   SELECT * 
      //   FROM tblJobDetail 
      //   WHERE JobID = :lngJob 
      //   ORDER BY Serial
      // `, {
      //   replacements: { lngJob },
      //   type: QueryTypes.SELECT
      // });

      // jobDetails.forEach(row => {
      //   const serial = row.Serial;
      //   const dateEntered = row.dateEntered;
      //   const scheduledDate = row.ScheduledDate;
      //   const uniqueId = row.uniqueid;

      //   console.log(`Processing Serial: ${serial}, Date Entered: ${dateEntered}, Scheduled Date: ${scheduledDate}, Unique ID: ${uniqueId}`);
      // });
    }

  } catch (error) {
    console.error("Error in calculating product costs:", error.message);
    throw new Error(error.message);
  }
};

export const calculateOperationCosts = async (lngJob, qty, OperationID = 0) => {
  try {

    const settings = await tblSettings.findOne();
    const glob_laborrate = settings.dataValues.laborrate

    let cost = 0.00;
    let laborCost = 0.00;
    let dt;

    // Query based on OperationID
    if (OperationID === 0) {
      dt = await sequelize.query(`
        SELECT * 
        FROM tblJobOperations 
        WHERE JobID = :lngJob 
          AND verified IS NOT NULL 
          AND verified <> ''
      `, {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      });
    } else {
      dt = await sequelize.query(`
        SELECT * 
        FROM tblJobOperations 
        WHERE UniqueID = :OperationID 
          AND JobID = :lngJob
      `, {
        replacements: { lngJob, OperationID },
        type: QueryTypes.SELECT
      });
    }

    // If no rows are found, return 0.00 cost
    if (dt.length === 0) {
      return 0.00;
    }

    // Loop through each job operation row
    for (const row of dt) {
      if (qty === 0) return 0.00;

      // Query for job parts related to the current operation
      const dt2 = await sequelize.query(`
        SELECT * 
        FROM vwJobParts 
        WHERE JobOperationID = :jobOperationID
      `, {
        replacements: { jobOperationID: row.uniqueID },
        type: QueryTypes.SELECT
      });

      // Loop through each job part row
      for (const row2 of dt2) {
        // Fetch the latest inventory data for the part model
        const dt3 = await sequelize.query(`
          SELECT tblbp.model, tblbp.description, tblbp.inventoryunit, tblbp.ordercost, tblbp.multiple, tblBP.inventorycost, tblBP.instanceID
          FROM tblbp 
          WHERE uniqueid IN (
            SELECT MAX(uniqueid) 
            FROM tblbp 
            WHERE model = :model
          )
        `, {
          replacements: { model: row2.model },
          type: QueryTypes.SELECT
        });

        // Calculate inventory cost for each part
        if (dt3.length > 0) {
          const inventoryCost = parseFloat(dt3[0].inventorycost) || 0.00;
          cost += row2.qty * inventoryCost; // Assuming row2.qty is the quantity
        }
      }

      // Add labor costs to the total
      let laborHours =  row.Hours == "" ?  0 : parseFloat(row.Hours);
      laborCost += laborHours * glob_laborrate; // Assuming row.Hours contains the labor hours for the operation
    }

    // Add labor cost to the total cost
    cost = Math.round((cost + laborCost) * 1 * 100) / 100;
    return cost;

  } catch (error) {
    console.error("Error in calculating operation costs:", error.message);
    throw new Error(error.message);
  }
};

export const calculateUnitCosts = async (lngJob, qty, OperationID = 0) => {
  try {

    const settings = await tblSettings.findOne();
    const glob_laborrate = settings.dataValues.laborrate

    let cost = 0.00;
    let laborCost = 0.00;

    // Retrieve percentageComplete from tblJobs
    const dtPercentComplete = await sequelize.query(`
      SELECT percentageComplete 
      FROM tblJobs 
      WHERE uniqueID = :lngJob
    `, {
      replacements: { lngJob },
      type: QueryTypes.SELECT
    });

    // Adjust qty based on percentageComplete
    if (dtPercentComplete.length > 0) {
      qty = qty * dtPercentComplete[0].percentageComplete;
    }

    // Retrieve job operations based on OperationID
    let dt;
    if (OperationID === 0) {
      dt = await sequelize.query(`
        SELECT * 
        FROM tblJobOperations 
        WHERE JobID = :lngJob
      `, {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      });
    } else {
      dt = await sequelize.query(`
        SELECT * 
        FROM tblJobOperations 
        WHERE uniqueID = :OperationID 
          AND JobID = :lngJob 
          AND verified IS NOT NULL 
          AND verified <> ''
      `, {
        replacements: { lngJob, OperationID },
        type: QueryTypes.SELECT
      });
    }

    // If no operations found, return 0.00 cost
    if (dt.length === 0) {
      return 0.00;
    }

    // Loop through job operations
    for (const row of dt) {
      if (qty === 0) return 0.00;

      // Retrieve parts for the current operation
      const dt2 = await sequelize.query(`
        SELECT * 
        FROM vwJobParts 
        WHERE JobOperationID = :jobOperationID
      `, {
        replacements: { jobOperationID: row.uniqueID },
        type: QueryTypes.SELECT
      });

      // Loop through job parts and calculate cost
      for (const row2 of dt2) {
        const dt3 = await sequelize.query(`
          SELECT tblbp.model, tblbp.description, tblbp.inventoryunit, tblbp.ordercost, tblbp.multiple, tblBP.inventorycost, tblBP.instanceID 
          FROM tblbp 
          WHERE uniqueid IN (
            SELECT MAX(uniqueid) 
            FROM tblbp 
            WHERE model = :model
          )
        `, {
          replacements: { model: row2.model },
          type: QueryTypes.SELECT
        });

        if (dt3.length > 0) {
          const inventoryCost = parseFloat(dt3[0].inventorycost) || 0.00;
          cost += (row2.qty * inventoryCost); // Assuming row2.qty is the part quantity
        }
      }

      // Calculate labor cost
      let laborHours =  row.Hours == "" ?  0 : parseFloat(row.Hours);
      laborCost += laborHours * glob_laborrate; // Assuming row.Hours contains the labor hours for the operation
    }

    // Final cost calculation
    cost = Math.round((cost + laborCost) * 1 * 100) / 100; // No adjustment to qty as per your VB.NET comment
    return cost;

  } catch (error) {
    console.error("Error in calculating unit costs:", error.message);
    throw new Error(error.message);
  }
};

export const reworkCostCalculate = async (lngJob, lngJobOperationID, reworkHrs) => {
  try {
    
    // Fetch data from the database
    const settings = await tblSettings.findOne();
    const glob_laborrate = settings.dataValues.laborrate
    if(!reworkHrs){
      reworkHrs = 0
    }

    const dtRS = await sequelize.query(
        `SELECT qty, tblBP.InventoryCost 
         FROM tblOperationReworks 
         INNER JOIN tblBP ON tblBP.uniqueID = tblBPID 
         WHERE jobID = :jobID 
         AND operationid = :operationid`,
        {
            replacements: { jobID: lngJob, operationid: lngJobOperationID },
            type: QueryTypes.SELECT
        }
    );

    // Calculate parts
    let parts = 0;
    dtRS.forEach(row => {
        parts += parseFloat(row.qty) * parseFloat(row.InventoryCost);
    });
    console.log(parts)
    // Calculate and format rework costs
    console.log(reworkHrs)
    const reworkCost = (parseFloat(reworkHrs) * glob_laborrate + parts).toFixed(2);
    console.log(reworkCost)
    // Assuming you need to update these labels in the frontend, here we're just returning the values
    return reworkCost

} catch (error) {
    console.error('Error fetching rework data:', error);
    throw new Error('Error fetching rework cost:',error)
}
}