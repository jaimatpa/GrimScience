/* eslint-disable @stylistic/indent */

import { Op, Sequelize, QueryTypes } from "sequelize";
import { tblInventory, tblBP, tblOrder, tblCustomers, tblJobs } from "~/server/models";
import sequelize from "~/server/utils/databse";

// Helper function to apply filters based on the request parameters
const applySerialFilters = (params) => {
    const filterParams = ["Serial", "Status", "Customer"];
    const whereClause = {};

    filterParams.forEach((param) => {
        if (params[param]) {
            whereClause[param] = {
                [Op.like]: `%${params[param]}%`,
            };
        }
    });

    return whereClause;
};

export const getSerials = async (page, pageSize, filterParams) => {
    // Extract parameters or use default values if they are undefined
    const {
        Serial = null,
        MODEL = null,
        Status = null,
        number = null,
        customerUniqueID = null,
        productLine = null,
        state = null,
        cboCustomerNumber = null,
        customer = null,
    } = filterParams;

    // state = state ? state.trim() : null;

    // Calculate the offset for pagination
    const offset = (page - 1) * pageSize;

    try {
        // Define the raw SQL query with named parameters
        const serialDataQuery = `
            DECLARE @Serial NVARCHAR(255) = :Serial;
            DECLARE @MODEL NVARCHAR(255) = :MODEL;
            DECLARE @Status NVARCHAR(255) = :Status;
            DECLARE @number NVARCHAR(255) = :number;
            DECLARE @customerUniqueID NVARCHAR(255) = :customerUniqueID;
            DECLARE @productLine NVARCHAR(255) = :productLine;
            DECLARE @state NVARCHAR(255) = :state;
            DECLARE @cboCustomerNumber NVARCHAR(255) = :cboCustomerNumber;
            DECLARE @customer NVARCHAR(255) = :customer;
            DECLARE @pageSize INT = :pageSize;
            DECLARE @offset INT = :offset;

            SELECT *,
                (
                    SELECT TOP 1 tblBP.productline 
                    FROM tblBP 
                    WHERE tblBP.MODEL = vwSerialData.MODEL 
                    ORDER BY uniqueID DESC
                ) AS productline
            FROM [vwSerialData]
            LEFT JOIN tblCustomers ON tblCustomers.UniqueID = vwSerialData.Customer
            LEFT JOIN tblOrder ON tblOrder.UniqueID = vwSerialData.OrderID
            WHERE (vwSerialData.assetFlag = 0 OR vwSerialData.assetFlag IS NULL)
                AND (@Serial IS NULL OR vwSerialData.serial LIKE @Serial + '%')
                AND (@MODEL IS NULL OR vwSerialData.MODEL LIKE @MODEL + '%')
                AND (@Status IS NULL OR vwSerialData.status LIKE @Status + '%')
                AND (@number IS NULL OR tblCustomers.number LIKE @number + '%')
                AND (
                    @customerUniqueID IS NULL 
                    OR @customerUniqueID = '' 
                    OR vwSerialData.customer LIKE @customerUniqueID + '%' 
                    OR vwSerialData.customer IS NULL
                )
                AND (
                    @productLine IS NULL 
                    OR (
                        SELECT TOP 1 tblBP.productline 
                        FROM tblBP 
                        WHERE tblBP.MODEL = vwSerialData.MODEL 
                        ORDER BY uniqueID DESC
                    ) LIKE @productLine + '%'
                )
                AND (@state IS NULL OR tblCustomers.state LIKE @state + '%')
                AND (@cboCustomerNumber IS NULL OR tblCustomers.number LIKE @cboCustomerNumber + '%')
                AND (@customer IS NULL OR vwSerialData.customer = @customer)
            ORDER BY vwSerialData.serial DESC
            OFFSET @offset ROWS 
            FETCH NEXT @pageSize ROWS ONLY;
        `;

        // Execute the query with replacements for parameters
        const serialData = await sequelize.query(serialDataQuery, {
            replacements: {
                Serial,
                MODEL,
                Status,
                number,
                customerUniqueID,
                productLine,
                state: state ? state.trim() : null,
                cboCustomerNumber,
                customer,
                pageSize,
                offset,
            },
            type: QueryTypes.SELECT,
        });

        // Return the fetched data
        return serialData;
    } catch (error) {
        console.error("Error fetching data from table:", error);
        throw error;
    }
};


