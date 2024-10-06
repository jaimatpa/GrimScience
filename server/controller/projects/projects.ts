import { Op, QueryTypes } from "sequelize";
import { col } from "sequelize";

import Sequelize from "sequelize/lib/sequelize";
import models from "~/server/api/jobs/models";
import skill from "~/server/api/projects/skill";
import category from "~/server/api/projects/skill/category";
import tbl from "~/server/api/tbl";
import {
  tblBP,
  tblEmployee,
  tblJobDetail,
  tblJobOperations,
  tblLinkedJobs,
  tblOperationHoursWorked,
  tblSkills,
} from "~/server/models";
import tblJobs from "~/server/models/tblJobs";
import sequelize from "~/server/utils/databse";

const applyFilters = (params) => {
  console.log("Received params:", params);

  const filterParams = [
    "UniqueID",
    "NUMBER",
    "QUANTITY",
    "MODEL",
    "PerType",
    "DATEOPENED",
    "DATECLOSED",
    "PercentageComplete",
    "Catagory",
    "SubCatagory",
    "Cost",
    "jobcat",
    "jobsubcat",
    "ProductionDate",
    "projectType",
  ];
  const whereClause = {};

  filterParams.forEach((param) => {
    if (params[param]) {
      whereClause[param] = {
        [Op.like]: `%${params[param]}%`,
      };
    }
  });

  // Update this to use 'selectedOptions' if that's the key you're filtering by
  if (params.selectedOptions) {
    whereClause["projectType"] = {
      [Op.like]: `%${params.selectedOptions}%`, // Adjust the field if needed
    };
  }

  return whereClause;
};

export const getAllProject = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  try {
    const limit = parseInt(pageSize, 10) || 10;
    const offset = (parseInt(page, 10) - 1 || 0) * limit;

    const whereClause = applyFilters(filterParams);
    console.log("Generated whereClause:", whereClause);

    const list = await tblJobs.findAll({
      attributes: [
        "UniqueID",
        "NUMBER",
        "QUANTITY",
        "MODEL",
        "PerType",
        "DATEOPENED",
        "DATECLOSED",
        "PercentageComplete",
        "Catagory",
        "SubCatagory",
        "Cost",
        "jobcat",
        "jobsubcat",
        "ProductionDate",
        "projectType",
      ],
      where: whereClause,
      order: [[sortBy || "UniqueID", sortOrder || "ASC"]],
      offset,
      limit,
    });

    return list;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
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
        parttype: partTypeValue, // Ensure this field name is correct
      },
      order: [["subcategory", "ASC"]],
    });

    return subcategories.map((subcategory) => subcategory.get("subcategory")); // Use `get` method to retrieve value
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export async function getBasicModels(parttype, subCategory) {
  try {
    const results = await tblBP.findAll({
      attributes: ["UniqueID", "instanceID", "description", "model"], // Include both description and model
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
      instanceID: result.get("instanceID")
    }));
  } catch (error) {
    console.error("Error executing basic query:", error);
  }
}


