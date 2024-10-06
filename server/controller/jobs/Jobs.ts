import { tblJobDetail, tblJobs, tblSettings } from "~/server/models";
import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';
import { calculateUnitCosts } from "./Operation";
// import fs from 'fs';
// import path from 'path'; 

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
  const filterParams = ['UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PerType', 'DATEOPENED', 'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 'Cost', 'jobcat', 'jobsubcat', 'ProductionDate', 'JobID'];
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

const applyCusFilters = (params) => {
  const filterParams = ['JobID'];
  const whereClause = {};

  filterParams.forEach(param => {
    if (params[param]) {
      whereClause[param] = {
        [Op.in]: Array.isArray(params[param]) ? params[param] : [params[param]]
      };
    }
  });

  return whereClause;
};


export const getAllJobs = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = ((parseInt(page as string, 10) - 1) || 0) * limit;

  const whereClause = applyFilters(filterParams);

  const list = await tblJobs.findAll({
    attributes: ['UniqueID', 'NUMBER', 'QUANTITY', 'MODEL', 'PART', 'PerType', 'DATEOPENED', 'DATECLOSED', 'PercentageComplete', 'Catagory', 'SubCatagory', 'Cost', 'jobcat', 'jobsubcat', 'ProductionDate'],
    where: whereClause,
    order: [[sortBy as string || 'NUMBER', sortOrder as string || 'ASC']],
    offset,
    limit
  });

  const formattedList = list.map((item: any) => {
    return {
      description: `${item.MODEL ? `#${item.MODEL}` : `#${item.PART}`}`,
      UniqueID: item.UniqueID,
      NUMBER: item.NUMBER,
      QUANTITY: item.QUANTITY,
      MODEL: item.MODEL,
      PART: item.PART,
      PerType: item.PerType,
      DATEOPENED: item.DATEOPENED,
      DATECLOSED: item.DATECLOSED,
      PercentageComplete: item.PercentageComplete,
      Cost: item.Cost,
      Catagory: item.Catagory,
      SubCatagory: item.SubCatagory,
      ProductionDate: item.ProductionDate,

    }
  })
  return formattedList;
}


export const getNumberOfJobs = async (filterParams) => {

    const whereClause = applyFilters(filterParams);
    const numberOfCustomers = await tblJobs.count({
      where: whereClause
    });
    return numberOfCustomers;
}

export const JobExistByID = async (id: number | string) => {
  const tableDetail = await tblJobs.findByPk(id);
  if (tableDetail)
    return true;
  else
    return false;
}

export const getJobDetail = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  return tableDetail
}

export const getAllJobDetail = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyCusFilters(filterParams);

  const list = await tblJobDetail.findAll({
    attributes: ['UniqueID', 'JobID', 'PartsList', 'Serial', 'Quantity', 'ShipDate', 'SingleMaterialCost', 'dateEntered', 'ScheduledDate', 'SingleLaborCost', 'CostPerUnit'],
    where: whereClause,
    order: [[sortBy as string || 'UniqueID', sortOrder as string || 'ASC']],
  });

  return list;
}