// export const getSerials = async (page, pageSize, filterParams) => {
//     const offset = (page - 1) * pageSize;

//     const query = `
//         WITH SerialData AS (
//             SELECT
//                 i.instanceID,
//                 MAX(i.uniqueid) AS uniqueid,
//                 MAX(i.Serial) AS Serial,
//                 MAX(i.Status) AS Status,
//                 MAX(i.BPID) AS BPID,
//                 MAX(i.OrderID) AS OrderID,
//                 MAX(i.Customer) AS Customer,
//                 MAX(i.Today) AS Today,
//                 MAX(i.JobID) AS JobID
//             FROM
//                 tblInventory i
//             WHERE
//                 (:Serial IS NULL OR i.Serial = :Serial) AND
//                 (:Status IS NULL OR i.Status = :Status)
//             GROUP BY
//                 i.instanceID
//         )
//         SELECT 
//             sd.uniqueid,
//             sd.instanceID,
//             sd.BPID,
//             sd.OrderID,
//             sd.Customer,
//             sd.Serial,
//             sd.Status,
//             sd.Today,
//             bp.model AS Model,
//             CONCAT('#', bp.model, ' ', bp.description) AS Description,
//             bp.PRODUCTLINE AS ProductLine,
//             ISNULL(o.invoicenumber, 'N/A') AS InvoiceNumber,
//             ISNULL(o.shipdate, 'N/A') AS ShipDate,
//             CONCAT(ISNULL(c.lname, ''), ', ', ISNULL(c.fname, ''), ' (', ISNULL(c.company1, ''), ')') AS CustomerDetails,
//             ISNULL(c.number, '') AS CustomerNumber,
//             ISNULL(c.state, '') AS CustomerState,
//             sd.JobID AS JobNumber
//         FROM 
//             SerialData sd
//         LEFT JOIN 
//             tblBP bp ON bp.UniqueID = ISNULL(NULLIF(sd.BPID, 0), 0)
//         LEFT JOIN 
//             tblOrder o ON o.UniqueID = ISNULL(NULLIF(sd.OrderID, 0), 0)
//         LEFT JOIN 
//             tblCustomers c ON c.UniqueID = ISNULL(NULLIF(sd.Customer, 0), 0)
//         LEFT JOIN 
//             tblJobs j ON j.NUMBER = sd.JobID
//         WHERE
//             (:productLine IS NULL OR bp.PRODUCTLINE = :productLine) AND
//             (:model IS NULL OR bp.model = :model) AND
//             (:number IS NULL OR c.number = :number) AND
//             (:state IS NULL OR c.state = :state)
//         ORDER BY
//             sd.Today DESC
//         OFFSET :offset ROWS
//         FETCH NEXT :pageSize ROWS ONLY;
//     `;

//     const replacements = {
//         Serial: filterParams.Serial || null,
//         Status: filterParams.Status || null,
//         model: filterParams.model || null,
//         productLine: filterParams.productLine || null,
//         number: filterParams.number || null,
//         state: filterParams.state || null,
//         offset,
//         pageSize: parseInt(pageSize),
//     };
    
    
//     console.log(replacements);
//     try {
//         const results = await sequelize.query(query, {
//             replacements,
//             type: Sequelize.QueryTypes.SELECT,
//         });
//         return results;
//     } catch (error) {
//         console.error("Error fetching serials:", error);
//         throw error;
//     }
// };

