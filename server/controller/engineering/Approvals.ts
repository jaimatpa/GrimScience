import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblPlan, tblBP, tblPermissions, tblEmployee } from "~/server/models";
import sequelize from "~/server/utils/databse";

// Method to apply permissions
export const applyPermissions = async (employeeId) => {
    console.log("Employee ID:", employeeId);

    // Define the system and subsystem for permission checks
    const system = "Engineering";
    const subsystem = "Approvals";

    // Fetch permissions for the given system and subsystem
    const permissions = await tblPermissions.findOne({
        where: {
            system: system,
            subsystem: subsystem,
        },
    });

    // console.log('Permissions:', permissions)

    // If no permissions found, return restricted access
    if (!permissions) {
        return { enabled: false, message: "You are not authorized to access this part of the system." };
    }

    let accessLevel = "Restricted"; // Default access level
    let readOnly = false;
    let message = "";

    // Check for full access based on 'MenuItem' or 'FullAdminIDs'
    if (permissions.MenuItem === "Full" || permissions.FullAdminIDs.includes(employeeId)) {
        accessLevel = "Full";

        console.log("Full Access:", accessLevel);
    }
    // Check for read-only access based on 'MenuItem' or 'ReadOnlyIDs'
    else if (permissions.MenuItem === "Read Only" || permissions.ReadOnlyIDs.includes(employeeId)) {
        accessLevel = "Read Only";
        readOnly = true;
        message = "READ-ONLY ACCESS";

        console.log("Read-Only Access:", accessLevel);
    }

    // If access level is restricted, deny access
    if (accessLevel === "Restricted") {
        return { enabled: false, message: "You are not authorized to access this part of the system." };
    }

    // Return the determined permissions
    return { enabled: true, readOnly, message };
};

const applyFilters = (filterParams) => {
    let whereClause = "";

    // Example: If you want to filter by model
    if (filterParams?.model) {
        whereClause += ` AND tblBP.MODEL LIKE '%${filterParams.model}%'`;
    }

    // Add more filters as necessary based on filterParams

    return whereClause;
};

// Method to fetch approvals similar to the `setsearch` method in VB

export const getApprovals = async (page, pageSize, sortBy, sortOrder, filterParams) => {
    try {
        // Ensure page and pageSize are numbers and handle defaults
        const limit = parseInt(pageSize, 10) || 10;
        const offset = (parseInt(page, 10) - 1 || 0) * limit;
        const sortField = sortBy || "tblBP.MODEL";
        const sortDirection = sortOrder || "ASC";

        // Apply filterParams to construct a WHERE clause
        const whereClause = applyFilters(filterParams);

        // Construct the base SQL query with pagination and sorting
        const query = `
            SELECT 
                tblPlan.UniqueID, 
                tblBP.MODEL as model,
                tblJobs.UniqueID as jobId, 
                tblPlan.Number as number, 
                tblPlan.Operation as operation, 
                tblPlan.PreparedBy as preparedBy, 
                tblPlan.PreparedDate as preparedDate, 
                tblPlan.ApprovedDate as approvedDate, 
                tblPlan.instanceid as instanceID
            FROM 
                tblPlan
            INNER JOIN 
                tblBP ON tblBP.instanceID = tblPlan.instanceid
            INNER JOIN 
                tblJobs ON tblJobs.InstanceID = tblPlan.instanceid
            WHERE 
                (tblPlan.ApprovedBy IS NULL OR tblPlan.ApprovedBy = '')
                ${whereClause}
            GROUP BY 
                tblPlan.Number,
                tblPlan.UniqueID,                
                tblBP.MODEL,
                tblJobs.UniqueID,                 
                tblPlan.Operation, 
                tblPlan.PreparedBy, 
                tblPlan.PreparedDate, 
                tblPlan.ApprovedDate, 
                tblPlan.instanceid
            ORDER BY 
                ${sortField} ${sortDirection}
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;
        `;

        // Log the query and replacements to debug SQL issues
        // console.log("Generated SQL Query:", query);
        // console.log("Pagination - Offset:", offset, "Limit:", limit);

        // Execute the raw SQL query
        const results = await sequelize.query(query, {
            replacements: { offset, limit },
            type: QueryTypes.SELECT,
        });

        // Transform the results into the desired format
        const formattedResults = results.map((row) => ({
            uniqueID: row.UniqueID ?? null,
            model: row.model ?? null,
            jobId: row.jobId ?? null,
            number: row.number ?? null,
            operation: row.operation ?? null,
            preparedBy: row.preparedBy ?? null,
            preparedDate: row.preparedDate ?? null,
            approvedDate: row.approvedDate ?? null,
            instanceID: row.instanceID ?? null,
        }));

        return formattedResults;
    } catch (error) {
        console.error("Error executing SQL query:", error.message);
        console.error("Full error details:", error); // Log the full error object
        throw new Error("Error fetching data from table: " + error.message);
    }
};

export const getNumberOfApprovals = async (filterParams) => {
    try {
        // Apply filterParams to construct a WHERE clause
        const whereClause = applyFilters(filterParams);

        // Construct the base SQL query to count the number of approvals
        const query = `
            SELECT COUNT(*) as count
            FROM 
                tblPlan
            INNER JOIN 
                tblBP ON tblBP.instanceID = tblPlan.instanceid
            WHERE 
                (tblPlan.ApprovedBy IS NULL OR tblPlan.ApprovedBy = '')
                ${whereClause}
        `;

        // Execute the raw SQL query
        const result = await sequelize.query(query, {
            type: QueryTypes.SELECT,
        });

        const count = result[0]?.count ? parseInt(result[0].count, 10) : 0;
        // Return the count of approvals
        return count;
    } catch (error) {
        console.error("Error executing SQL query:", error.message);
        console.error("Full error details:", error); // Log the full error object
        throw new Error("Error fetching data from table: " + error.message);
    }
};

// Method to handle approval logic
export const approvePlan = async (uniqueID, employee) => {
    if (uniqueID === null || uniqueID === undefined || employee === null || employee === undefined) {
        throw new Error("Invalid parameters. Please provide a valid UniqueID and Employee ID.");
    }

    // console.log("Approving Plan:", uniqueID, "by Employee:", employee);

    const planRecord = await tblPlan.findOne({ where: { UniqueID: uniqueID } });

    if (!planRecord) {
        throw new Error("Record not found.");
    }

    if (planRecord.PreparedBy === employee) {
        throw new Error("You cannot approve changes you made. Please seek another qualified person to approve these changes.");
    }

    const employeeDetails = await tblEmployee.findOne({
        attributes: ["UniqueID", "PAYROLLNO", "fname", "lname"],
        where: { UniqueID: employee },
    });

    planRecord.ApprovedBy = `#${employeeDetails.PAYROLLNO} ${employeeDetails.fname} ${employeeDetails.lname}`;
    planRecord.ApprovedDate = Sequelize.fn("FORMAT", Sequelize.fn("GETDATE"), "MM/dd/yyyy");

    await planRecord.save();

    return planRecord;
};