export const updateJob = async (id, reqData) => {
  const model = reqData.MODEL.trim().split(" ")[0];
  const query = `SELECT instanceID FROM tblBP WHERE model = :model LIMIT 1`;
  const [result] = await sequelize.query(query, {
      replacements: { MODEL: model },
      type: QueryTypes.SELECT
  });
  const instanceid = parseInt(result.instanceID);
  await tblJobs.update({...reqData, ProjectType:reqData.Catagory, instanceID:instanceid}, {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteJob = async (id) => {
  await tblJobs.destroy({ where: { UniqueID: id } });
  return id;
}

export const createNewJob = async (data) => {
  const createReqData = {
    ...data,
  };
  const newCustomer = await tblJobs.create(createReqData);
  return newCustomer
}

export const getBegSerial = async (recJOaModelText) => {
  try {
    console.log(recJOaModelText)
    // Guard clause if recJOaModelText is empty
    if (!recJOaModelText || recJOaModelText.length < 1) return;

    let recJOainstanceID = 0;
    let recJOaBegSerial = '';

    // Split model and take the first part (before space)
    const model = recJOaModelText.split(" ")[0];

    // Fetch instanceID from tblBP where model matches
    const rs12 = await sequelize.query(
      `SELECT instanceID FROM tblBP WHERE model = :model`,
      {
        replacements: { model },
        type: QueryTypes.SELECT
      }
    );

    // Update recJOainstanceID based on query result
    if (rs12.length > 0) {
      recJOainstanceID = rs12[0].instanceID;
    } else {
      recJOainstanceID = 0;
    }

    // Extract the model name up to the first space
    let x = recJOaModelText.indexOf(" ");
    let strmodel = recJOaModelText.substring(0, x > 0 ? x : recJOaModelText.length);

    // Fetch the next serial number based on the model
    const dt = await sequelize.query(
      `SELECT MAX(CAST(serial AS BIGINT)) + 1 AS nextSerial 
       FROM vwSerialData 
       WHERE Model = :strmodel`,
      {
        replacements: { strmodel },
        type: QueryTypes.SELECT
      }
    );

    // Update recJOaBegSerial with the next serial number
    recJOaBegSerial = dt[0]?.nextSerial;

    // Handle leading "0" case in recJOaModelText
    

    console.log({
      recJOainstanceID,
      recJOaBegSerial
    })
    // Return the updated values for instanceID and BegSerial
    return {
      recJOainstanceID,
      recJOaBegSerial
    };
    
  } catch (error) {
    console.error("Error handling model selection change:", error.message);
    throw new Error("Error handling model selection change", error.message);
  }
};

export const updateJobSerial = async (jobId, jobQuantity, begSerial) => {

  if (!jobId) {
    throw new Error('No Job ID provided');
  }
  
  begSerial = parseInt(begSerial ? begSerial : 0)

  await sequelize.query(`
    DELETE FROM tblJobDetail WHERE JobID = :jobId
  `, {
    replacements: { jobId },
    type: QueryTypes.DELETE
  });

  for (let i = 0; i < parseInt(jobQuantity); i++) {
    const serialNumber = begSerial + i;
    const [dateResult] = await sequelize.query(`
      SELECT MAX(today) AS dateEntered FROM tblInventory WHERE serial = :serialNumber
    `, {
      replacements: { serialNumber },
      type: QueryTypes.SELECT
    });
    const dateEntered = dateResult.dateEntered ? formatDate(dateResult.dateEntered) : null;
    // Insert new record into tblJobDetail

    await sequelize.query(`
      INSERT INTO tblJobDetail (JobID, dateEntered, serial)
      VALUES (:jobId, :dateEntered, :serialNumber)
    `, {
      replacements: { jobId, dateEntered, serialNumber },
      type: QueryTypes.INSERT
    });
  }

  const serialList = await sequelize.query(`
    SELECT * FROM tblJobDetail WHERE JobID = jobId
  `, {
    replacements: { jobId },
    type: QueryTypes.INSERT
  });

  return serialList;
};

export const fixSerialIssue = async (serialItems, instanceId, employee, perType, jobPart, jobId, date, ignoreDuplicateCheck = true) => {

  // Filter out checked items
  serialItems = JSON.parse(serialItems)
  const checkedItems = serialItems.filter(item => item.checked);
  // Process each checked item
  for (const item of checkedItems) {
    if (item.dateEntered === "" || ignoreDuplicateCheck) {
      // Update the `dateEntered` field with the selected date
      item.dateEntered = formatDate(new Date(date)) ; 

      // Update serial records (Assuming `addToSerialRecords` is a function handling serial updates)
      await addToSerialRecords(item.Serial, item.UniqueID, instanceId, employee, item.JobID, perType, jobPart, date);

      // Fetch and update `tblJobDetail` for the specific serial (by `uniqueID`)
      const jobDetail = await sequelize.query(`
        SELECT * FROM tblJobDetail WHERE uniqueID = :uniqueID
      `, {
        replacements: { uniqueID: item.UniqueID },
        type: QueryTypes.SELECT
      });

      if (jobDetail.length > 0) {
        const record = jobDetail[0];
        // Update the `dateEntered` field with the selected date
        record.dateEntered = item.dateEntered;

        // Update the record in the database
        await sequelize.query(`
          UPDATE tblJobDetail 
          SET dateEntered = :dateEntered
          WHERE uniqueID = :uniqueID
        `, {
          replacements: { dateEntered: record.dateEntered, uniqueID: item.UniqueID },
          type: QueryTypes.UPDATE
        });
      }
    }
  }

  // Call update percentage function
  await updatePercentage(jobId);

  return {serialItems, message: "Serials have been added and the inventory has been updated."}
};

export const pullIntoSerial = async (serialItems, instanceId, employee, perType, jobPart, jobId, model, date, ignoreDuplicateCheck = false) => {
  // Filter out empty items
  serialItems = JSON.parse(serialItems)
  serialItems = serialItems.filter(item => item.Serial.trim() !== "" || item.dateEntered.trim() !== "");

  // Check for duplicate serials
  for (const item of serialItems) {
    if (item.checked && (item.dateEntered !== null)) {
      if (!ignoreDuplicateCheck) {
        throw new Error("You cannot put a serial into inventory twice. Please doublecheck your checked items and try again.");
      }
    }
  }

  // Process checked items
  for (const item of serialItems) {
    if (item.checked && (item.dateEntered === "" || ignoreDuplicateCheck || item.dateEntered === null)) {
      item.dateEntered = formatDate(new Date(date)) 
      // Update serial records (Assuming AddtoSerialRecords is a function handling serial updates)
      await addToSerialRecords(item.Serial, item.UniqueID, instanceId, employee, item.JobID, perType, jobPart, date);
      // Fetch and update tblJobDetail
      const jobDetail = await sequelize.query(`
        SELECT * FROM tblJobDetail WHERE uniqueID = :uniqueID
      `, {
        replacements: { uniqueID: item.UniqueID },
        type: QueryTypes.SELECT
      });

      if (jobDetail.length > 0) {
        const record = jobDetail[0];
        record.dateEntered = item.dateEntered;
        const latestUnitCost = await calculateLatestUnitCost(jobId);
        record.CostPerUnit = latestUnitCost || 0; // Parse and handle cost

        // Update the record in the database
        await sequelize.query(`
          UPDATE tblJobDetail 
          SET dateEntered = :dateEntered, CostPerUnit = :costPerUnit
          WHERE uniqueID = :uniqueID
        `, {
          replacements: { dateEntered: record.dateEntered, costPerUnit: record.CostPerUnit, uniqueID: item.UniqueID },
          type: QueryTypes.UPDATE
        });
      }
    }
  }

  // Update percentage and reload serial items (assuming these are other functions)
  await updatePercentage(jobId);
  await loadSerialItems(jobId);

  // Create directories if system company is PDX
  // const glob_System_CompanyEnum = 'PDX'; // This should be set based on your system logic
  // if (glob_System_CompanyEnum === 'PDX') {
  //   const directoryPath = path.join("E:/GMS Web/grimm-management-system-web/server/DHR/", employee, "Serials", `[${serialItems[0].Serial}] [${model}]`);
  //   if (!fs.existsSync(directoryPath)) {
  //     fs.mkdirSync(directoryPath, { recursive: true });
  //   }
  // }

  // Final save and confirmation message (assumed to be logging)
  await saveJob(jobId); // Assuming Save() is a function that commits changes
  return {serialItems, message: "Serials have been added and the inventory has been updated."}
};

export const pullIntoInventory = async (
  lvwSubAssembly,
  instanceId,
  glob_StrEmployee,
  recJoaPerType,
  quantityInput,
  recJOnQuantity, 
  LatestUnitCost,
  lngJob,
  recJOaPart,
  dateInput,
  
) => {
  try {
      if (recJoaPerType === "Serial/Unit") {

        const qty = parseFloat(quantityInput);
        const jobQty = parseFloat(recJOnQuantity);

        if (qty === 0 || qty === null) {
            throw new Error("Invalid Zero Quantity.");
        }

        lvwSubAssembly = lvwSubAssembly.filter(item => {
          return (item.Quantity !== null && item.Quantity !== "") || item.dateEntered !== null ;
        });

        // Ensure entered quantity doesn't exceed the job quantity
        let subAssemblyTotal = 0;
        for (const li of lvwSubAssembly) { 
          subAssemblyTotal += parseFloat(li.Quantity);
        }
        if (subAssemblyTotal + qty > jobQty) {
            throw new Error("Entered Quantity exceeds Job Quantity. Please correct the quantity to add to inventory and try again.");
        }
        // Insert new job detail record
        
        const newRecord = {
            Jobid: lngJob,
            Quantity: qty,
            dateEntered: formatDate(dateInput),
            CostPerUnit: parseFloat(LatestUnitCost)
        };

        // Add new job detail record to the database
        await sequelize.query(
            `INSERT INTO tblJobDetail (Jobid, Quantity, dateEntered, CostPerUnit) VALUES (:Jobid, :Quantity, :dateEntered, :CostPerUnit)`,
            {
                replacements: newRecord,
                type: QueryTypes.INSERT
            }
        );
        const today = formatDateForSQLServer(new Date())
        // Fetch the max uniqueID from tblJobDetail
        const [{ maxUniqueID }] = await sequelize.query(`SELECT MAX(UniqueID) AS maxUniqueID FROM tblJobDetail`, { type: QueryTypes.SELECT });
        console.log( maxUniqueID )
        // Verify inventory transaction
        const lngTransID = await verifyInventoryTransaction("", today, glob_StrEmployee, {jobID:lngJob, jobDetailID:parseFloat(maxUniqueID)} );

        // Add to inventory
        await AddToInventory(qty, lngTransID);
        await clearInventoryTransactionDetails(lngTransID);

        // Remove from inventory plan
        await removePlanFromInventory(qty, lngTransID, lngJob);

        // Add inventory transaction detail
        recJOaPart = recJOaPart == "" ? "" : recJOaPart.trim().split(" ")[0]
        await addInventoryTransactionDetail(lngTransID, recJOaPart, qty);

        // Add item to inventory transaction
        await addItemToInventoryTransaction(qty, lngTransID, instanceId);

        // Remove from inventory using custom function
        await removeFromInventory2(parseInt(maxUniqueID), instanceId, qty);

        // Update percentage completion
        await await updatePercentage(lngJob);

        // Update unit cost calculation
        let jobCost = parseFloat(LatestUnitCost.replace(/[^0-9.-]+/g, ""));
        const unitsToAdd = parseFloat(quantityInput);
        const newUnitCost = await calculateUnitCosts(unitsToAdd, lngJob);
        LatestUnitCost = (jobCost + newUnitCost)

        return { LatestUnitCost, message:"Sub Assemblies have been added. Job has been saved."};

      } else {
          throw new Error("Job is set to be completed via Operations. If you wish to complete by unit, please reopen operations and switch the type.");
      }

  } catch (error) {
      console.error("Error in handleAddSubAssembly:", error.message);
      throw new Error(error.message);
  }
};

export const correctInventory = async (jobId, glob_StrEmployee, jobDetailId)=> {
  const today = formatDateForSQLServer(new Date())
  console.log("", today, glob_StrEmployee, {jobID:jobId, jobDetailID: jobDetailId} )
  verifyInventoryTransaction("", today, glob_StrEmployee, {jobID:jobId, jobDetailID: jobDetailId} );
}

const addToSerialRecords = async (serialNo, jobDetailId, instanceId, employee, jobId, recJoaPerType, recJOaPart, date) => {
  try {
    // Step 1: Set quantity
    const quantity = 1;

    // Step 2: Check if the serial number already exists in tblInventory
    const serialCheck = await sequelize.query(`
      SELECT * FROM tblInventory WHERE Serial = :serialNo
    `, {
      replacements: { serialNo },
      type: QueryTypes.SELECT
    });

    if (serialCheck.length > 0) {
      throw new Error('There is already an inventory item with that Serial.');
    }

    // Step 3: Fetch BPID from tblBP based on instanceID
    const bpResult = await sequelize.query(`
      SELECT UniqueID FROM tblBP WHERE instanceID = :instanceId ORDER BY UniqueID DESC
    `, {
      replacements: { instanceId },
      type: QueryTypes.SELECT
    });

    const bpId = bpResult[0]?.UniqueID || null;
    if (!bpId) throw new Error('BP ID not found');

    // Step 4: Insert the record into tblInventory
    const dateInput = formatDateForSQLServer(new Date(date))
    // Fetch the max instanceID from tblInventory and increment it
    const instanceResult = await sequelize.query(`
      SELECT MAX(instanceID) + 1 AS nextInstanceId FROM tblInventory
    `, {
      type: QueryTypes.SELECT
    });

    const newInstanceID = instanceResult[0]?.nextInstanceId || 1;

    await sequelize.query(`
      INSERT INTO tblInventory (Status, OrderID, instanceID, Serial, BPID, Today)
      VALUES ('Inventory', 0, :newInstanceID, :serialNo, :bpId, :today)
    `, {
      replacements: {
        newInstanceID,
        serialNo,
        bpId,
        today: dateInput
      },
      type: QueryTypes.INSERT
    });
    const today = formatDateForSQLServer(new Date(date))
    // Step 5: Handle inventory transactions
    const transId = await verifyInventoryTransaction("", today, employee, {jobID:jobId, jobDetailID:jobDetailId});
    await clearInventoryTransactionDetails(transId);

    // Step 6: Remove plan from inventory if type is "Serial/Unit"
    if (recJoaPerType === 'Serial/Unit') {
      await removePlanFromInventory(1, transId, jobId);
    }

    // Step 7: Add inventory transaction detail
    recJOaPart = recJOaPart == "" ? "" : recJOaPart.trim().split(" ")[0]
    await addInventoryTransactionDetail(transId, recJOaPart, 1);

    // Step 8: Save the data (assuming this is a function in your code)
    await saveJob(jobId);

  } catch (error) {
    console.error('Error adding serial record:', error.message);
    throw new Error('Error adding serial record: '+error.message)
  }
}

export const AddToInventory = async (qty, recJOainstanceID) => {
  try {
      // Update the `onhand` quantity in the `tblBP` table
      await sequelize.query(
          `UPDATE tblBP 
           SET onhand = onhand + :qty
           WHERE uniqueid IN (
              SELECT MAX(uniqueid) 
              FROM tblBP 
              WHERE instanceID = :recJOainstanceID 
              GROUP BY instanceID
           )`,
          {
              replacements: { qty, recJOainstanceID },
              type: QueryTypes.UPDATE
          }
      );

  } catch (error) {
      console.error("Error in AddToInventory:", error.message);
      throw new Error(error.message);
  }
};

export const verifyInventoryTransaction = async (manual = '', date, createdBy, options = {}) => {
  try {
    // Destructure optional parameters with default values
    const {
      transactionalID = 0,
      jobID = 0,
      jobOperationID = 0,
      serviceReportID = 0,
      vendorInvoiceID = 0,
      orderID = 0,
      jobDetailID = 0,
      poNumber = 0
    } = options;

    let transID = 0;
    let whereClause = '';

    // Build dynamic WHERE clause based on optional parameters
    if (transactionalID > 0) whereClause += ` AND tblInventoryTransactions.uniqueid = ${transactionalID} `;
    if (jobID > 0) whereClause += ` AND tblInventoryTransactions.JobID = ${jobID} `;
    if (jobOperationID > 0) whereClause += ` AND tblInventoryTransactions.OperationID = ${jobOperationID} `;
    if (serviceReportID > 0) whereClause += ` AND tblInventoryTransactions.ServiceReportID = ${serviceReportID} `;
    if (vendorInvoiceID > 0) whereClause += ` AND tblInventoryTransactions.VendorInvoiceID = ${vendorInvoiceID} `;
    if (orderID > 0) whereClause += ` AND tblInventoryTransactions.InvoiceID = ${orderID} `;
    if (jobDetailID > 0) whereClause += ` AND tblInventoryTransactions.JobDetailID = ${jobDetailID} `;

    // Query to check if a transaction exists with the given conditions
    const existingTransaction = await sequelize.query(`
      SELECT * FROM tblInventoryTransactions WHERE 1=1 ${whereClause}
    `, {
      type: QueryTypes.SELECT
    });
    console.log("tranx",existingTransaction)
    if (existingTransaction.length > 0) {
      transID = existingTransaction[0].uniqueID;
    }

    let strType = 'Transaction';
    if (transactionalID > 0) strType = 'Transaction';
    if (jobID > 0) strType = 'Job';
    if (jobOperationID > 0) strType = 'Job Operation';
    if (serviceReportID > 0) strType = 'Service Report';
    if (vendorInvoiceID > 0) strType = 'Vendor Invoice';
    if (orderID > 0) strType = 'Sales Invoice';
    
    // If transaction does not exist, insert a new record
    if (transID === 0) {

      await sequelize.query(`
        INSERT INTO tblInventoryTransactions (Justification, Dated, [By], ServiceReportID, JobID, OperationID, VendorInvoiceID, InvoiceID, JobDetailID, Manual, PONumber)
        VALUES ('System Generated - ${strType}', :date, :createdBy, :serviceReportID, :jobID, :jobOperationID, :vendorInvoiceID, :orderID, :jobDetailID, :manual, :poNumber)
      `, {
        replacements: {
          date,
          createdBy,
          serviceReportID,
          jobID,
          jobOperationID,
          vendorInvoiceID,
          orderID,
          jobDetailID,
          manual,
          poNumber
        },
        type: QueryTypes.INSERT
      });

      // After insertion, retrieve the newly created transaction ID
      const newTransaction = await sequelize.query(`
        SELECT * FROM tblInventoryTransactions WHERE 1=1 ${whereClause}
      `, {
        type: QueryTypes.SELECT
      });

      if (newTransaction.length > 0) {
        transID = newTransaction[0].uniqueID;
      }
    } else {

      // Update the existing transaction
      await sequelize.query(`
        UPDATE tblInventoryTransactions
        SET Justification = 'System Generated - ${strType}', Dated = :date, [By] = :createdBy, 
            ServiceReportID = :serviceReportID, JobID = :jobID, OperationID = :jobOperationID, 
            VendorInvoiceID = :vendorInvoiceID, InvoiceID = :orderID, JobDetailID = :jobDetailID, 
            Manual = :manual, PONumber = :poNumber
        WHERE uniqueid = :transID
      `, {
        replacements: {
          transID,
          date,
          createdBy,
          serviceReportID,
          jobID,
          jobOperationID,
          vendorInvoiceID,
          orderID,
          jobDetailID,
          manual,
          poNumber
        },
        type: QueryTypes.UPDATE
      });
    }
    console.log(" verifying inventory transaction")
    return transID;
  } catch (error) {
    console.log("Error verifying inventory transaction:",error)
    throw new Error('Error verifying inventory transaction:', error.message);
  }
}

export const clearInventoryTransactionDetails = async (transactionalID) => {
  try {
    // Fetch all transaction details for the given InventoryTransactionID
    const transactionDetails = await sequelize.query(`
      SELECT * FROM tblInventoryTransactionDetails WHERE InventoryTransactionID = :transactionalID
    `, {
      replacements: { transactionalID },
      type: QueryTypes.SELECT
    });

    // Iterate over the transaction details and delete each entry
    for (const detail of transactionDetails) {
      const instanceID = parseInt(detail.instanceID, 10);

      // Delete the transaction detail entry
      await sequelize.query(`
        DELETE FROM tblInventoryTransactionDetails WHERE InventoryTransactionID = :transactionalID AND InstanceID = :instanceID
      `, {
        replacements: { transactionalID, instanceID },
        type: QueryTypes.DELETE
      });

      // Update the on-hand quantity for the item
      await updateOnhandByInstanceId(instanceID);
    }

    console.log("clearing inventory transaction details")
    return 1;
  } catch (error) {
    console.log("Error clearing inventory transaction details:",error)
    throw new Error('Error clearing inventory transaction details:', error.message);
  }
}

const updateOnhandByInstanceId = async (instanceID) => {
  try {
    let uid = 0;
    let onhand = 0;
    const ddateDefault = '1990-01-01'; // Default date if no manual transactions found
    let ddate = ddateDefault;

    // Fetch the model from tblBP where instanceID matches
    const modelResult = await sequelize.query(`
      SELECT model FROM tblBP WHERE instanceID = :instanceID
    `, {
      replacements: { instanceID },
      type: QueryTypes.SELECT
    });

    // If no model is found, exit
    if (modelResult.length === 0) {
      throw new Error('No model found for the given instanceID')
      return;
    }

    const strModel = modelResult[0].MODEL;

    // Get the latest manual transaction details
    const manualTransactionResult = await sequelize.query(`
      SELECT OnHand, tblInventoryTransactions.uniqueid as UID, Dated
      FROM tblInventoryTransactionDetails
      INNER JOIN tblInventoryTransactions
      ON tblInventoryTransactions.uniqueid = tblInventoryTransactionDetails.InventoryTransactionID
      WHERE instanceID = :instanceID AND Manual = 'Yes'
      ORDER BY dated DESC LIMIT 1
    `, {
      replacements: { instanceID },
      type: QueryTypes.SELECT
    });

    // If a manual transaction is found, update the onhand and the date
    if (manualTransactionResult.length > 0) {
      onhand = parseFloat(manualTransactionResult[0].OnHand) || 0;
      uid = parseInt(manualTransactionResult[0].UID, 10) || 0;
      ddate = manualTransactionResult[0].Dated ? formatDateForSQLServer(new Date(manualTransactionResult[0].Dated)) : ddateDefault;// This will be in UTC format
    }

    // Fetch newer transactions after the manual transaction date and update the onhand quantity
    const transactionsResult = await sequelize.query(`
      SELECT QtyChange
      FROM tblInventoryTransactionDetails
      INNER JOIN tblInventoryTransactions
      ON tblInventoryTransactions.uniqueid = tblInventoryTransactionDetails.InventoryTransactionID
      WHERE instanceID = :instanceID AND tblInventoryTransactions.Dated > :ddate
      ORDER BY dated ASC
    `, {
      replacements: { instanceID, ddate },
      type: QueryTypes.SELECT
    });

    // Iterate through the results and accumulate the onhand quantity
    for (const transaction of transactionsResult) {
      onhand += parseFloat(transaction.QtyChange) || 0;
    }

    // Update the onhand quantity for the model in tblBP
    await sequelize.query(`
      UPDATE tblBP SET OnHand = :onhand WHERE model = :model
    `, {
      replacements: { onhand, model: strModel },
      type: QueryTypes.UPDATE
    });

  } catch (error) {
    console.log("Error updating on-hand inventory:",error)
    throw new Error('Error updating on-hand inventory:', error.message);
  }
}

const updateOnhandByModel = async (strModel) => {
  try {
    // Initialize variables
    let uid = 0;
    let ddate = '1990-01-01'; // Equivalent to "1/1/1990" in VB.NET
    let onhand = 0;

    // Query to get instanceID from tblBP based on model
    const rs = await sequelize.query(`
      SELECT instanceID 
      FROM tblBP 
      WHERE MODEL = :strModel
    `, {
      replacements: { strModel },
      type: QueryTypes.SELECT
    });

    // Exit if no records found
    if (rs.length === 0) {
      return;
    }

    const instID = rs[0].instanceID;

    // Query to get the most recent manual onhand inventory transaction
    const rs2 = await sequelize.query(`
      SELECT TOP 1 OnHand, tblInventoryTransactions.uniqueid AS UID, Dated 
      FROM tblInventoryTransactionDetails 
      INNER JOIN tblInventoryTransactions 
      ON tblInventoryTransactions.uniqueid = tblInventoryTransactionDetails.InventoryTransactionID 
      WHERE instanceID = :instID 
      AND Manual = 'Yes' 
      ORDER BY dated DESC
    `, {
      replacements: { instID },
      type: QueryTypes.SELECT
    });

    // If we have a record, update onhand, UID, and ddate
    if (rs2.length > 0) {
      onhand = parseFloat(rs2[0].OnHand);
      uid = rs2[0].UID;
      ddate = rs2[0].Dated ? formatDateForSQLServer(new Date(rs2[0].Dated)) : ddate; // This will be in UTC format
    }

    // Query to get the quantity changes after the most recent manual transaction date
    const rs3 = await sequelize.query(`
      SELECT QtyChange 
      FROM tblInventoryTransactionDetails 
      INNER JOIN tblInventoryTransactions 
      ON tblInventoryTransactions.uniqueid = tblInventoryTransactionDetails.InventoryTransactionID 
      WHERE instanceID = :instID 
      AND tblInventoryTransactions.Dated > :ddate 
      ORDER BY dated ASC
    `, {
      replacements: { instID, ddate },
      type: QueryTypes.SELECT
    });

    // Loop through the records and update the onhand quantity
    for (const row of rs3) {
      onhand += parseFloat(row.QtyChange);
    }

    // Update the onhand quantity in tblBP for the given model
    await sequelize.query(`
      UPDATE tblBP 
      SET OnHand = :onhand 
      WHERE model = :strModel
    `, {
      replacements: { onhand, strModel },
      type: QueryTypes.UPDATE
    });

  } catch (error) {
    console.log("Error in updateOnhand:",error)
    throw new Error('Error in updateOnhand:', error.message);
  }
}

const removeFromInventory2 = async (jobDetailID, instanceID, recJOnQuantity) => {
  try {
      let dblcost = 0;
      let dblLaborcost = 0;
      let strParts = "";

      // Query for parts information based on instanceID
      const dt = await sequelize.query(
          `SELECT tblbp.uniqueid, tblbpparts.qty, tblbp.model, tblbp.description 
           FROM tblbp 
           INNER JOIN tblBPParts ON tblbp.uniqueid = tblbpparts.partid 
           INNER JOIN tblsteps ON tblsteps.uniqueid = tblbpparts.stepid 
           INNER JOIN tblplan ON tblplan.uniqueid = tblsteps.planid 
           WHERE tblPlan.instanceid = :instanceID`,
          {
              replacements: { instanceID },
              type: QueryTypes.SELECT
          }
      );

      // Iterate through parts and calculate costs
      for (const row of dt) {
          const partID = row.uniqueid;

          // Fetch instanceID based on uniqueid
          const dt2 = await sequelize.query(
              `SELECT instanceid 
               FROM tblbp 
               WHERE uniqueid = :partID`,
              {
                  replacements: { partID },
                  type: QueryTypes.SELECT
              }
          );

          if (dt2.length > 0) {
              const instanceID2 = dt2[0].instanceid;

              // Fetch max uniqueid and inventorycost for the part
              const dt3 = await sequelize.query(
                  `SELECT uniqueid, inventorycost 
                   FROM tblbp 
                   WHERE uniqueid IN 
                         (SELECT MAX(uniqueid) 
                          FROM tblbp 
                          GROUP BY instanceid) 
                         AND instanceid = :instanceID2`,
                  {
                      replacements: { instanceID2 },
                      type: QueryTypes.SELECT
                  }
              );

              if (dt3.length > 0) {
                  const partUniqueID = dt3[0].uniqueid;
                  const inventoryCost = dt3[0].inventorycost;

                  // Fetch onhand and model for the part
                  const dt4 = await sequelize.query(
                      `SELECT onhand, model 
                       FROM tblbp 
                       WHERE uniqueid = :partUniqueID`,
                      {
                          replacements: { partUniqueID },
                          type: QueryTypes.SELECT
                      }
                  );

                  if (dt4.length > 0) {
                      const partModel = dt4[0].model;
                      const qtyUsed = parseFloat(row.qty) * parseFloat(recJOnQuantity);

                      strParts += `UniqueID:${partUniqueID}//Part#:${partModel}//Inventory Cost:${inventoryCost}//Qty Used:${qtyUsed}==`;
                      console.log(`UniqueID:${partUniqueID}//Part#:${partModel}//Inventory Cost:${inventoryCost}//Qty Used:${qtyUsed}==`);

                      dblcost += parseFloat(inventoryCost) * qtyUsed;
                  }
              }
          }
      }

      // Get labor hours and calculate labor cost
      const laborHours = await getLaborHours(instanceID);
      const settings = await tblSettings.findOne();
      dblLaborcost = parseFloat(laborHours) * settings.dataValues.laborrate;

      // Update job detail with material cost, labor cost, labor hours, and parts list
      const jobDetail = await sequelize.query(
          `SELECT * 
           FROM tblJobDetail 
           WHERE uniqueID = :jobDetailID`,
          {
              replacements: { jobDetailID },
              type: QueryTypes.SELECT
          }
      );

      if (jobDetail.length > 0) {
          const jobRow = jobDetail[0];

          const totalCost = dblLaborcost + dblcost;
          jobRow.SingleMaterialCost = dblcost;
          jobRow.SingleLaborCost = dblLaborcost;
          jobRow.SingleLaborHours = laborHours;
          jobRow.PartsList = strParts;

          // Update the job detail record
          await sequelize.query(
              `UPDATE tblJobDetail 
               SET SingleMaterialCost = :SingleMaterialCost, 
                   SingleLaborCost = :SingleLaborCost, 
                   SingleLaborHours = :SingleLaborHours, 
                   PartsList = :PartsList 
               WHERE uniqueID = :jobDetailID`,
              {
                  replacements: {
                      SingleMaterialCost: dblcost,
                      SingleLaborCost: dblLaborcost,
                      SingleLaborHours: laborHours,
                      PartsList: strParts,
                      jobDetailID
                  },
                  type: QueryTypes.UPDATE
              }
          );

          // Update inventory cost in tblBP
          const total = parseFloat((dblLaborcost + dblcost).toFixed(2));
          const sellingPrice = total / (1 - settings.dataValues.upsellrate);

          await sequelize.query(
              `UPDATE tblBP 
               SET inventorycost = :total, 
                   ordercost = :total, 
                   sellingprice = :sellingPrice 
               WHERE uniqueid IN 
                     (SELECT MAX(uniqueid) 
                      FROM tblbp 
                      WHERE instanceID = :instanceID 
                      GROUP BY instanceid)`,
              {
                  replacements: { total, sellingPrice, instanceID },
                  type: QueryTypes.UPDATE
              }
          );

          console.log("Inventory and job detail updated successfully.");
      }

  } catch (error) {
      console.error("Error in removeFromInventory2:", error.message);
      throw new Error(error.message);
  }
};

const getLaborHours = async (lngInstanceID, depth = 0, includeTopLevelLabor = true) => {
    depth += 1;
    let hrs = 0;

    try {
        // Check if the item is in-house or not
        const rs = await sequelize.query(
            `SELECT builtinhouse 
             FROM tblBP 
             WHERE instanceID = :lngInstanceID 
             ORDER BY uniqueID DESC 
             LIMIT 1`,
            {
                replacements: { lngInstanceID },
                type: QueryTypes.SELECT
            }
        );

        if (rs.length > 0) {
            const builtInHouse = rs[0].builtinhouse;

            // If it's not in-house (or value is empty), calculate labor hours
            if (builtInHouse === "False" || builtInHouse === "") {
                // Include top-level labor hours if requested
                if (includeTopLevelLabor) {
                    const topLevelLabor = await sequelize.query(
                        `SELECT hours 
                         FROM tblPlan 
                         WHERE instanceID = :lngInstanceID`,
                        {
                            replacements: { lngInstanceID },
                            type: QueryTypes.SELECT
                        }
                    );

                    // Sum the top-level labor hours
                    for (const row of topLevelLabor) {
                        hrs += parseFloat(row.hours);
                    }
                }

                // Recursively calculate labor hours for sub-components
                const subComponents = await sequelize.query(
                    `SELECT (SELECT tblBP.instanceID 
                             FROM tblBP 
                             WHERE tblBP.UniqueID = tblBPParts.partid 
                             ORDER BY tblBP.uniqueID DESC 
                             LIMIT 1) AS instanceID 
                     FROM tblBPParts 
                     INNER JOIN tblSteps ON tblSteps.uniqueID = tblBPParts.stepID 
                     INNER JOIN tblPlan ON tblPlan.uniqueID = tblSteps.PlanID 
                     WHERE (SELECT COUNT(tblPlan.uniqueID) 
                            FROM tblPlan 
                            WHERE tblPlan.instanceID = 
                                  (SELECT tblBP.instanceID 
                                   FROM tblBP 
                                   WHERE tblBP.UniqueID = tblBPParts.partid 
                                   ORDER BY tblBP.uniqueID DESC 
                                   LIMIT 1)) > 0 
                           AND tblPlan.instanceID = :lngInstanceID`,
                    {
                        replacements: { lngInstanceID },
                        type: QueryTypes.SELECT
                    }
                );

                // Recursively calculate labor hours for each sub-component instance
                for (const component of subComponents) {
                    hrs += await getLaborHours(parseFloat(component.instanceID));
                }
            }
        }

        depth -= 1;
        return hrs;

    } catch (error) {
        depth -= 1;
        console.error("Error in getLaborHours:", error.message);
        throw new Error(error.message);
    }
};

const removePlanFromInventory = async (qty, lngTransID, lngJob, strModel = '') => {
  try {
    let rs;

    // If strModel is empty, fetch job parts from vwJobParts where JobID = lngJob
    if (!strModel) {
      rs = await sequelize.query(`
        SELECT * FROM vwJobParts WHERE JobID = :lngJob
      `, {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      });

      // If no records are found, exit the function
      if (rs.length === 0) {
        throw new Error("No job parts found for the given JobID");
      }

      // Remove inventory by adding inventory transaction detail with negative quantity
      const model = rs[0].model; // Assuming "Model" is the correct field
      const partQty = parseFloat(rs[0].qty) || 0;
      const adjustedQty = 0 - (qty * partQty);

      await addInventoryTransactionDetail(lngTransID, model, adjustedQty, 0, 1);
    } else {
      // Fetch instanceID from tblBP where model equals strModel
      rs = await sequelize.query(`
        SELECT instanceID FROM tblBP WHERE MODEL = :strModel
      `, {
        replacements: { strModel },
        type: QueryTypes.SELECT
      });

      // If no records are found, exit the function
      if (rs.length === 0) {
        throw new Error("No instanceID found for the given model");
      }

      // Assuming further logic is implemented here
      // Add further logic if needed (e.g., recurse through parts as indicated in the comments)
      // This is where the recursion would occur, but the original VB.NET code has this commented out.
    }

    // Commented-out recursion logic (kept as a note):
    // If needed, recurse through subassembly parts:
    // - Check if SubassemblyInventoried is 1
    // - Call IT_REMOVEPLANFROMINVENTORY recursively for each part

    // Example:
    // if (Math.abs(rs[0].SubassemblyInventoried) === 1) {
    //   await IT_REMOVEPLANFROMINVENTORY(partQty, lngTransID, lngJob, model);
    // }
  } catch (error) {
    console.log("Error in IT_REMOVEPLANFROMINVENTORY:",error.message)
    throw new Error('Error in IT_REMOVEPLANFROMINVENTORY:', error);
  }
}

export const addInventoryTransactionDetail = async (lngTransactionalID, strModel, lngQtyChange = 0, lngOnHandCount = 0, planremoval = 0, lvw = null) => {
  try {
    // Fetch the instance ID from tblbp using the strModel
    let dtt = await sequelize.query(`
      SELECT instanceID FROM tblbp WHERE MODEL = :strModel ORDER BY uniqueID DESC
    `, {
      replacements: { strModel },
      type: QueryTypes.SELECT
    });

    if (dtt.length === 0) {
      return 0;  // Return 0 if no records found
    }

    const instanceID = dtt[0].instanceID;

    // Fetch additional info from tblbp
    dtt = await sequelize.query(`
      SELECT uniqueid, instanceID, model, SubassemblyInventoried, productflag 
      FROM tblbp 
      WHERE uniqueid IN (SELECT MAX(uniqueid) FROM tblbp GROUP BY instanceid) 
      AND instanceid = :instanceID
    `, {
      replacements: { instanceID },
      type: QueryTypes.SELECT
    });

    if (dtt.length === 0) {
      return 0;  // Return 0 if no records found
    }

    const transDetail = dtt[0];

    // Delete any existing record in tblInventoryTransactionDetails for this transaction
    await sequelize.query(`
      DELETE FROM tblInventoryTransactionDetails 
      WHERE InventoryTransactionID = :lngTransactionalID 
      AND InstanceID = :instanceID
    `, {
      replacements: { lngTransactionalID, instanceID },
      type: QueryTypes.DELETE
    });

    // Check conditions to determine whether to add a new record
    if (parseInt(transDetail.SubassemblyInventoried) === 1 || parseInt(transDetail.productflag) === 0) {
      // Insert a new record into tblInventoryTransactionDetails
      await sequelize.query(`
        INSERT INTO tblInventoryTransactionDetails 
        (InventoryTransactionID, InstanceID, BPID, QtyChange, OnHand) 
        VALUES (:lngTransactionalID, :instanceID, :BPID, :lngQtyChange, :lngOnHandCount)
      `, {
        replacements: {
          lngTransactionalID,
          instanceID: parseInt(transDetail.instanceID),
          BPID: parseInt(transDetail.uniqueid),
          lngQtyChange,
          lngOnHandCount
        },
        type: QueryTypes.INSERT
      });
    } else if (parseInt(transDetail.SubassemblyInventoried) === 0) {
      // Handle subassembly inventory logic
      let dt2 = await sequelize.query(`

        SELECT tblbp.instanceid, 
        SUM(tblBPParts.qty) * 1 AS total_qty, 
        tblbp.uniqueid AS uid 
        FROM tblbp 
        INNER JOIN tblBPParts ON tblbp.uniqueid = tblBPParts.partid 
        INNER JOIN tblsteps ON tblsteps.uniqueid = tblBPParts.stepid 
        INNER JOIN tblplan ON tblplan.uniqueid = tblsteps.planid 
        WHERE tblPlan.instanceid IN (2592) 
        GROUP BY tblbp.instanceid, tblbp.uniqueid;
      `, {
        replacements: { instanceID },
        type: QueryTypes.SELECT
      });

      // Iterate through results and add transaction details
      for (const row of dt2) {
        await sequelize.query(`
          INSERT INTO tblInventoryTransactionDetails 
          (InventoryTransactionID, InstanceID, BPID, QtyChange, OnHand) 
          VALUES (:lngTransactionalID, :rowInstanceID, :rowBPID, :qtyChange, 0)
        `, {
          replacements: {
            lngTransactionalID,
            rowInstanceID: row.instanceid,
            rowBPID: row.uid,
            qtyChange: 0 - row['SUM(tblbpparts.qty) * 1']
          },
          type: QueryTypes.INSERT
        });
      }
    }

    // Update on-hand count for the model
    await updateOnhandByModel(transDetail.model);
    console.log("IT_AddInventoryTransactionDetail")
    return lngTransactionalID;

  } catch (error) {
    console.log("Error in IT_AddInventoryTransactionDetail:",error)
    throw new Error('Error in IT_AddInventoryTransactionDetail:', error.message);
  }
}

const addItemToInventoryTransaction = async (qty, transactionID, instanceID) => {
  try {
    // Fetch from tblInventoryTransactionDetails with a condition uniqueID = -1
    const transactionDetails = await sequelize.query(
        `SELECT * FROM tblInventoryTransactionDetails WHERE uniqueID = -1`,
        { type: QueryTypes.SELECT }
    );

    if (transactionDetails.length !== 0) {
        throw new Error("ERROR! Please contact Paradynamix!");
    } else {
        // Prepare new transaction detail record
        const newTransactionDetail = {
            InventoryTransactionID: transactionID,
            InstanceID: instanceID,
            QtyChange: qty
        };

        // Fetch latest uniqueID from tblbp based on instanceID
        const bpResult = await sequelize.query(
            `SELECT uniqueid, instanceID, model 
              FROM tblbp 
              WHERE uniqueid IN 
                    (SELECT MAX(uniqueid) 
                    FROM tblbp 
                    GROUP BY instanceid) 
                    AND instanceid = :instanceID`,
            {
                replacements: { instanceID },
                type: QueryTypes.SELECT
            }
        );

        if (bpResult.length > 0) {
            newTransactionDetail.BPID = bpResult[0].uniqueid;
        }

        // Fetch the latest on-hand quantity
        const onHandResult = await sequelize.query(
            `SELECT onhand 
              FROM tblBP 
              WHERE uniqueid IN 
                    (SELECT MAX(uniqueid) 
                    FROM tblbp 
                    WHERE instanceID = :instanceID 
                    GROUP BY instanceID)`,
            {
                replacements: { instanceID },
                type: QueryTypes.SELECT
            }
        );

        if (onHandResult.length > 0) {
            newTransactionDetail.OnHand = onHandResult[0].onhand;
        }

        // Insert the new transaction detail record
        await sequelize.query(
            `INSERT INTO tblInventoryTransactionDetails 
              (InventoryTransactionID, InstanceID, QtyChange, BPID, OnHand) 
              VALUES (:InventoryTransactionID, :InstanceID, :QtyChange, :BPID, :OnHand)`,
            {
                replacements: newTransactionDetail,
                type: QueryTypes.INSERT
            }
        );

    }
  } catch (error) {
    console.error("Error in addItemToInventoryTransaction:", error.message);
    throw new Error(error.message);
  }
};

const updatePercentage = async (lngJob) => {
  try {
    let x = 0;

    // Step 1: Fetch job data from tbljobs
    const dt = await sequelize.query(
      `SELECT * FROM tbljobs WHERE UniqueID = :lngJob`,
      {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      }
    );

    if (dt.JobType === 0) {
      throw new Error('No job found with the given UniqueID.');
    }

    const dr = dt[0];

    // Step 2: Check if job type is "Sub Assembly"
    if (dr.JobType === 'Sub Assembly') {
      // Step 3: Fetch job details ordered by shipdate
      const dt2 = await sequelize.query(
        `SELECT * FROM tblJobDetail WHERE JobID = :lngJob ORDER BY shipdate`,
        {
          replacements: { lngJob },
          type: QueryTypes.SELECT
        }
      );

      // Step 4: Sum up the quantity for each job detail
      for (const row of dt2) {
        x += parseFloat(row.Quantity) || 0;
      }
    } else {
      // Step 5: Fetch job details ordered by Serial
      const dt2 = await sequelize.query(
        `SELECT * FROM tblJobDetail WHERE JobID = :lngJob ORDER BY Serial`,
        {
          replacements: { lngJob },
          type: QueryTypes.SELECT
        }
      );

      // Step 6: Increment count if dateEntered is not null or empty
      for (const row of dt2) {
        if (row.dateEntered && row.dateEntered.trim() !== '') {
          x += 1;
        }
      }
    }

    // Step 7: Calculate the percentage complete
    const percentageComplete = (x / parseFloat(dr.Quantity)) || 0;

    // Step 8: Update the percentage in the tbljobs table
    await sequelize.query(
      `UPDATE tbljobs SET PercentageComplete = :percentageComplete WHERE UniqueID = :lngJob`,
      {
        replacements: {
          percentageComplete,
          lngJob
        },
        type: QueryTypes.UPDATE
      }
    );

  } catch (error) {
    console.log("Error in updatePercentage:",error)
    throw new Error('Error in updatePercentage:', error.message);
  }
};

const loadSerialItems = async (lngJob) => {
  try {
    // Clear the previous list of serial items (assuming this is done on the frontend)
    const lvwSerialItems = []; // This would represent a cleared list in a UI framework

    // Step 1: Fetch serial data from tblJobDetail for the given JobID
    const dtSerial = await sequelize.query(
      `SELECT * FROM tblJobDetail WHERE JobID = :lngJob ORDER BY Serial`,
      {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      }
    );

    // Step 2: Iterate through the serial data and prepare list items
    const items = dtSerial.map(row => {
      const itemCost = parseFloat(row.CostPerUnit) || 0;
      
      return {
        serial: row.Serial,
        uniqueId: row.UniqueID,
        dateEntered: row.dateEntered || '',
        itemCost: itemCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        scheduledDate: row.ScheduledDate || ''
      };
    });

    // Step 3: Add the prepared items to the list view (this depends on how you're rendering the UI)
    lvwSerialItems.push(...items);

    // Step 4: Calculate and display the job cost
    const jobCost = await calculateJobCost(lngJob); // Assuming this function exists
    const formattedJobCost = jobCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return {
      serialItems: lvwSerialItems,
      totalJobCost: formattedJobCost
    };
  } catch (error) {
    console.error('Error loading serial items:', error.message);
    throw new Error('Error loading serial items:', error.message);
  }
};

const calculateJobCost = async (lngJob) => {
  try {
    // Step 1: Fetch job details from tblJobDetail for the given JobID
    const dt = await sequelize.query(
      `SELECT * FROM tblJobDetail WHERE JobID = :lngJob`,
      {
        replacements: { lngJob },
        type: QueryTypes.SELECT
      }
    );

    // Step 2: Calculate the total cost
    let totalCost = 0;
    for (const row of dt) {
      const rowCost = parseFloat(row.CostPerUnit) || 0;
      totalCost += rowCost;
    }

    return totalCost;
  } catch (error) {
    console.error('Error calculating job cost:', error.message);
    throw new Error('Error calculating job cost:', error.message);
  }
};

export const calculateLatestUnitCost = async (lngJob, operationId=0) => {
  let cost = 0.00;
  let laborCost = 0.00;
  let jobOperations
  try {
    // Fetch Job Operations
  
    jobOperations = await sequelize.query(
      `SELECT * FROM tblJobOperations WHERE JobID = :lngJob`,
      { replacements: { lngJob }, type: QueryTypes.SELECT }
    );

    if (jobOperations.length === 0) {
      return 0.00;
    }

    for (const jobOperation of jobOperations) {
      // Fetch parts related to the job operation
      const jobParts = await sequelize.query(
        `SELECT * FROM vwJobParts WHERE JobOperationID = :jobOperationID`,
        { replacements: { jobOperationID: jobOperation.uniqueID }, type: QueryTypes.SELECT }
      );

      for (const part of jobParts) {
        // Get the latest inventory cost of the part
        const inventoryData = await sequelize.query(
          `SELECT tblbp.model, tblbp.description, tblbp.inventoryunit, tblbp.ordercost, tblbp.multiple, tblbp.inventorycost, tblbp.instanceID
           FROM tblbp 
           WHERE uniqueid IN (SELECT MAX(uniqueid) FROM tblbp WHERE model = :model)`,
          { replacements: { model: part.model }, type: QueryTypes.SELECT }
        );

        let inventoryCost = parseFloat(inventoryData[0].inventorycost) || 0.00;
        cost += (part.qty * inventoryCost);
      }
      const settings = await tblSettings.findOne();
      // Calculate labor cost for the job operation
      let laborHours =  jobOperation.Hours == "" ?  0 : parseFloat(jobOperation.Hours);
      laborCost += laborHours * settings.dataValues.laborrate;
    }
    // Calculate total cost and round it
    cost = Math.round(cost * 1 * 100) / 100; // Multiplied by 1 to maintain the same logic as in VB
    return cost;
  } catch (error) {
    console.error("Error calculating latest unit cost:", error);
    throw new Error("Error calculating latest unit cost:", error)
  }
}

const saveJob = async (lngJob) => {
  try {
    // Update additional fields if needed
    const recJOnCost = await calculateJobCost(lngJob)
    let cost = recJOnCost || 0.00;
    await sequelize.query(
      `UPDATE tblJobs SET PercentageComplete = 0, Cost = :cost WHERE UniqueID = :lngJob`,
      { replacements: { cost, lngJob }, type: QueryTypes.UPDATE }
    );
    
    //Update percentage complete and display success message
    await updatePercentage(lngJob);

  } catch (error) {
    console.log("Save Job",error.message)
    throw new Error(error.message);
  }
};

export const createLinkJob = async (job1, job2) => {
  try {
    // Insert the new linked job into the database
    await sequelize.query(`
      INSERT INTO tblLinkedJobs (Job1, Job2) VALUES (:Job1, :Job2)
    `, {
      replacements: {
        Job1: job1,
        Job2: parseInt(job2, 10)
      },
      type: QueryTypes.INSERT
    });

  } catch (error) {
    throw new Error('Error in linkedJob:', error.message);
  }
}

export const getLinkJobs = async (lngJob) => {
  try {
    // Query to fetch job1, job2, and their corresponding numbers from tblJobs
    const linkedJobs = await sequelize.query(`
      SELECT 
        job1,
        (SELECT number FROM tblJobs WHERE uniqueID = job1) AS job1Number,
        job2,
        (SELECT number FROM tblJobs WHERE uniqueID = job2) AS job2Number
      FROM tblLinkedJobs
      WHERE Job1 = :lngJob OR Job2 = :lngJob
    `, {
      replacements: { lngJob },
      type: QueryTypes.SELECT
    });

    // Process each row from the result
    const linkedProducts = [];
    const linkedSubs = [];

    linkedJobs.forEach(row => {
      if (row.job1 == lngJob) {
        if (row.job2Number && row.job2Number.trim() !== '') {
          // Add to linkedProducts and linkedSubs
          linkedProducts.push({ parentJob: row.job2, UniqueID: row.job2, NUMBER: row.job2Number });
          linkedSubs.push({ parentJob: row.job2, UniqueID: row.job2, NUMBER: row.job2Number });
        }
      } else {
        if (row.job1Number && row.job1Number.trim() !== '') {
          // Add to linkedProducts and linkedSubs
          linkedProducts.push({ parentJob: row.job1, UniqueID: row.job1, NUMBER: row.job1Number });
          linkedSubs.push({ parentJob: row.job1, UniqueID: row.job1, NUMBER: row.job1Number });
        }
      }
    });
    // Return the results (or handle them as needed in your application)
    return linkedProducts;

  } catch (error) {
    throw new Error(error.message);
  }
}

export const deleteLinkedJob = async (jobId, linkedJobId) => {
  if (!linkedJobId) return; // Exit if no selected item

  try {
    // Delete from tblLinkedJobs where Job1 is lngJob and Job2 is the selected item
    await sequelize.query(`
      DELETE FROM tblLinkedJobs WHERE Job1 = :lngJob AND Job2 = :selectedItemTag
    `, {
      replacements: { lngJob: jobId, selectedItemTag: linkedJobId },
      type: QueryTypes.DELETE
    });

    // Delete from tblLinkedJobs where Job2 is lngJob and Job1 is the selected item
    await sequelize.query(`
      DELETE FROM tblLinkedJobs WHERE Job2 = :lngJob AND Job1 = :selectedItemTag
    `, {
      replacements: { lngJob: jobId, selectedItemTag: linkedJobId },
      type: QueryTypes.DELETE
    });

  } catch (error) {
    throw new Error(error.message);
  }
}

export const getJobCategories = async () => {
  const result =  await sequelize.query(`
    Select distinct parttype from tblBP order by parttype
  `, {
    type: QueryTypes.SELECT
  });
  
  const distinctCategories = result.map((item: any) => item['parttype']).filter((parttype) => parttype !== null);

  return distinctCategories;
}

export const getJobSubCategories = async (category) => {
  const resultSubCategories =  await sequelize.query(`
    Select distinct subcategory from tblBP where uniqueid In (Select max(uniqueID) from tblBP group by instanceID) And parttype = :category order by subcategory
  `, {
    replacements: { category },
    type: QueryTypes.SELECT
  });

  const resultPart =  await sequelize.query(`
    select distinct model  + ' ' + description, instanceID from tblBP where uniqueid in (Select max(uniqueID) from tblBP group by instanceID) and  parttype = :category order by model  + ' ' + description
  `, {
    replacements: { category },
    type: QueryTypes.SELECT
  });

  const distinctSubCategories = resultSubCategories.map((item: any) => item['subcategory']).filter((subCategory) => subCategory !== null);
  const distinctPart = resultPart.map((item: any) => item['']).filter((part) => part !== null);
  return { distinctSubCategories, distinctPart } ;
}

export const getJobParts = async(category, subCategory) => {
 
  const resultPart =  await sequelize.query(`
    select distinct model  + ' ' + description, instanceID from tblBP where uniqueid in (Select max(uniqueID) from tblBP group by instanceID) and  parttype = :category and SubCategory = :subCategory order by model  + ' ' + description 
  `, {
    replacements: { category, subCategory },
    type: QueryTypes.SELECT
  });

  const distinctPart = resultPart.map((item: any) => item['']).filter((part) => part !== null);
  return distinctPart;
}

export const getClosesByUsers = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ClosedBy')), 'ClosedBy']
    ],
    where: {
      [Op.and]: [
        { 'ClosedBy': { [Op.ne]: null } },
        { 'ClosedBy': { [Op.ne]: '' } }
      ]
    },
    order: [['ClosedBy', 'ASC']],
    raw: true
  });

  const distinctClosedByUsers = result.map((item: any) => item['ClosedBy']);
  return distinctClosedByUsers;
}