// Fetch serials with all related data without pagination
export const getAllSerials = async (filterParams) => {
    // No need for pagination parameters
    const query = `
        WITH SerialData AS (
            SELECT
                i.instanceID,
                MAX(i.uniqueid) AS uniqueid,
                MAX(i.Serial) AS Serial,
                MAX(i.Status) AS Status,
                MAX(i.BPID) AS BPID,
                MAX(i.OrderID) AS OrderID,
                MAX(i.Customer) AS Customer,
                MAX(i.Today) AS Today,
                MAX(i.JobID) AS JobID
            FROM
                tblInventory i
            WHERE
                (:Serial IS NULL OR i.Serial = :Serial) AND
                (:Status IS NULL OR i.Status = :Status)
            GROUP BY
                i.instanceID
        )
        SELECT 
            sd.uniqueid,
            sd.instanceID,
            sd.BPID,
            sd.OrderID,
            sd.Customer,
            sd.Serial,
            sd.Status,
            sd.Today,
            bp.model AS Model,
            CONCAT('#', bp.model, ' ', bp.description) AS Description,
            bp.PRODUCTLINE AS ProductLine,
            ISNULL(o.invoicenumber, 'N/A') AS InvoiceNumber,
            ISNULL(o.shipdate, 'N/A') AS ShipDate,
            CONCAT(ISNULL(c.lname, ''), ', ', ISNULL(c.fname, ''), ' (', ISNULL(c.company1, ''), ')') AS CustomerDetails,
            ISNULL(c.number, '') AS CustomerNumber,
            ISNULL(c.state, '') AS CustomerState,
            sd.JobID AS JobNumber
        FROM 
            SerialData sd
        LEFT JOIN 
            tblBP bp ON bp.UniqueID = ISNULL(NULLIF(sd.BPID, 0), 0)
        LEFT JOIN 
            tblOrder o ON o.UniqueID = ISNULL(NULLIF(sd.OrderID, 0), 0)
        LEFT JOIN 
            tblCustomers c ON c.UniqueID = ISNULL(NULLIF(sd.Customer, 0), 0)
        LEFT JOIN 
            tblJobs j ON j.NUMBER = sd.JobID
        WHERE
            (:productLine IS NULL OR bp.PRODUCTLINE = :productLine) AND
            (:model IS NULL OR bp.model = :model) AND
            (:number IS NULL OR c.number = :number) AND
            (:state IS NULL OR c.state = :state)
        ORDER BY
            sd.Today DESC;
    `;

    const replacements = {
        Serial: filterParams.Serial || null,
        Status: filterParams.Status || null,
        model: filterParams.model || null,
        productLine: filterParams.productLine || null,
        number: filterParams.number || null,
        state: filterParams.state || null,
    };

    console.log(replacements);

    try {
        const results = await sequelize.query(query, {
            replacements,
            type: Sequelize.QueryTypes.SELECT,
        });
        return results;
    } catch (error) {
        console.error("Error fetching serials:", error);
        throw error;
    }
};

// Fetch the total number of serials based on filters
export const getNumberOfSerials = async (filterParams) => {
    const whereClause = applySerialFilters(filterParams);
    const numberOfSerials = await tblInventory.count({
        where: whereClause,
        group: ["instanceID"], // Group by instanceid to get distinct entries
    });
    return numberOfSerials.length;
};

export const serialExistByID = async (id) => {
    const tableDetail = await tblInventory.findByPk(id);
    if (tableDetail) return true;
    else return false;
};

export const getSerialRevHistories = async (param) => {
    try {
        // Fetch serials from tblInventory by instanceID
        const serials = await tblInventory.findAll({
            where: { instanceID: param.instanceID },
            attributes: ["Serial", "Status", "OrderID", "Customer", "Today"],
            order: [["Today", "DESC"]],
            raw: true,
        });

        if (!serials.length) {
            throw new Error("No serials found for the provided instanceID.");
        }

        // Prepare the result array
        const result = [];

        // Iterate over each serial and fetch related order and customer details
        for (const serial of serials) {
            const serialDetail = { ...serial };

             serialDetail.revDate = new Date(serial.Today).toLocaleString("en-US", {
                 month: "2-digit",
                 day: "2-digit",
                 year: "numeric",
                 hour: "2-digit",
                 minute: "2-digit",
                 hour12: false, // use 24-hour format
             });

            // Fetch order details if OrderID exists
            if (serial.OrderID !== null && serial.OrderID > 0) {
                const order = await tblOrder.findOne({
                    where: { UniqueID: serial.OrderID },
                    attributes: ["invoicenumber"],
                    raw: true,
                });

                serialDetail.invoiceNumber = order !== null || order !== undefined ? order?.invoicenumber : null; // Add order details to serialDetail
            }
            else {
                serialDetail.invoiceNumber = null;
            }

            // Fetch customer details if Customer exists
            if (serial.Customer) {
                const customer = await tblCustomers.findOne({
                    where: { UniqueID: serial.Customer },
                    attributes: ["lname", "fname", "company1"],
                    raw: true,
                });

                serialDetail.customerDetail = customer !== null || customer !== undefined ? `${customer?.lname || ""}, ${customer?.fname || ""} (${customer?.company1 || ""})` : null; // Add customer details to serialDetail
            }
            else {
                serialDetail.customerDetail = null;
            }

            // Add the serialDetail to the result array
            result.push(serialDetail);
        }

        return result;
    } catch (error) {
        console.error("Error fetching serial details:", error.message);
        throw error;
    }
}

