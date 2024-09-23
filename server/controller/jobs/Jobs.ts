import { tblJobDetail, tblJobs, tblSettings } from "~/server/models";
import { Sequelize, Op } from "sequelize";
import  sequelize  from '../../utils/databse';  
import { QueryTypes } from 'sequelize';
import fs from 'fs';
import path from 'path'; 

const formatDate = (date) => {
  const today = new Date(date);
  return String(today.getMonth() + 1).padStart(2, '0')  + '/' + 
  String(today.getDate()).padStart(2, '0') + '/' + 
  today.getFullYear();
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
    attributes: ['UniqueID', 'JobID', 'PartsList', 'Serial', 'ShipDate', 'SingleMaterialCost', 'dateEntered', 'ScheduledDate', 'SingleLaborCost', 'CostPerUnit'],
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


export const updateJobSerial = async (jobId, jobQuantity, model) => {

  if (!jobId) {
    throw new Error('No Job ID provided');
  }

  const spaceIndex = model.indexOf(" ");
  const strModel = model.substring(0, spaceIndex); 

  const [serialResult] = await sequelize.query(`
    SELECT max(cast(serial as bigint)) + 1 AS nextSerial FROM vwSerialData WHERE Model = :strModel
  `, {
    replacements: { strModel },
    type: QueryTypes.SELECT
  });

  let begSerial = parseInt(serialResult ? serialResult.nextSerial : 0)

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
// latestUnitCost, customer, model,
export const processSerials = async (serialItems, instanceId, employee, perType, jobPart, jobId, model, ignoreDuplicateCheck = false) => {
  console.log(instanceId,employee)
  // Filter out empty items
  serialItems =JSON.parse(serialItems)
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
  const currentDate = new Date();
  for (const item of serialItems) {
    if (item.checked && (item.dateEntered === "" || ignoreDuplicateCheck || item.dateEntered === null)) {
      item.dateEntered = formatDate(currentDate) 
      
      // Update serial records (Assuming AddtoSerialRecords is a function handling serial updates)
      await addToSerialRecords(item.Serial, item.UniqueID, instanceId, employee, item.JobID, perType, jobPart);
      // console.log(item)
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
  console.log("Serials have been added and the inventory has been updated.");
  return {serialItems, message: "Serials have been added and the inventory has been updated."}
};

// Function to add a serial record to the inventory
const addToSerialRecords = async (serialNo, jobDetailId, instanceId, employee, jobId, recJoaPerType, recJOaPart) => {
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
    const today = formatDateForSQLServer(new Date())
    
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
        today: today
      },
      type: QueryTypes.INSERT
    });

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

    console.log('Record successfully added to inventory');
  } catch (error) {
    console.error('Error adding serial record:', error.message);
    throw new Error('Error adding serial record: '+error.message)
  }
}

const verifyInventoryTransaction = async (manual = '', date, createdBy, options = {}) => {
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

    if (existingTransaction.length > 0) {
      transID = existingTransaction[0].uniqueid;
    }

    let strType = 'Transaction';
    if (transactionalID > 0) strType = 'Transaction';
    if (jobID > 0) strType = 'Job';
    if (jobOperationID > 0) strType = 'Job Operation';
    if (serviceReportID > 0) strType = 'Service Report';
    if (vendorInvoiceID > 0) strType = 'Vendor Invoice';
    if (orderID > 0) strType = 'Sales Invoice';
    console.log(transID)
    // If transaction does not exist, insert a new record
    if (transID === 0) {
      console.log("insert")
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
      console.log("update")
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

    return transID;
  } catch (error) {
    console.log("Error verifying inventory transaction:",error)
    throw new Error('Error verifying inventory transaction:', error.message);
  }
}

const clearInventoryTransactionDetails = async (transactionalID) => {
  console.log('tran',transactionalID)
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

    // Return a success value
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
      console.log('No model found for the given instanceID');
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
      ddate = manualTransactionResult[0].Dated || ddateDefault;
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
      const ddate = formatDateForSQLServer(new Date(rs2[0].Dated)); // This will be in UTC format
      console.log(ddate)
      // ddate = rs2[0].Dated;  // Update date to the most recent "manual" transaction date
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
        console.log("No job parts found for the given JobID");
        return;
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
        console.log("No instanceID found for the given model");
        return;
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
    console.log("Error in updateOnhand:",error)
    throw new Error('Error in IT_REMOVEPLANFROMINVENTORY:', error.message);
  }
}

const addInventoryTransactionDetail = async (lngTransactionalID, strModel, lngQtyChange = 0, lngOnHandCount = 0, planremoval = 0, lvw = null) => {
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

    return lngTransactionalID;

  } catch (error) {
    console.log("Error in IT_AddInventoryTransactionDetail:",error)
    throw new Error('Error in IT_AddInventoryTransactionDetail:', error.message);
  }
}

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

    // Set the job cost to a UI element or variable (e.g., recJOnCost)
    console.log('Total Job Cost:', formattedJobCost);

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

const calculateLatestUnitCost = async (lngJob) => {
  let cost = 0.00;
  let laborCost = 0.00;

  try {
    // Fetch Job Operations
    const jobOperations = await sequelize.query(
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

export const getJobCategories = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('Catagory')), 'Catagory']
    ],
    where: {
      [Op.and]: [
        { 'Catagory': { [Op.ne]: null } },
        { 'Catagory': { [Op.ne]: '' } }
      ]
    },
    order: [['Catagory', 'ASC']],
    raw: true
  });

  const distinctCategories = result.map((item: any) => item['Catagory']);
  return distinctCategories;
}

export const getJobSubCategories = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('SubCatagory')), 'SubCatagory']
    ],
    where: {
      [Op.and]: [
        { 'SubCatagory': { [Op.ne]: null } },
        { 'SubCatagory': { [Op.ne]: '' } }
      ]
    },
    order: [['SubCatagory', 'ASC']],
    raw: true
  });

  const distinctSubCategories = result.map((item: any) => item['SubCatagory']);

  return distinctSubCategories;
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

export const getModels = async () => {
  const result = await tblJobs.findAll({
    attributes: [
      [Sequelize.fn('DISTINCT', Sequelize.col('MODEL')), 'MODEL']
    ],
    where: {
      [Op.and]: [
        { 'MODEL': { [Op.ne]: null } },
        { 'MODEL': { [Op.ne]: '' } }
      ]
    },
    order: [['MODEL', 'ASC']],
    raw: true
  });

  const distinctMODEL = result.map((item: any) => item['MODEL']);
  return distinctMODEL;
}