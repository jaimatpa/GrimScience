import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblCustomers, tblBP, tblECO } from "~/server/models";
import { tblEmployee } from "~/server/models";
import sequelize from "~/server/utils/databse";

const applyFilters = (params) => {
  const filterParams = [
    "ACTIVE",
    "DESCRIPTION",
    "REASONFORCHANGE",
    "PRODUCT",
    "uniqueID",
    "DISTRIBUTIONDATE",
  ];
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

export const getChangeOrders = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize as string, 10) || 10;
  const offset = (parseInt(page as string, 10) - 1 || 0) * limit;
  const whereClause = applyFilters(filterParams);
  const list = await tblECO.findAll({
    where: {
      ...whereClause,
    },
    order: [[(sortBy as string) || "PRODUCT", (sortOrder as string) || "DESC"]],
    offset,
    limit,
    raw: true,
  });
  console.log(list);
  return list;
};

export const getNumberOfChangeOrder = async (filterParams) => {
  const whereClauseDB = applyFilters(filterParams);
  const numberOfCustomers = await tblECO.count({
    where: whereClauseDB,
  });
  return numberOfCustomers;
};

export const getSignature = async () => {
  try {
    const signatures = await tblECO.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("SIGNATURE")), "SIGNATURE"],
      ],
    });
    const distinctSignatures = signatures.map((sig) => sig.SIGNATURE);

    return distinctSignatures;
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch employee signatures." };
  }
};

export const getEmployList = async () => {
  try {
    const employees = await tblEmployee.findAll({
      attributes: ["fname", "lname"],
      where: {
        Active: 1,
      },
      group: ["fname", "lname"],
      order: [
        ["lname", "ASC"],
        ["fname", "ASC"],
      ],
    });

    return employees.length ? employees : { error: "No employees found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch employees" };
  }
};

export const getAllChangeOrderData = async (sortBy, sortOrder, filterParams) => {

  let whereClause = {};
  let customerWhereClause = {};
  if (filterParams.COMPLAINTNUMBER)
    whereClause["COMPLAINTNUMBER"] = {
      [Op.like]: `%${filterParams.COMPLAINTNUMBER}%`,
    };
  if (filterParams.SERIALNO)
    whereClause["SERIALNO"] = { [Op.like]: `%${filterParams.SERIALNO}%` };
  if (filterParams.COMPLAINTDATE)
    whereClause[Op.and] = [
      Sequelize.where(
        Sequelize.fn("FORMAT", Sequelize.col("COMPLAINTDATE"), "MM/dd/yyyy"),
        {
          [Op.like]: Sequelize.literal(`'%${filterParams.COMPLAINTDATE}%'`),
        }
      ),
    ];
  if (filterParams.FAILINVEST)
    whereClause["FAILINVEST"] = { [Op.like]: `%${filterParams.FAILINVEST}%` };
  if (filterParams.company)
    customerWhereClause["company1"] = {
      [Op.like]: `%${filterParams.company}%`,
    };

  const list = await tblECO.findAll({
    attributes: [
      "DESCRIPTION",
      "REASONFORCHANGE",
      "PRODUCT",
      "uniqueID",
      "DISTRIBUTIONDATE"
    ],
    order: [
      [
        (sortBy as string) || "COMPLAINTNUMBER",
        (sortOrder as string) || "DESC",
      ],
    ],
    raw: true,
  });
  const formattedList = list.map((item: any) => {
    return {
      uniqueID: item.uniqueID,
      DESCRIPTION: item.DESCRIPTION,
      REASONFORCHANGE: item.REASONFORCHANGE,
      PRODUCT: item.PRODUCT,
      DISTRIBUTIONDATE: item.DISTRIBUTIONDATE,
    
    };
  });
  return formattedList;
};



export const getReasonForChangList = async () => {
  try {
    const reasons = await tblECO.findAll({
      attributes: [
        [
          Sequelize.fn("DISTINCT", Sequelize.col("reasonforchange")),
          "reasonforchange",
        ],
      ],
      order: [["reasonforchange", "ASC"]],
    });

    return reasons.length ? reasons : { error: "No reasons found" };
  } catch (error) {
    console.error("Database error:", error);
    return { error: error.message || "Failed to fetch reasons for change" };
  }
};