// Fetch detailed information for a specific serial by its ID
export const getSerialDetail = async (id) => {
    const serial = await tblInventory.findOne({
        where: { UniqueID: id },
        attributes: [
            "uniqueid",
            "Serial",
            "Status",
            "instanceID",
            "BPID",
            "Qty",
            "OrderID",
            "Customer",
            "Today",
            "JobID",
            "MasterInventoryID",
            "assetflag",
        ],
        raw: true,
    });

    if (!serial) return null;

    const bp = await tblBP.findOne({
        where: { UniqueID: serial.BPID },
        attributes: ["UniqueID", "model", "description"],
        raw: true,
    });

    const order = await tblOrder.findOne({
        where: { UniqueID: serial.OrderID },
        attributes: ["UniqueID", "invoicenumber", "shipdate"],
        raw: true,
    });

    const customer = await tblCustomers.findOne({
        where: { UniqueID: serial.Customer },
        attributes: ["UniqueID", "lname", "fname", "company1"],
        raw: true,
    });

    const job = await tblJobs.findOne({
        where: { NUMBER: serial.JobID },
        attributes: ["NUMBER"],
        raw: true,
    });

    return {
        uniqueid: serial.uniqueid,
        instanceID: serial.instanceID,
        Serial: serial.Serial,
        Status: serial.Status,
        Qty: serial.Qty,
        // Today: serial.Today,
        // Model: bp?.model || "",
        BP: bp,
        JobID: job?.NUMBER,
        Description: bp?.description || "",
        InvoiceNumber: order?.invoicenumber || "N/A",
        ShipDate: order?.shipdate || "N/A",
        Customer: customer,
        // CustomerDetail: `${customer?.lname || ""}, ${customer?.fname || ""} (${customer?.company1 || ""})`,
    };
};

export const getProductsByProductLine = async (params) => {
    console.log("Get product infos controller method Called", params);

    if (!params.productLine) {
        return []; // Return an empty array if no product line is provided
    }

    const productInfos = await tblBP.findAll({
        attributes: ["UniqueID", [Sequelize.literal("CONCAT('#', MODEL, ' ', DESCRIPTION)"), "productInfo"]],
        where: {
            PRODUCTLINE: params.productLine,
            productflag: 1,
            UniqueID: {
                [Op.in]: Sequelize.literal(`(
                    SELECT MAX(UniqueID) 
                    FROM tblBP 
                    GROUP BY instanceID
                )`),
            },
        },
        order: [["MODEL", "ASC"]],
        raw: true,
    });

    return productInfos;
};