export const getJobTypes = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('JobType')), 'JobType']
    ],
    where: {
      [Op.and]: [
        { 'JobType': { [Op.ne]: null } },
        { 'JobType': { [Op.ne]: '' } }
      ]
    },
    order: [['JobType', 'ASC']],
    raw: true
  });

  const distinctJobType = result.map((item: any) => item['JobType']);
  return distinctJobType;
}

export const getPerType = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PerType')), 'PerType']
    ],
    where: {
      [Op.and]: [
        { 'PerType': { [Op.ne]: null } },
        { 'PerType': { [Op.ne]: '' } }
      ]
    },
    order: [['PerType', 'ASC']],
    raw: true
  });

  const distinctPerType = result.map((item: any) => item['PerType']);
  return distinctPerType;
}

export const getProductionUsers = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('ProductionBy')), 'ProductionBy']
    ],
    where: {
      [Op.and]: [
        { 'ProductionBy': { [Op.ne]: null } },
        { 'ProductionBy': { [Op.ne]: '' } }
      ]
    },
    order: [['ProductionBy', 'ASC']],
    raw: true
  });

  const distinctProductionBy = result.map((item: any) => item['ProductionBy']);
  return distinctProductionBy;
}

export const getEmployees = async () => {
  // const result = await tblJobs.findAll({
  //   attributes: [
  //     [Sequelize.fn('DISTINCT', Sequelize.col('ByEmployee')), 'ByEmployee']
  //   ],
  //   where: {
  //     [Op.and]: [
  //       { 'ByEmployee': { [Op.ne]: null } },
  //       { 'ByEmployee': { [Op.ne]: '' } }
  //     ]
  //   },
  //   order: [['ByEmployee', 'ASC']],
  //   raw: true
  // });

  let distinctByEmployees = await sequelize.query(`
      select '#' + payrollno + ' ' + lname + ', ' + fname from tblemployee where active = 1 order by payrollnumber asc
  `, {
      type: QueryTypes.SELECT
  });

  distinctByEmployees = distinctByEmployees.map((item: any) => item['']);
  return distinctByEmployees;
}