export const getJobOperationsById = async (params) => {
  const { uniqID } = params;
  let where = {};
  if (uniqID) where["uniqueID"] = uniqID;
  const reports = await tblECO.findAll({
    where: where,
    raw: true,
  });
  return reports;
};

// export const getChangeOrderDetail = async (id) => {
//   try {
//     const detail = await tblECO.findByPk(id, {
//       attributes: [
//         'uniqueID',
//         'DESCRIPTION',
//         'REASONFORCHANGE',
//         'DISTRIBUTIONDATE',
//       ]
//     });

//     if (!detail) {
//       throw new Error('Change order not found');
//     }
//     return detail;

//   } catch (error) {
//     console.error('Error fetching change order detail:', error);
//     throw error;
//   }
// };

// export const insertChangeOrderData = async (data) => {
//   debugger
//   const generateInsertQuery = (tableName, data) => {
//     const columns = Object.keys(data).join(", ");
//     const values = Object.values(data)
//       .map(value => typeof value === 'string' ? `'${value}'` : value)
//       .join(", ");

//     return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
//   };

//   const query = generateInsertQuery('tblECO', data);

//   try {
//     const [newCustomer] = await sequelize.query(query, { type: QueryTypes.INSERT });
//     console.log(newCustomer);
//     return newCustomer;
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     throw error;
//   }
// };

export const updateChangeOrderData3 = async (data) => {
  const formatToSQLDateTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      // If it's not a valid date, try to parse it
      date = new Date(date);
    }

    if (isNaN(date)) {
      throw new Error("Invalid date object");
    }

    const pad = (num) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const allData = {
    uniqueID: data.uniqueID,
    REASONFORCHANGE: data.REASONFORCHANGE,
    PRODUCT: data.PRODUCT,
    SOLUTION: data.SOLUTION, // Add SOLUTION
    DESCRIPTION: data.DESCRIPTION,
    DetailReason: data.DetailReason,
    FromModel: data.FromModel,
    ToModel: data.ToModel,
    PARTS: data.PARTS,
    ISSUE: data.ISSUE,
    VandVNotRequired: data.VandVNotRequired,
    ORIGINATOR: data.ORIGINATOR,
    ORIGINATORDATE: data.ORIGINATORDATE, // Ensure this is a Date object
    ENGINEERING: data.ENGINEERING,
    ENGAPPROVER: data.ENGAPPROVER,
    ENGDATEAPPROVED: data.ENGDATEAPPROVED, // Ensure this is a Date object
    ENGAPPROVAL: data.ENGAPPROVAL,
    ENGCOMMENTS: data.ENGCOMMENTS,
    MARKETING: data.MARKETING,
    MARAPPROVER: data.MARAPPROVER,
    MARDATEAPPROVED: data.MARDATEAPPROVED, // Ensure this is a Date object
    MARAPPROVAL: data.MARAPPROVAL,
    MARCOMMENTS: data.MARCOMMENTS,
    MANUFACTURING: data.MANUFACTURING,
    MANAPPROVER: data.MANAPPROVER,
    MANDATEAPPROVED: data.MANDATEAPPROVED, // Ensure this is a Date object
    MANAPPROVAL: data.MANAPPROVAL,
    MANCOMMENTS: data.MANCOMMENTS,
    SIGNATURE: data.SIGNATURE,
    DISTRIBUTIONDATE: data.DISTRIBUTIONDATE, // Ensure this is a Date object
    APPROVAL: data.APPROVAL,
    COMMENTS: data.COMMENTS,
  };

  debugger;

  try {
    // Create a new record using the tblECO model
    const newRecord = await tblECO.create(allData);
    console.log("New record created:", newRecord);
    return newRecord;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error; // Re-throw the error for further handling
  }
};

export const updateChangeOrderData = async (body) => {
  const { uniqueID, ...updatedData } = body;
  try {
    const existingRecord = await tblECO.findOne({ where: { uniqueID } });

    if (existingRecord) {
      await existingRecord.update(updatedData);
      return {
        success: true,
        message: "Record updated successfully",
        data: existingRecord,
      };
    } else {
      const newRecord = await tblECO.create(updatedData);
      return {
        success: true,
        message: "Record created successfully",
        data: newRecord,
      };
    }
  } catch (error) {
    console.error("Error in updateChangeOrderData:", error);
    return {
      success: false,
      message: "Error processing request",
      error: error.message,
    };
  }
};
