import { tblEmployee, tblJobOperations, tblOperationHoursWorked, tblSettings, tblPlan, tblSteps } from "~/server/models";
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

export const getAllOperation = async (jobId, instanceId, jobQty) => {
  
  const list = await sequelize.query(`
    Select distinct tblJobOperations.*, tblPlan.UniqueID as PID from tblJobOperations left join tblPlan on tblJobOperations.PlanID = tblPlan.uniqueID Where tblJobOperations.instanceid = :instanceid and jobID = :jobId order by number asc
  `, {
    replacements: { jobId: jobId, instanceid: instanceId },
    type: QueryTypes.SELECT
  });

  console.log(list)

  const modList = list.map(item =>{
    return {...item, Hours: (parseFloat(item.Hours) * parseFloat(jobQty)).toFixed(2)}
  } )

  return modList;
}

export const refreshJobOperations = async (lngJob, instanceid, recJOainstanceID) => {
  try {

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
    console.log(item.tblEmployee)
    return {
      UniqueID: item.UniqueID,
      JobID: item.JobID,
      OperationID: item.OperationID,
      StartTime: formatDate(new Date(item.StartTime)),
      Hours: item.Hours,
      employee:   `#${item.tblEmployee.payrollnumber} ${item.tblEmployee.fname} ${item.tblEmployee.lname}`
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

    console.log(operationId, listItems)

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
    if(!txtReworkHoursProduct){
      txtReworkHoursProduct = 0
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


// Manufacturing Sequence API

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


export const getMfgOperations = async (instanceID) => {

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

export const createMfgOperation = async (data) => {
  const instanceID = data.instanceId

  const { Number, Operation, WorkCenter, Hours, week, skills, username } = data;
  const strSkills = skills.map(skill => skill.UniqueID).join('=');

  if (!Operation || !WorkCenter || !Hours || !week) return { error: 'Please provide all the fields' };
  const today = new Date();
  const formattedDate = String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
  String(today.getDate()).padStart(2, '0') + '/' + 
  today.getFullYear();
  const createOperation = {
    instanceid: instanceID,
    Operation,
    WorkCenter,
    Hours,
    week,
    skills: strSkills,
    Number: parseInt(Number),
    PreparedBy: username,
    PreparedDate: formattedDate,
    ApprovedBy: '',
    ApprovedDate: '',
  }

  const newOperation = await tblPlan.create(createOperation);

  // Reorder operations (implement this function as needed)
  await reorderOperations(instanceID);
  return newOperation

}

export const editMfgOperation = async (data, id) => {

  const instanceID = data.instanceId

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
    PreparedDate: formatDateForSQLServer(today),
    ApprovedBy: '',
    ApprovedDate: '',

  }

  await tblPlan.update(editOperation, {
    where: { UniqueID: id}
  });
  await reorderOperations(instanceID);

  return id

}

export const deleteMfgOperation = async (id) => {
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


  return { reportData }
}

export const getPartList = async (instanceID) => {
  // Fetch main table details
  
  const qty = 1;

  // Query to get total quantity
  const table1 = await sequelize.query(`
    SELECT tblbp.instanceid, SUM(tblbpparts.qty) * :qty AS totalQuantity
    FROM tblbp
    INNER JOIN tblBPParts ON tblbp.uniqueid = tblbpparts.partid
    INNER JOIN tblsteps ON tblsteps.uniqueid = tblbpparts.stepid
    INNER JOIN tblplan ON tblplan.uniqueid = tblsteps.planid
    WHERE tblPlan.instanceid IN (:instanceID)
    GROUP BY tblbp.instanceID
  `, {
    replacements: { instanceID: instanceID, qty: qty },
    type: QueryTypes.SELECT
  });

  // Calculate labor hours for each item
  const results = await Promise.all(table1.map(async row => {
    // Fetch details for each item
    const table2 = await sequelize.query(`
      SELECT tblbp.model, tblbp.description, tblbp.inventoryunit, tblbp.ordercost, 
             tblbp.multiple, tblBP.inventorycost, tblBP.instanceID, code 
      FROM tblbp 
      WHERE uniqueid IN (
        SELECT MAX(uniqueid) FROM tblbp WHERE instanceid = :instanceid
      )
    `, {
      replacements: { instanceid: row['instanceid'] },
      type: QueryTypes.SELECT
    });

    // Calculate labor hours
    const calculateLaborHours = async (instanceID) => {
      let hours = 0;
      let results = await sequelize.query(`
        SELECT builtinhouse FROM tblBP WHERE instanceID = :instanceID
      `, {
        replacements: { instanceID: instanceID },
        type: QueryTypes.SELECT
      });

      const builtinhouse = results[0].builtinhouse;

      if (builtinhouse === 'False') {
        // Add top-level labor hours
        results = await sequelize.query(`
          SELECT hours FROM tblPlan WHERE instanceID = :instanceID
        `, {
          replacements: { instanceID: instanceID },
          type: QueryTypes.SELECT
        });

        hours += results.reduce((acc, row) => acc + parseFloat(row.hours), 0);

        // Recursively calculate sub-assembly labor hours
        results = await sequelize.query(`
          SELECT (SELECT TOP 1 tblBP.instanceID 
                  FROM tblBP 
                  WHERE tblbp.UniqueID = tblBPParts.partid 
                  ORDER BY tblBP.uniqueID DESC) AS instanceID, 
                 qty
          FROM tblBPParts
          INNER JOIN tblSteps ON tblSteps.uniqueID = tblBPParts.stepID
          INNER JOIN tblPlan ON tblPlan.uniqueID = tblSteps.PlanID
          WHERE (SELECT COUNT(tblPlan.uniqueID) 
                 FROM tblPlan 
                 WHERE tblPlan.instanceID = (SELECT TOP 1 tblBP.instanceID 
                                              FROM tblBP 
                                              WHERE tblbp.UniqueID = tblBPParts.partid 
                                              ORDER BY tblBP.uniqueID DESC)) > 0
          AND tblplan.instanceID = :instanceID
        `, {
          replacements: { instanceID: instanceID },
          type: QueryTypes.SELECT
        });

        for (const row of results) {
          hours += (await calculateLaborHours(row.instanceID)) * row.qty;
        }
      }
      return hours;
    };

    const laborHours = await calculateLaborHours(row['instanceid']);
    table2[0]['quantity'] = row['totalQuantity'];
    table2[0]['totalCost'] = parseFloat((row['totalQuantity'] * table2[0]['inventorycost']).toFixed(2));
    table2[0]['laborHours'] = parseFloat(laborHours.toFixed(2));
    return table2[0];
  }));

  return results;
}

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

//Step API

export const stepExistByID = async (id) => {
  const tableDetail = await tblSteps.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}


export const downStpe = async (stepId, planId) => {
  if (!stepId) {
    throw Error('No step id provided')
  }

  // Update the selected step by adding 1.5 to the step number
  await sequelize.query(`
    UPDATE tblSteps
    SET step = step + 1.5
    WHERE uniqueID = :stepID
  `, {
    replacements: { stepID: stepId },
    type: QueryTypes.UPDATE
  });

  // Fetch all steps related to the plan and order them by step number
  const steps = await sequelize.query(`
    SELECT * FROM tblSteps 
    WHERE PLANID = :planId 
    ORDER BY step
  `, {
    replacements: { planId },
    type: QueryTypes.SELECT
  });

  // Clear the step list
  let i = 0;

  // Reassign step numbers and update tblSteps
  for (const row of steps) {
    i++;
    
    await sequelize.query(`
      UPDATE tblSteps 
      SET step = :newStep 
      WHERE uniqueID = :stepID
    `, {
      replacements: { newStep: i, stepID: row.UniqueID },
      type: QueryTypes.UPDATE
    });
  }

}

export const upStpe = async (stepId, planId) => {
  if (!stepId) {
    throw Error('No step id provided')
  }

  // Update the selected step by adding 1.5 to the step number
  await sequelize.query(`
    UPDATE tblSteps
    SET step = step - 1.5
    WHERE uniqueID = :stepID
  `, {
    replacements: { stepID: stepId },
    type: QueryTypes.UPDATE
  });

  // Fetch all steps related to the plan and order them by step number
  const steps = await sequelize.query(`
    SELECT * FROM tblSteps 
    WHERE PLANID = :planId 
    ORDER BY step
  `, {
    replacements: { planId },
    type: QueryTypes.SELECT
  });

  // Clear the step list
  let i = 0;

  // Reassign step numbers and update tblSteps
  for (const row of steps) {
    i++;
    
    await sequelize.query(`
      UPDATE tblSteps 
      SET step = :newStep 
      WHERE uniqueID = :stepID
    `, {
      replacements: { newStep: i, stepID: row.UniqueID },
      type: QueryTypes.UPDATE
    });
  }
}




