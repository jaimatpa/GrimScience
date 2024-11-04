import { Op, QueryTypes } from "sequelize";
import Sequelize from "sequelize/lib/sequelize";

import {
  tblBP,
  tblEmployee,
  tblJobDetail,
  tblJobOperations,
  tblLinkedJobs,
  tblOperationHoursWorked,
} from "~/server/models";
import tblJobs from "~/server/models/tblJobs";
import sequelize from "~/server/utils/databse";

import { calculateOperationCosts } from "../jobs/Operation"

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


export const getAllProject = async (page,  pageSize, sortBy, sortOrder, filters) => {
  try {
    // Initialize project types with 'All' always included
    const selectedProjectTypes = ["'All'"];
    if (filters.Marketing === 'true') selectedProjectTypes.push("'Marketing'");
    if (filters.Accounting === 'true') selectedProjectTypes.push("'Accounting'");
    if (filters.Engineering === 'true') selectedProjectTypes.push("'Engineering'");
    if (filters.Manufacturing === 'true') selectedProjectTypes.push("'Manufacturing'");

    const projectTypeFilter = selectedProjectTypes.join(', ');

    // Start with base WHERE clause
    let queryConditions = [];
    queryConditions.push("projecttype IS NOT NULL");
    queryConditions.push("projecttype <> ''");
    queryConditions.push(`projecttype IN (${projectTypeFilter})`);

    // Add filter conditions using parameterized queries for security
    const queryParams = {};
    
    if (filters.NUMBER) {
      queryConditions.push("number LIKE :number");
      queryParams.number = `${filters.NUMBER}%`;
    }
    if (filters.QUANTITY) {
      queryConditions.push("quantity LIKE :quantity");
      queryParams.quantity = `${filters.QUANTITY}%`;
    }
    if (filters.MODEL) {
      queryConditions.push("model LIKE :model");
      queryParams.model = `${filters.MODEL}%`;
    }
    if (filters.PerType) {
      queryConditions.push("PerType LIKE :perType");
      queryParams.perType = `${filters.PerType}%`;
    }
    if (filters.DATEOPENED) {
      queryConditions.push("dateopened LIKE :dateOpened");
      queryParams.dateOpened = `${filters.DATEOPENED}%`;
    }
    
    // Handle date range like in VB.NET code
    const currentDate = new Date();
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
    
    queryConditions.push("CAST(dateopened AS DATETIME) BETWEEN :startDate AND :endDate");
    queryParams.startDate = fiveYearsAgo.toISOString().split('T')[0];
    queryParams.endDate = currentDate.toISOString().split('T')[0];

    if (filters.ShowOpenOnly === 'true') {
      queryConditions.push("(dateclosed IS NULL OR dateclosed = '')");
    }

    // Build the main query
    const whereClause = queryConditions.join(' AND ');

    // Handle sorting
    let orderClause = 'ORDER BY NUMBER'; // default sorting
  
    if (sortBy && sortOrder) {
      const direction = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Special handling for date and numeric columns
      if (['dateopened', 'dateclosed'].includes(sortBy.toLowerCase())) {
        orderClause = `ORDER BY CAST(${sortBy} AS DATETIME) ${direction}`;
      } else if (['Cost', 'PercentageComplete'].includes(sortBy)) {
        orderClause = `ORDER BY CAST(${sortBy} AS FLOAT) ${direction}`;
      } else {
        orderClause = `ORDER BY ${sortBy} ${direction}`;
      }
    }
    
    // Count total rows
    const countQuery = `
      SELECT COUNT(*) AS totalRows 
      FROM tblJobs 
      WHERE ${whereClause}
    `;
    
    const [totalRowResult] = await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements: queryParams
    });

    // Calculate pagination
    const limit = parseInt(pageSize, 10) || 10;
    const offset = ((parseInt(page, 10) - 1) || 0) * limit;

    // Main query with pagination and sorting
    const query = `
      SELECT *
      FROM tblJobs
      WHERE ${whereClause}
      ${orderClause}
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `;

    const jobs = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: queryParams
    });

    // Transform results
    const list = jobs.map(job => ({
      NUMBER: job.NUMBER,
      UniqueID: job.UniqueID,
      QUANTITY: job.QUANTITY,
      MODEL: `#${job.MODEL || ''}${job.PART || ''}`,
      PerType: job.PerType,
      DATEOPENED: job.DATEOPENED ? new Date(job.DATEOPENED).toLocaleDateString() : '',
      DATECLOSED: job.DATECLOSED && job.DATECLOSED !== '12:00:00 AM' 
        ? new Date(job.DATECLOSED).toLocaleDateString() 
        : '',
      PercentageComplete: job.PercentageComplete 
        ? Math.round(parseFloat(job.PercentageComplete) * 100) 
        : 0,
      Cost: typeof job.Cost === 'number' 
        ? job.Cost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        : '0.00'
    }));

    return {
      list,
      totalCount: totalRowResult.totalRows
    };
  } catch (error) {
    console.error('Error executing getAllProject:', error);
    throw error;
  }
};

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
  let instanceid = 0
  if(reqData.MODEL){
    const model = reqData.MODEL.trim().split(" ")[0];
    const query = `SELECT TOP 1 instanceID FROM tblBP WHERE MODEL = :model`;
    const [result] = await sequelize.query(query, {
        replacements: { model },
        type: QueryTypes.SELECT
    });
    instanceid = result.instanceID
  }

  if(reqData.PART){
    const model = reqData.PART.trim().split(" ")[0];
    const query = `SELECT TOP 1 instanceID FROM tblBP WHERE MODEL = :model`;
    const [result] = await sequelize.query(query, {
        replacements: { model },
        type: QueryTypes.SELECT
    });
    instanceid = result.instanceID
  }

  await tblJobs.update({
    ...reqData,
    ProjectType:reqData.Catagory, 
    instanceID:instanceid,
    DATEOPENED: formatDate(reqData.DATEOPENED),
    DATECLOSED: reqData.DATECLOSED ? formatDate(reqData.DATECLOSED) : null,
    ProductionDate: reqData.ProductionDate ? formatDate(reqData.ProductionDate) : null,
  }, 
    
  {
    where: { UniqueID: id }
  });
  return id;
}