export const getProjectItem = async (category) => {
  try {
    // Create the whereClause based on the category parameter
    const whereClause = category ? { Catagory: category } : {};

    const list = await tblJobs.findAll({
      attributes: ["UniqueID", "NUMBER"], // Include JobID and PART
      where: whereClause,
    });

    // Map the results to return objects containing JobID and PART
    return list.map((result) => ({
      JobID: result.get("UniqueID"),
      NUMBER: result.get("NUMBER"),
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw new Error("An error occurred while fetching the jobs.");
  }
};

export const createProject = async (data) => {
  const fullname = `${data.lname}, ${data.fname}`;

  const newJob = await tblJobs.create(data);
  return newJob;
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
    console.log("Fetching data for JobID:", id);

    // Await the result of the asynchronous operation
    const data = await tblJobDetail.findAll({
      where: { JobID: id },
      attributes: ["Quantity", "dateEntered"], // Select only the desired attributes
    });

    console.log("data a is", data);
    return data; // Returns only the selected attributes for the matching records
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
    const result = await tblJobs.max("UniqueID"); // Use 'UniqueID' for fetching max value
    return result || 0; // Return 0 if no rows exist
  } catch (error) {
    console.error(`Error getting max job ID: ${error.message}`);
    throw new Error(`Error getting max job ID: ${error.message}`);
  }
};
export const insertJobDetails = async (jobDetails, maxId) => {
  // Log the incoming job details
  console.log("Job details:", jobDetails);

  try {
    // Check if jobDetails is an array
    if (!Array.isArray(jobDetails)) {
      throw new Error("Invalid jobDetails format: Expected an array.");
    }

    // Update each job detail with the new JobID
    const updatedJobDetails = jobDetails.map((detail) => ({
      ...detail,
      JobID: maxId, // Add the JobID to each detail
    }));

    // Log the updated job details
    console.log("Updated job details:", updatedJobDetails);

    // Delete existing job details for the same JobID
    await tblJobDetail.destroy({
      where: { JobID: maxId },
    });

    console.log(
      `Existing job details with JobID ${maxId} deleted successfully`
    );

    // Use bulkCreate to insert all job details at once
    await tblJobDetail.bulkCreate(updatedJobDetails);

    console.log("Job details inserted successfully");
  } catch (error) {
    // Log and throw the error if something goes wrong
    console.error("Error inserting job details:", error);
    throw new Error(`Error inserting job details: ${error.message}`);
  }
};

export const insertLinkedJob = async (projectItemList, id) => {
  try {
    console.log("project list is", projectItemList);
    if (projectItemList.length > 0) {
      // Map the projectItemList to include JobID in each detail
      const updatedJobDetails = projectItemList.map((detail) => ({
        Job1: id, // Add the JobID to each detail
        Job2: detail.value,
      }));

      // Perform bulk insert
      await tblLinkedJobs.bulkCreate(updatedJobDetails);

      console.log("Jobs inserted successfully.");
    } else {
      console.warn("Project item list is empty.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error inserting linked job:", error.message || error);
    return { success: false, error: error.message || "An error occurred" };
  }
};

// Temporarily define associations
tblJobs.hasMany(tblLinkedJobs, { as: "Job1Details", foreignKey: "Job1" });
tblJobs.hasMany(tblLinkedJobs, { as: "Job2Details", foreignKey: "Job2" });

tblLinkedJobs.belongsTo(tblJobs, { as: "Job1Details", foreignKey: "Job1" });
tblLinkedJobs.belongsTo(tblJobs, { as: "Job2Details", foreignKey: "Job2" });

// Perform your query with associations
export const getLinkedJobs = async (job1ID) => {
  try {
    const linkedJobs = await tblLinkedJobs.findAll({
      attributes: [[Sequelize.col("Job2Details.NUMBER"), "linkedJob"]],
      include: [
        {
          model: tblJobs,
          as: "Job2Details",
          attributes: [], // Include only necessary attributes
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
              attributes: [], // No need to select Employee fields explicitly
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

const getJobOperationsWithEmployees = async (jobId) => {
  console.log("job id is a", jobId);
  const query = `
SELECT 
    uniqueID,
    JobID,
    PlanID,
    instanceid,
    Operation,
    WorkCenter,
    Hours,
    Number,
    week,
    reworkhrs,
    verified,
    verifiedby,
    reworkparts
FROM GrimmIS34.dbo.tblJobOperations
WHERE JobID = :jobId;

`;

  try {
    const results = await sequelize.query(query, {
      replacements: { jobId },
      type: QueryTypes.SELECT,
    });

    return results;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // rethrow the error if you want it to propagate
  }
};


export const deleteJobOperation = async (uniqueID) => {
  console.log("Deleting job operation with uniqueID:", uniqueID);

  const query = `
    DELETE FROM GrimmIS34.dbo.tblJobOperations
    WHERE uniqueID = :uniqueID;
  `;

  try {
    await sequelize.query(query, {
      replacements: { uniqueID },
      type: QueryTypes.DELETE, // use DELETE type here
    });

    console.log("Successfully deleted job operation.");
  } catch (error) {
    console.error("Error deleting job operation:", error);
    throw error; // rethrow the error if you want it to propagate
  }
};



export default getJobOperationsWithEmployees;

export const getOperationHoursWorked = async (operationID, jobID) => {
  console.log("opera id is", operationID);
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
      type: QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}




export const deleteOperationHoursWorked = async (uniqueID) => {
  console.log("unique id is", uniqueID);
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
    // Check if the uniqueID exists
    const checkResult = await sequelize.query(checkQuery, {
      replacements: { uniqueID },
      type: QueryTypes.SELECT
    });

    if (checkResult.length === 0) {
      return { message: 'uniqueID does not exist' };
    }

    // Proceed to delete if the uniqueID exists
    const deleteResult = await sequelize.query(deleteQuery, {
      replacements: { uniqueID },
      type: QueryTypes.DELETE
    });

    return deleteResult;
  } catch (error) {
    console.error('Error executing query:', error);
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
      type: QueryTypes.SELECT
    });

    // Map results to an array of parttypes
    const partTypes = results.map(row => row.parttype);

    return partTypes;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}


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
      type: QueryTypes.SELECT
    });
    const subcategories = results.map(row => row.subcategory);
    return subcategories;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


export const getUsedPart = async (filterParams) => {
  console.log("Parameters for part:", filterParams);
  const { UniqueID, parttype, subcategory, MODEL, DESCRIPTION } = filterParams;
  let where = {};

  // Build the 'where' clause based on provided filter parameters
  if (UniqueID) where['UniqueID'] = UniqueID;
  if (parttype) where['PARTTYPE'] = { [Op.eq]: parttype };
  if (subcategory) where['SUBCATEGORY'] = { [Op.eq]: subcategory };
  if (MODEL) where['MODEL'] = { [Op.like]: `%${MODEL}%` };
  if (DESCRIPTION) where['DESCRIPTION'] = { [Op.like]: `%${DESCRIPTION}%` };

  console.log("Where Clause:", where);

  try {
    const productInfos = await tblBP.findAll({
      attributes: [
        'UniqueID',
        'instanceID',
        'PARTTYPE',
        'SUBCATEGORY',
        'MODEL',
        'DESCRIPTION',
        'OnHand',
        'PRIMARYPRICE1',
        'UNIT'
      ],
      where: {
        partflag: 1,
        ...where,
      },
      limit: 50,
      order: [['MODEL', 'ASC']],
      raw: true,
    });

    return productInfos;
  } catch (error) {
    console.error("Error fetching product info:", error);
    throw error; // Rethrow the error after logging it
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
      type: QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


export const gePartsHours = async (jobID) => {
  const query = `
     SELECT Qty, tblBPID, model, Description, inventoryCost, inventoryUnit 
  FROM tblOperationReworks 
  JOIN tblbp ON tblOperationReworks.tblBPID = tblbp.uniqueID and tblOperationReworks.OperationID=0
  WHERE JobID = :jobID
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { jobID },
      type: QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


export const insertOperationRework = async (jobID, operationID, tblBPID, qty) => {
  try {
    const sql = `INSERT INTO tblOperationReworks (JobID, OperationID, tblBPID, Qty)
                   VALUES (:JobID, 0, :tblBPID, :Qty)`;
    await sequelize.query(sql, {
      replacements: { JobID: jobID, OperationID: operationID, tblBPID: tblBPID, Qty: qty },
      type: QueryTypes.INSERT
    });
    console.log('Record inserted successfully.');
  } catch (error) {
    console.error('Error inserting record:', error);
  }
}


export const getSteps = async (PlanID) => {
  const query = `
   SELECT * FROM tblSteps WHERE PLANID = :PlanID
  `;

  try {
    const results = await sequelize.query(query, {
      replacements: { PlanID },
      type: QueryTypes.SELECT
    });
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};


export const DeleteSteps = async (UniqueID) => {
  console.log("unisss", UniqueID);
  const query = `
   DELETE FROM tblSteps WHERE UniqueID = :UniqueID
  `;

  try {
    const [results, metadata] = await sequelize.query(query, {
      replacements: { UniqueID },
      type: QueryTypes.DELETE
    });
    return metadata; // metadata will contain information about the affected rows
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};




export const getSkillCategory = async () => {
  const query = `
    SELECT DISTINCT catagory FROM tblSkills
  `;

  try {
    const results = await sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    // Extracting the 'catagory' values from the result set
    const categories = results.map(result => result.catagory);
    return categories;
  } catch (error) {
    console.error('Error executing query:', error);
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
      type: QueryTypes.SELECT
    });
    // Extracting the 'catagory' values from the result set
    const categories = results.map(result => result.subcatagory);
    return categories;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

const applyFiltersForSkill = (filterParams) => {
  let whereClause = 'WHERE 1=1'; // Default clause to handle empty filters

  if (filterParams.skill) {
    whereClause += ' AND UniqueID LIKE :skill';  // Assumes you handle this parameter with wildcards elsewhere
  }
  if (filterParams.Catagory) {
    whereClause += ' AND Catagory = :Catagory';
  }
  if (filterParams.subcatagory) {
    whereClause += ' AND subcatagory = :subcatagory';
  }

  return whereClause;
};



export const getAllSkill = async (page, pageSize, sortBy, sortOrder, filterParams) => {
  console.log("filterParams", filterParams);

  // Parse and set pagination values
  const limit = parseInt(pageSize, 10) || 10;
  const offset = ((parseInt(page, 10) - 1) || 0) * limit;

  // Set default sorting options
  const orderColumn = sortBy || 'UniqueID';
  const orderDirection = sortOrder || 'ASC';

  // Generate the WHERE clause using applyFiltersForSkill
  const whereClause = applyFiltersForSkill(filterParams);

  // Raw query for fetching data with pagination and sorting (SQL Server syntax)
  const query = `
    SELECT *
    FROM tblSkills
    ${whereClause}
    ORDER BY ${orderColumn} ${orderDirection}
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY
  `;

  console.log("Generated Query:", query); // Log the query for debugging
  console.log("Replacements:", {
    offset,
    limit,
    ...filterParams
  }); // Log the replacements for debugging

  // Execute the raw query with replacements
  const results = await sequelize.query(query, {
    replacements: {
      offset,
      limit,
      ...filterParams
    },
    type: QueryTypes.SELECT,
  });

  return results;
};

export const createSkill = async (data) => {
  const { Name, Catagory, subcatagory, weeks, date, courseoutline, frequency } = data; // Assuming these are the fields in tblSkills

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
      frequency: frequency
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
    replacements: { id }, // Parameter binding to prevent SQL injection
    type: QueryTypes.SELECT
  });

  // If result is an empty array, the record doesn't exist
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
    replacements: { id }, // Parameter binding to prevent SQL injection
    type: QueryTypes.SELECT
  });

  // If result is an empty array, the record doesn't exist
  return result.length > 0 ? result[0] : null;
};

export const updateSkill = async (id, formData) => {
  console.log("skills are", formData);

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
      by: formData.by,  // Ensure 'by' is included in formData if needed
      courseoutline: formData.courseoutline,
      frequency: formData.frequency
    },
    type: QueryTypes.UPDATE
  });

  return affectedRows > 0; // Return true if the update was successful, otherwise false
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  console.log('delete id is', id);

  const query = `
    DELETE FROM tblSkills
    WHERE UniqueID = :id
  `;

  const [affectedRows] = await sequelize.query(query, {
    replacements: { id },
    type: QueryTypes.DELETE
  });

  return affectedRows > 0; // Return true if the deletion was successful, otherwise false
};