export const getProductLines = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('PRODUCTLINE')), 'PRODUCTLINE']
    ],
    where: {
      [Op.and]: [
        { 'PRODUCTLINE': { [Op.ne]: null } },
        { 'PRODUCTLINE': { [Op.ne]: '' } }
      ]
    },
    order: [['PRODUCTLINE', 'ASC']],
    raw: true
  });

  const distinctPRODUCTLINE = result.map((item: any) => item['PRODUCTLINE']);
  return distinctPRODUCTLINE;
}

export const getJobCat = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('jobcat')), 'jobcat']
    ],
    where: {
      [Op.and]: [
        { 'jobcat': { [Op.ne]: null } },
        { 'jobcat': { [Op.ne]: '' } }
      ]
    },
    order: [['jobcat', 'ASC']],
    raw: true
  });

  const distinctjobcat = result.map((item: any) => item['jobcat']);
  return distinctjobcat;
}

export const getJobSubCat = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('jobsubcat')), 'jobsubcat']
    ],
    where: {
      [Op.and]: [
        { 'jobsubcat': { [Op.ne]: null } },
        { 'jobsubcat': { [Op.ne]: '' } }
      ]
    },
    order: [['jobsubcat', 'ASC']],
    raw: true
  });

  const distinctjobsubcat = result.map((item: any) => item['jobsubcat']);
  return distinctjobsubcat;
}

export const getModels = async (productline) => {
  
  const result =  await sequelize.query(`
    Select distinct model + ' ' + description, instanceID from tblBP where uniqueid in (Select max(uniqueID) from tblBP group by instanceID) and productline = :productline order by model + ' ' + description
  `, {
    replacements: { productline: productline },
    type: QueryTypes.SELECT
  });
  
  const distinctMODEL = result.map((item: any) => item['']).filter((model) => model !== null);

  return distinctMODEL;
}