export const deleteJob = async (id) => {
  await tblJobs.destroy({ where: { UniqueID: id } });
  return id
}

export const deleteJobs = async (jobs) => {
  for( const job of jobs){
    await tblJobs.destroy({ where: { UniqueID: job.UniqueID } });
  }
}

export const createProject = async (data) => {

  const createReqData = {
    ...data,
    PercentageComplete : 0,
    DATEOPENED: formatDate(data.DATEOPENED),
    DATECLOSED: data.DATECLOSED ? formatDate(data.DATECLOSED) : null,
    ProductionDate: data.ProductionDate ? formatDate(data.ProductionDate) : null,
    ProjectType: data.Catagory

  };

  console.log(createReqData)
  
  const newProject = await tblJobs.create(createReqData);
  return newProject
}

export const updateProjectPercentage = async (jobs) => {
  try {
    

    // Loop through each job item
    for (const job of jobs) {
      let x = 0;
      let lngjob = job;

      // Check if the job type is "Sub Assembly"
      if (job.jobtype === "Sub Assembly") {
        // Get job details ordered by ship date
        const jobDetails = await sequelize.query(`
          SELECT * FROM tblJobDetail 
          WHERE JobID = :lngjob 
          ORDER BY shipdate
        `, {
          replacements: { lngjob },
          type: QueryTypes.SELECT
        });

        // Accumulate quantity from the job details
        for (const detail of jobDetails) {
          x += parseFloat(detail.Quantity || 0);
        }
      } else {
        // Get job details ordered by serial
        const jobDetails = await sequelize.query(`
          SELECT * FROM tblJobDetail 
          WHERE JobID = :lngjob 
          ORDER BY Serial
        `, {
          replacements: { lngjob },
          type: QueryTypes.SELECT
        });

        // Count the entries where 'dateEntered' is not empty
        for (const detail of jobDetails) {
          if (detail.dateEntered && detail.dateEntered.trim() !== '') {
            x += 1;
          }
        }
      }

      // Calculate the percentage complete and update the job record
      const percentageComplete = x / parseFloat(job.Quantity || 1);

      await sequelize.query(`
        UPDATE tblJobs 
        SET PercentageComplete = :percentageComplete 
        WHERE UniqueID = :lngjob
      `, {
        replacements: { percentageComplete, lngjob },
        type: QueryTypes.UPDATE
      });
    }

  } catch (error) {
    console.error('Error processing job completion:', error.message);
    throw new Error(error.message);
  }
};