export const getJobs = async () => {
    try {
        // Fetch job numbers from tblJobs where dateClosed is empty
        const jobs = await tblJobs.findAll({
            attributes: ["number"],
            where: {
                dateClosed: {
                    [Op.eq]: "", // Filter where dateClosed is empty
                },
            },
            order: [["number", "ASC"]],
            raw: true,
        });
        return jobs;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
};

// Validate Serial
export const validateSerial = async (serial) => {
    const duplicateSerialCount = await tblInventory.count({
        where: { serial },
    });

    if (duplicateSerialCount > 0) {
        throw new Error("Duplicate Serial Detected. Please review this serial number as it is already in the system.");
    }
};

// Generate New InstanceID
const generateNewInstanceID = async () => {
    const maxInstanceID = await tblInventory.max("instanceID");

    // Explicitly check if maxInstanceID is a number
    const maxID = typeof maxInstanceID === "number" ? maxInstanceID : 0;

    return maxID + 1;
};

export const removeFromInventory = async (instanceID, status, bpid) => {
    // Check if status is 'Inventory'
    if (status !== "Inventory") {
        return;
    }

    // Check for Inventory status count using raw query
    const [inventoryCountResult] = await sequelize.query(
        `SELECT COUNT(uniqueid) as count FROM tblInventory WHERE instanceID = ? AND status = 'Inventory'`,
        {
            replacements: [instanceID],
            type: QueryTypes.SELECT,
        }
    );

    if (inventoryCountResult.count !== 1) {
        return;
    }

    // Fetching parts details using raw query
    const parts = await sequelize.query(
        `SELECT tblBP.uniqueid, tblBPParts.qty, tblBP.model, tblBP.description 
     FROM tblBP 
     INNER JOIN tblBPParts ON tblBP.uniqueid = tblBPParts.partid 
     INNER JOIN tblSteps ON tblSteps.uniqueid = tblBPParts.stepid 
     INNER JOIN tblPlan ON tblPlan.uniqueid = tblSteps.planid 
     WHERE tblPlan.instanceID IN (SELECT instanceID FROM tblBP WHERE uniqueid = ?)`,
        {
            replacements: [bpid],
            type: QueryTypes.SELECT,
        }
    );

    for (const part of parts) {
        // Fetching partInstanceID using raw query
        const [partInstanceID] = await sequelize.query(`SELECT instanceID FROM tblBP WHERE uniqueid = ?`, {
            replacements: [part.uniqueid],
            type: QueryTypes.SELECT,
        });

        if (!partInstanceID) {
            continue;
        }

        // Fetching latestBP using raw query
        const [latestBP] = await sequelize.query(
            `SELECT uniqueid 
       FROM tblBP 
       WHERE instanceID = ? 
       AND uniqueid IN (SELECT MAX(uniqueid) FROM tblBP GROUP BY instanceID)`,
            {
                replacements: [partInstanceID.instanceID],
                type: QueryTypes.SELECT,
            }
        );

        if (!latestBP) {
            continue;
        }

        // Update on-hand inventory using raw query
        await sequelize.query(`UPDATE tblBP SET onhand = onhand - ? WHERE uniqueid = ?`, {
            replacements: [part.qty, latestBP.uniqueid],
            type: QueryTypes.UPDATE,
        });

        // Fetch updatedBP using raw query
        const [updatedBP] = await sequelize.query(`SELECT onhand, model FROM tblBP WHERE uniqueid = ?`, {
            replacements: [latestBP.uniqueid],
            type: QueryTypes.SELECT,
        });

        if (updatedBP.onhand < 0) {
            throw new Error(`You currently have a negative amount of #${updatedBP.model} within your inventory. You may need to make an adjustment.`);
        }
    }
};

// Create Serial
export const createSerial = async (serialData) => {
    const serial = serialData.serialSerial;
    const qty = serialData.serialQuantity;
    const count = 1;
    const status = serialData.serialStatus;
    const jobId = serialData.serialJob;
    // let today = new Date();
    let code;
    const bpid = parseInt(serialData.bpid) || null;
    const instanceID = parseInt(serialData.instanceID);
    const customerId = parseInt(serialData.serialCustomer.UniqueID) || null;

    console.log("value set in controller method");

    try {
        // Validate serial
        await validateSerial(serial);

        console.log("serial validated");

        // Set quantity and count
        const validQty = qty || 1;
        const validCount = count > 0 ? count : 1;
        let newSerial = serial.trim();
        let newInstanceID = instanceID;

        const formatTodayDate = () => {
            return Sequelize.fn("FORMAT", Sequelize.fn("GETDATE"), "yyyy-MM-dd HH:mm:ss");
        };

        // Loop to create multiple entries if count > 1
        for (let i = 1; i <= validCount; i++) {

            const serialCode = code || "I";

            // Fetch max instanceID and increment by 1
            newInstanceID = await generateNewInstanceID();

            console.log("InstanceID generated", newInstanceID);

            // Create new serial entry in tblInventory
            const createData = {
                Serial: newSerial,
                BPID: bpid,
                Qty: validQty,
                instanceID: newInstanceID,
                Status: status,
                Today: formatTodayDate(),
                Code: serialCode,
                JobID: jobId,
                Customer: customerId,
            };

            // Create new serial entry in tblInventory
            await tblInventory.create(createData);

            // Update the serial number for the next loop iteration (if any)
            // if (validCount > 1) {
            //     // Logic to increment serial number
            //     let prefix = newSerial.length > 1 ? newSerial.charAt(0) : "";
            //     if (prefix !== "0") {
            //         prefix = "";
            //     }
            //     newSerial = prefix + (parseInt(newSerial.slice(1), 10) + 1).toString();
            // }

            // Perform inventory update/removal
            await removeFromInventory(newInstanceID, status, bpid);
        }

        return { success: true, message: "Serial(s) created successfully." };
    } catch (error) {
        console.error("Error creating serial:", error.message);
        throw error;
    }
};

export const updateSerial = async (serialData) => {

    const Serial = serialData.Serial;
    const InstanceID = serialData.instanceID;
    const Status = serialData.Status;
    const BPID = serialData.BPID;
    const Orderid = serialData.OrderID;
    const Customer = serialData.Customer;
    const Today = Sequelize.fn("FORMAT", Sequelize.fn("GETDATE"), "yyyy-MM-dd HH:mm:ss"); // Current date
    const Code = "R";
    const Qty = serialData.Qty;
    const JobID = serialData.JobID;
    const MasterInventoryID = serialData.MasterInventoryID;
    const assetFlag = serialData.assetFlag;

    let newInstanceID;

    if (!InstanceID) {
        newInstanceID = generateNewInstanceID();
    }

    // Create a new inventory record
    await tblInventory.create({
        Serial: Serial,
        instanceID: InstanceID ? InstanceID : newInstanceID,
        BPID: BPID,
        Today: Today,
        Status: Status,
        OrderID: Orderid,
        Customer: Customer,
        Code: Code,
        Qty: Qty,
        JobID: JobID,
        MasterInventoryID: MasterInventoryID,
        assetFlag: assetFlag
        // Add other fields as required
    });

    // 6. Remove from inventory (invoke your removeFromInventory function)
    await removeFromInventory(InstanceID, Status, BPID);
};

export const deleteSerial = async (id) => {
    const serial = await tblInventory.findOne({
        where: { UniqueID: id },
        attributes: [
            // "uniqueid",
            "Serial",
            "Status",
            "instanceID",
            "BPID",
            "Qty",
            "OrderID",
            "Customer",
            "Code",
            "Today",
            "JobID",
            "MasterInventoryID",
            "assetflag",
        ],
        raw: true,
    });

    if (!serial) return null;

    let newSerial = serial;

    // Set values
    newSerial.Code = "O";
    newSerial.Today = Sequelize.fn("FORMAT", Sequelize.fn("GETDATE"), "yyyy-MM-dd HH:mm:ss"); // Current date

    if (!newSerial.instanceID) {
        newSerial.instanceID = generateNewInstanceID();
    }

    // Entry on database

    await tblInventory.create(newSerial);

    return serial;
};

export const returnToInventory = async (serialData) => {
    // 1. Check if quantity is provided
    if (serialData.Qty <= 0) {
        throw new Error("Quantity not provided. Please do so and retry." );
    }
    else {
        const Serial = serialData.Serial;
        const InstanceID = serialData.instanceID;
        const Status = "Inventory";
        const BPID = serialData.BPID;
        const Orderid = 0;
        const Customer = 0;
        const Today = Sequelize.fn("FORMAT", Sequelize.fn("GETDATE"), "yyyy-MM-dd HH:mm:ss"); // Current date
        const Code = "R";
        const Qty = serialData.Qty;
        const JobID = serialData.JobID;

        // Create a new inventory record
        await tblInventory.create({
            Serial: Serial,
            instanceID: InstanceID,
            BPID: BPID,
            Today: Today,
            Status: Status,
            OrderID: Orderid,
            Customer: Customer,
            Code: Code,
            Qty: Qty,
            JobID: JobID,
            // Add other fields as required
        });

        // 6. Remove from inventory (invoke your removeFromInventory function)
        await removeFromInventory(InstanceID, Status, BPID);
    }
};