export const refreshProject = async (lngJob, qty) => {
  try {
    
    const jobDetails = await sequelize.query(
        `Select * from tbljobs Where UniqueID = :lngJob`,
        {
            replacements: { lngJob },
            type: QueryTypes.SELECT
        }
    );

    let recJOnCost = jobDetails[0].Cost

    if(jobDetails[0].DATECLOSED == "" || jobDetails[0].DATECLOSED == null){
      if( jobDetails[0].PerTyoe === 'Operation' ){
        recJOnCost = await calculateOperationCosts(lngJob, jobDetails[0].QUANTITY)
      }
    }

    let cost = recJOnCost;
    await sequelize.query(
      `UPDATE tblJobs SET Cost = :cost WHERE UniqueID = :lngJob`,
      { replacements: { cost, lngJob }, type: QueryTypes.UPDATE }
    );

    return recJOnCost;

  }catch (error) {
    console.error("Error in refreshJobCosts:", error.message);
    throw new Error(error.message);
  }
};

export const getProjectReportData = async (id, jobNumber) => {

  const [jobResult] = await sequelize.query(
    `SELECT * FROM tblJobs WHERE number = :jobNumber`,
    {
      replacements: { jobNumber },
      type: QueryTypes.SELECT
    }
  );
  
  if (!jobResult) {
    throw new Error(`Job not found for number: ${jobNumber}`);
  }

  const jobId = (jobResult as any).UniqueID;

  const reportData = await sequelize.query(`
    Select 
    (select verified from tblJobOperations where tblJobOperations.PlanID = tblPlan.UniqueID and tblJobOperations.JobID=:jobId) as verified,
    (select verifiedby from tblJobOperations where tblJobOperations.PlanID = tblPlan.UniqueID and tblJobOperations.JobID=:jobId) as verifiedby,
    (select uniqueID from tblJobOperations where tblJobOperations.PlanID = tblPlan.UniqueID and tblJobOperations.JobID=:jobId) as JobOperationId,
    tblPlan.uniqueID as OUID, 
    tblSteps.UniqueID as SID, 
    (select top 1 '#' + model + ' ' + description from tblBP Where instanceID = tblPlan.InstanceID and uniqueid in (select max(uniqueid) from tblbp where instanceid=tblPlan.InstanceID)) as PlanModel, 
    tblPlan.hours,
    tblBP.ProductLine, 
    tblPlan.Number, 
    tblPlan.Operation, 
    tblSteps.Step, 
    tblSteps.description as StepDescription, 
    tblSteps.notes as notes, 
    tblBPParts.Note, 
    tblBPParts.Qty, 
    tblBP.InventoryUnit, 
    tblBP.model, 
    tblBP.description as BPDescription, 
    tblPlan.WorkCenter, 
    ApprovedBy, 
    ApprovedDate, 
    PreparedBy, 
    PreparedDate
from tblPlan 
left join tblSteps on tblSteps.PlanID = tblPlan.UniqueID 
left join tblBPParts on tblBPParts.StepID = tblSteps.UniqueID 
left join tblBP on tblBP.uniqueID = tblBPParts.partID 
Where tblPlan.InstanceID = :instanceId 
Order by tblPlan.Number, cast(step as int), model
  `, {
    replacements: { jobId, instanceId:id },
    type: QueryTypes.SELECT
  });


  return { reportData, job:jobResult }
}

















































export const getEmployeess = async () => {
  try {
    const list = await tblEmployee.findAll({
      attributes: [
        [Sequelize.literal("CONCAT(fname, ' ', lname)"), "fullName"],
      ],
      where: {
        ACTIVE: true,
      },
    });
    return list.map((employee) => employee.get("fullName"));
  } catch (err) {
    return err.message;
  }
};

export const getDistinctSubcategories = async (partTypeValue) => {
  try {
    const subcategories = await tblBP.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("subcategory")), "subcategory"],
      ],
      where: {
        uniqueid: {
          [Op.in]: Sequelize.literal(`(
            SELECT MAX(uniqueID)
            FROM tblBP
            GROUP BY instanceID
          )`),
        },
        parttype: partTypeValue,
      },
      order: [["subcategory", "ASC"]],
    });

    return subcategories.map((subcategory) => subcategory.get("subcategory"));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export async function getBasicModels(parttype, subCategory) {
  try {
    const results = await tblBP.findAll({
      attributes: ["UniqueID", "instanceID", "description", "model"],
      where: {
        parttype: parttype,
        SubCategory: subCategory,
      },
      order: [
        ["model", "ASC"],
        ["description", "ASC"],
      ],
    });

    return results.map((result) => ({
      description: result.get("description"),
      model: result.get("model"),
      UniqueID: result.get("UniqueID"),
      instanceID: result.get("instanceID"),
    }));
  } catch (error) {
    console.error("Error executing basic query:", error);
  }
}

export const getProjectItem = async (category) => {
  try {
    const whereClause = category ? { Catagory: category } : {};

    const list = await tblJobs.findAll({
      attributes: ["UniqueID", "NUMBER"],
      where: whereClause,
    });

    return list.map((result) => ({
      JobID: result.get("UniqueID"),
      NUMBER: result.get("NUMBER"),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("An error occurred while fetching the jobs.");
  }
};



export const projectExistByID = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  if (tableDetail) return true;
  else return false;
};

export const getprojectDetail = async (id) => {
  const tableDetail = await tblJobs.findByPk(id);
  return tableDetail;
};

export const GetInventoryDatas = async (id) => {
  try {
    const data = await tblJobDetail.findAll({
      where: { JobID: id },
      attributes: ["Quantity", "dateEntered", "ScheduledDate"],
    });

    return data;
  } catch (error) {
    console.error("Error fetching inventory data:", error.message);
    console.error("Error stack trace:", error.stack);
    throw new Error("An error occurred while fetching the inventory data.");
  }
};

export const updateProject = async (id, reqData) => {
  await tblJobs.update(reqData, {
    where: { UniqueID: id },
  });
  return id;
};
export const getMaxJobId = async () => {
  try {
    const result = await tblJobs.max("UniqueID");
    return result || 0;
  } catch (error) {
    console.error(`Error getting max job ID: ${error.message}`);
    throw new Error(`Error getting max job ID: ${error.message}`);
  }
};
export const insertJobDetails = async (jobDetails, maxId) => {
  try {
    if (!Array.isArray(jobDetails)) {
      throw new Error("Invalid jobDetails format: Expected an array.");
    }

    const updatedJobDetails = jobDetails.map((detail) => ({
      ...detail,
      JobID: maxId,
    }));

    await tblJobDetail.destroy({
      where: { JobID: maxId },
    });

    await tblJobDetail.bulkCreate(updatedJobDetails);
  } catch (error) {
    console.error("Error inserting job details:", error);
    throw new Error(`Error inserting job details: ${error.message}`);
  }
};

export const insertLinkedJob = async (projectItemList, id) => {
  try {
    if (projectItemList.length > 0) {
      const updatedJobDetails = projectItemList.map((detail) => ({
        Job1: id,
        Job2: detail.value,
      }));

      await tblLinkedJobs.bulkCreate(updatedJobDetails);
    } else {
      console.warn("Project item list is empty.");
    }
    return { success: true };
  } catch (error) {
    console.error("Error inserting linked job:", error.message || error);
    return { success: false, error: error.message || "An error occurred" };
  }
};

tblJobs.hasMany(tblLinkedJobs, { as: "Job1Details", foreignKey: "Job1" });
tblJobs.hasMany(tblLinkedJobs, { as: "Job2Details", foreignKey: "Job2" });

tblLinkedJobs.belongsTo(tblJobs, { as: "Job1Details", foreignKey: "Job1" });
tblLinkedJobs.belongsTo(tblJobs, { as: "Job2Details", foreignKey: "Job2" });

export const getLinkedJobs = async (job1ID) => {
  try {
    const linkedJobs = await tblLinkedJobs.findAll({
      attributes: [[Sequelize.col("Job2Details.NUMBER"), "linkedJob"]],
      include: [
        {
          model: tblJobs,
          as: "Job2Details",
          attributes: [],
          required: true,
        },
      ],
      where: {
        Job1: job1ID,
      },
    });

    return linkedJobs;
  } catch (error) {
    console.error("Error fetching Job2 linked to Job1:", error);
    throw error;
  }
};

export const getOperationDetails = async (jobID) => {
  try {
    const operationDetails = await tblJobOperations.findAll({
      attributes: [
        "uniqueID",
        "number",
        "week",
        "operation",
        "workCenter",
        "hours",
        "reworkHrs",
        "verified",
        [
          sequelize.literal(
            "(CASE WHEN tblPlan.UniqueID IS NULL THEN 1 ELSE 0 END)"
          ),
          "isRed",
        ],
      ],
      where: {
        jobID: jobID,
      },
      include: [
        {
          model: tblOperationHoursWorked,
          attributes: [
            "uniqueID",
            "startTime",
            [sequelize.literal("(fname + ' ' + lname)"), "name"],
            "hours",
          ],
          include: [
            {
              model: tblEmployee,
              attributes: [],
            },
          ],
          where: {
            jobID: jobID,
            operationID: {
              [Op.col]: "JobOperation.uniqueID",
            },
          },
        },
      ],
    });

    return operationDetails;
  } catch (error) {
    console.error("Error fetching operation details:", error);
  }
};

export const getJobOperationsWithEmployees = async (jobId, operationID) => {
  const query = `
    Select distinct tblJobOperations.*, tblPlan.UniqueID as PID 
    from tblJobOperations 
    left join tblPlan on tblJobOperations.PlanID = tblPlan.uniqueID 
    Where tblJobOperations.instanceid = :operationID 
    and jobID = :jobID 
    order by number asc
  `;
  try {
    const results = await sequelize.query(query, {
      replacements: { jobID: jobId, operationID: operationID },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error fetching data from table:", error);
    throw error;
  }
};

export const deleteJobOperation = async (uniqueID) => {
  const query = `
    DELETE FROM GrimmIS34.dbo.tblJobOperations
    WHERE uniqueID = :uniqueID;
  `;

  try {
    await sequelize.query(query, {
      replacements: { uniqueID },
      type: QueryTypes.DELETE,
    });
  } catch (error) {
    console.error("Error deleting job operation:", error);
    throw error;
  }
};

export const getOperationHoursWorked = async (operationID, jobID) => {
  const query = `
   SELECT 
    tblOperationHoursWorked.uniqueID AS UID, 
    StartTime, 
    (fname + ' ' + lname) AS Name, 
    tblOperationHoursWorked.Hours AS Hours,
    SUM(tblOperationHoursWorked.Hours) OVER() AS totalHour
FROM 
    tblOperationHoursWorked 
JOIN 
    tblEmployee 
ON 
    tblOperationHoursWorked.EmployeeID = tblEmployee.uniqueID 
WHERE 
    JobID = :jobID 
AND 
    OperationID = :operationID

  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { jobID, operationID },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const deleteOperationHoursWorked = async (uniqueID) => {
  const checkQuery = `
    SELECT 
      uniqueID 
    FROM 
      tblOperationHoursWorked 
    WHERE 
      uniqueID = :uniqueID
  `;

  const deleteQuery = `
    DELETE FROM 
      tblOperationHoursWorked 
    WHERE 
      uniqueID = :uniqueID
  `;

  try {
    const checkResult = await sequelize.query(checkQuery, {
      replacements: { uniqueID },
      type: QueryTypes.SELECT,
    });

    if (checkResult.length === 0) {
      return { message: "uniqueID does not exist" };
    }

    const deleteResult = await sequelize.query(deleteQuery, {
      replacements: { uniqueID },
      type: QueryTypes.DELETE,
    });

    return deleteResult;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getDistinctPartTypes = async () => {
  const query = `
    SELECT DISTINCT parttype 
    FROM tblBP 
    WHERE uniqueid IN (
      SELECT MAX(uniqueid) AS uniqueid 
      FROM tblBP 
      GROUP BY instanceid
    ) 
    ORDER BY parttype
  `;

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const partTypes = results.map((row) => row.parttype);

    return partTypes;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getDistinctSubCategories = async () => {
  const query = `
    SELECT DISTINCT subcategory 
    FROM tblBP 
    WHERE uniqueid IN (
      SELECT MAX(uniqueid) AS uniqueid 
      FROM tblBP 
      GROUP BY instanceid
    ) 
    ORDER BY subcategory
  `;

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
    const subcategories = results.map((row) => row.subcategory);
    return subcategories;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getUsedPart = async (filterParams) => {
  const { UniqueID, parttype, subcategory, MODEL, DESCRIPTION } = filterParams;
  let where = {};

  if (UniqueID) where["UniqueID"] = UniqueID;
  if (parttype) where["PARTTYPE"] = { [Op.eq]: parttype };
  if (subcategory) where["SUBCATEGORY"] = { [Op.eq]: subcategory };
  if (MODEL) where["MODEL"] = { [Op.like]: `%${MODEL}%` };
  if (DESCRIPTION) where["DESCRIPTION"] = { [Op.like]: `%${DESCRIPTION}%` };

  try {
    const productInfos = await tblBP.findAll({
      attributes: [
        "UniqueID",
        "instanceID",
        "PARTTYPE",
        "SUBCATEGORY",
        "MODEL",
        "DESCRIPTION",
        "OnHand",
        "PRIMARYPRICE1",
        "UNIT",
      ],
      where: {
        partflag: 1,
        ...where,
      },
      limit: 50,
      order: [["MODEL", "ASC"]],
      raw: true,
    });

    return productInfos;
  } catch (error) {
    console.error("Error fetching product info:", error);
    throw error;
  }
};

export const getPartDetails = async (jobID, operationID) => {
  const query = `
    SELECT 
      r.Qty,
      b.uniqueID AS tblBPID,
      b.model,
      b.Description,
      b.inventoryCost,
      b.inventoryUnit
    FROM 
      tblOperationReworks r
    JOIN 
      tblBP b
    ON 
      r.tblBPID = b.uniqueID
    WHERE 
      r.JobID = :jobID
    AND 
      r.OperationID = :operationID
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { jobID, operationID },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const gePartsHours = async (jobID, OperationID) => {
  const query = `
     SELECT Qty, tblBPID, model, Description, inventoryCost, inventoryUnit 
  FROM tblOperationReworks 
  JOIN tblbp ON tblOperationReworks.tblBPID = tblbp.uniqueID and tblOperationReworks.OperationID=:OperationID
  WHERE JobID = :jobID
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { jobID, OperationID },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const insertOperationRework = async (
  jobID,
  operationID,
  tblBPID,
  qty
) => {

  try {
    const sql = `INSERT INTO tblOperationReworks (JobID, OperationID, tblBPID, Qty)
                   VALUES (:JobID, :OperationID, :tblBPID, :Qty)`;
    await sequelize.query(sql, {
      replacements: {
        JobID: jobID,
        OperationID: operationID,
        tblBPID: tblBPID,
        Qty: qty,
      },
      type: QueryTypes.INSERT,
    });
  } catch (error) {
    console.error("Error inserting record:", error);
  }
};

export const getSteps = async (PlanID) => {
  const query = `
   SELECT * FROM tblSteps WHERE PLANID = :PlanID
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { PlanID },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const DeleteSteps = async (UniqueID) => {
  const query = `
   DELETE FROM tblSteps WHERE UniqueID = :UniqueID
  `;

  try {
    const [results, metadata] = await sequelize.query(query, {
      replacements: { UniqueID },
      type: QueryTypes.DELETE,
    });
    return metadata;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getSkillCategory = async () => {
  const query = `
    SELECT DISTINCT catagory FROM tblSkills
  `;

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const categories = results.map((result) => result.catagory);
    return categories;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getSkillSubCategory = async () => {
  const query = `
    SELECT DISTINCT subcatagory, '' 
FROM tblSkills;

  `;

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    const categories = results.map((result) => result.subcatagory);
    return categories;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const applyFiltersForSkill = (filterParams) => {
  let whereClause = "WHERE 1=1";

  if (filterParams.skill) {
    whereClause += " AND UniqueID LIKE :skill";
  }
  if (filterParams.Catagory) {
    whereClause += " AND Catagory = :Catagory";
  }
  if (filterParams.subcatagory) {
    whereClause += " AND subcatagory = :subcatagory";
  }

  return whereClause;
};

export const getAllSkill = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize, 10) || 10;
  const offset = (parseInt(page, 10) - 1 || 0) * limit;

  const orderColumn = sortBy || "UniqueID";
  const orderDirection = sortOrder || "ASC";

  const whereClause = applyFiltersForSkill(filterParams);

  const query = `
    SELECT *
    FROM tblSkills
    ${whereClause}
    ORDER BY ${orderColumn} ${orderDirection}
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY
  `;

  const results = await sequelize.query(query, {
    replacements: {
      offset,
      limit,
      ...filterParams,
    },
    type: QueryTypes.SELECT,
  });

  return results;
};

export const createSkill = async (data) => {
  const { Name, Catagory, subcatagory, weeks, date, courseoutline, frequency } =
    data;

  const query = `
    INSERT INTO tblSkills (Name, Catagory, courseoutline, date, subcatagory, weeks, WorkCenterID, frequency)
VALUES (:Name, :Catagory, :courseoutline, :date, :subcatagory, :weeks, '0', :frequency)

  `;

  const [result, metadata] = await sequelize.query(query, {
    replacements: {
      Name: Name,
      Catagory: Catagory,
      subcatagory: subcatagory,
      weeks: weeks,
      courseoutline: courseoutline,
      date: date,
      frequency: frequency,
    },
  });

  return result;
};

export const skillExistByID = async (id) => {
  const query = `
    SELECT TOP (1) [UniqueID]
    FROM [GrimmIS34].[dbo].[tblSkills]
    WHERE [UniqueID] = :id
  `;

  const result = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });

  return result.length > 0;
};

export const getSkillDetail = async (id) => {
  const query = `
    SELECT 
      UniqueID,
      Name,
      TrainingNotes,
      Prerequisites,
      WorkCenterID,
      weeks,
      Sort,
      Catagory,
      subcatagory,
      date,
      [by],             -- Escaping 'by' to avoid syntax error
      frequency,
      courseoutline,
      parts,
      WorkCenters,
      InstanceID
    FROM tblSkills
    WHERE UniqueID = :id
  `;

  const result = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.SELECT,
  });

  return result.length > 0 ? result[0] : null;
};

export const updateSkill = async (id, formData) => {
  const query = `
    UPDATE tblSkills
    SET
      [Name] = :Name,
      WorkCenterID = '0',  -- This is set as a static value
      weeks = :weeks,
      Catagory = :Catagory,
      subcatagory = :subcatagory,
      frequency=:frequency,
      [date] = :date,
      [by] = :by,  -- Escaping 'by' to avoid syntax error
      courseoutline = :courseoutline
    WHERE UniqueID = :id
  `;

  const [affectedRows] = await sequelize.query(query, {
    replacements: {
      id,
      Name: formData.Name,
      weeks: formData.weeks,
      Catagory: formData.Catagory,
      subcatagory: formData.subcatagory,
      date: formData.date,
      by: formData.by,
      courseoutline: formData.courseoutline,
      frequency: formData.frequency,
    },
    type: QueryTypes.UPDATE,
  });

  return affectedRows > 0;
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  const query = `
    DELETE FROM tblSkills
    WHERE UniqueID = :id
  `;

  const [affectedRows] = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.DELETE,
  });

  return affectedRows > 0;
};
