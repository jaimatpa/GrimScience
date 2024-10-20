import { ModelLinkClass } from "@bryntum/gantt";
import { Op, QueryTypes, Sequelize } from "sequelize";
import { tblAccounts, tblBP, tblVendors } from "~/server/models";
import sequelize from "~/server/utils/databse";

export const getProductLines = async () => {
  const distinctProductInfos = await tblBP.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("PRODUCTLINE")), "PRODUCTLINE"],
    ],
    where: {
      [Op.and]: [
        { PRODUCTLINE: { [Op.ne]: null } },
        { PRODUCTLINE: { [Op.ne]: "" } },
      ],
    },
    order: [["PRODUCTLINE", "ASC"]],
  });

  const productLineValues = distinctProductInfos.map((result) =>
    result.get("PRODUCTLINE")
  );

  return productLineValues;
};

export const getProductCategories = async (filterParams) => {
  const { productline, partflag } = filterParams;
  let where = {};
  if (productline) where["PRODUCTLINE"] = productline;
  if (partflag) where["partflag"] = partflag;
  const distinctProductCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("PARTTYPE")), "PARTTYPE"],
    ],
    where: {
      [Op.and]: [
        { PARTTYPE: { [Op.ne]: null } },
        { PARTTYPE: { [Op.ne]: "" } },
      ],
      ...where,
    },
    order: [["PARTTYPE", "ASC"]],
  });

  const productLineValues = distinctProductCategories.map((result) =>
    result.get("PARTTYPE")
  );

  return productLineValues;
};

export const getProductSubCategories = async (filterParams) => {
  const { productline, category, partflag } = filterParams;
  let where = {};
  if (productline !== undefined) where["PRODUCTLINE"] = productline;
  if (category !== undefined) where["PARTTYPE"] = category;
  if (partflag) where["partflag"] = partflag;
  const distinctProductSubCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("SUBCATEGORY")), "SUBCATEGORY"],
    ],
    where: {
      [Op.and]: [
        { SUBCATEGORY: { [Op.ne]: null } },
        { SUBCATEGORY: { [Op.ne]: "" } },
      ],
      ...where,
    },
    order: [["SUBCATEGORY", "ASC"]],
  });

  const productLineValues = distinctProductSubCategories.map((result) =>
    result.get("SUBCATEGORY")
  );

  return productLineValues;
};

export const getCategoryList = async () => {
  const partCategories = await tblBP.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("PARTTYPE")), "PARTTYPE"],
    ],
    order: [["PARTTYPE", "ASC"]],
  });

  return partCategories
    .map((item) => item.PARTTYPE)
    .filter((category) => category !== null && category.trim() !== "");
};

export const getSubCategoryForCategory = async (category) => {
  const decodedCategory = decodeURIComponent(category);

  const subcategoryList = await tblBP.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("SUBCATEGORY")), "SUBCATEGORY"],
    ],
    where: {
      PARTTYPE: decodedCategory,
    },
    order: [["SUBCATEGORY", "ASC"]],
    raw: true,
  });

  return subcategoryList
    .map((item) => item.SUBCATEGORY)
    .filter((subcategory) => subcategory !== null && subcategory.trim() !== "");
};

export const getProductInfos = async (params) => {
  const { productline, category, subcategory, model, stock } = params;
  let whereClause = {
    [Op.and]: [
      { PRIMARYPRICE1: { [Op.ne]: null } },
      { PRIMARYPRICE1: { [Op.ne]: "" } },
    ],
  };
  if (productline) {
    whereClause["PRODUCTLINE"] = productline;
  } else return [];
  if (category) {
    whereClause["PARTTYPE"] = category;
  }
  if (subcategory) {
    whereClause["SUBCATEGORY"] = subcategory;
  }
  const productInfos = await tblBP.findAll({
    attributes: [
<<<<<<< HEAD
      'UniqueID',
      'PRODUCTLINE',
      'PARTTYPE',
      'SUBCATEGORY',
      'PRIMARYPRICE1',
      'DESCRIPTION',
      'InventoryCost',
      'InventoryUnit'
=======
      "UniqueID",
      "PRODUCTLINE",
      "PARTTYPE",
      "SUBCATEGORY",
      "PRIMARYPRICE1",
      "DESCRIPTION",
      "InventoryCost",
      "InventoryUnit",
>>>>>>> dev
    ],
    where: whereClause,
    limit: 50,
    order: [
      ["PRODUCTLINE", "ASC"],
      ["PARTTYPE", "ASC"],
      ["SUBCATEGORY", "ASC"],
    ],
  });

  return productInfos;
};

export const getParts = async (filterParams) => {
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams;
  let where = {};
  if (UniqueID) where["UniqueID"] = UniqueID;
  if (PARTTYPE) where["PARTTYPE"] = PARTTYPE;
  if (SUBCATEGORY) where["SUBCATEGORY"] = SUBCATEGORY;
  if (MODEL) where["MODEL"] = { [Op.like]: `%${MODEL}%` };
  if (DESCRIPTION) where["DESCRIPTION"] = { [Op.like]: `%${DESCRIPTION}%` };

  const productInfos = await tblBP.findAll({
    attributes: [
<<<<<<< HEAD
      'UniqueID',
      'instanceID',
      'PARTTYPE',
      'SUBCATEGORY',
      'MODEL',
      'DESCRIPTION',
      'OnHand',
      'PRIMARYPRICE1',
      'UNIT',
      'InventoryCost',
      'InventoryUnit'
=======
      "UniqueID",
      "instanceID",
      "PARTTYPE",
      "SUBCATEGORY",
      "MODEL",
      "DESCRIPTION",
      "OnHand",
      "PRIMARYPRICE1",
      "UNIT",
      "InventoryCost",
      "InventoryUnit",
>>>>>>> dev
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
};

export const getDistinctParts = async (filterParams) => {
  const { UniqueID, PARTTYPE, SUBCATEGORY, MODEL, DESCRIPTION } = filterParams;
  let where = {};
  if (UniqueID) where["UniqueID"] = UniqueID;
  if (PARTTYPE) where["PARTTYPE"] = PARTTYPE;
  if (SUBCATEGORY) where["SUBCATEGORY"] = SUBCATEGORY;
  if (MODEL) where["MODEL"] = { [Op.like]: `%${MODEL}%` };
  if (DESCRIPTION) where["DESCRIPTION"] = { [Op.like]: `%${DESCRIPTION}%` };

  const getDistinctByModelNumber = (data) => {
    const uniquePrices = new Map();

    data.forEach((item) => {
      if (!uniquePrices.has(item.MODEL)) {
        uniquePrices.set(item.MODEL, item);
      }
    });

    return Array.from(uniquePrices.values());
  };

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
    // limit: 50,
    order: [["MODEL", "ASC"]],
    raw: true,
  });

  const distinctFilteredData = getDistinctByModelNumber(productInfos);

  return distinctFilteredData;
};

export const getAllParts = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const limit = parseInt(pageSize, 10) || 50;
  const offset = (parseInt(page, 10) - 1 || 0) * limit;

  const whereClause = applyPartFilters(filterParams);

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
      "ETLCriticalComponent",
    ],
    where: {
      partflag: 1,
      ...whereClause,
    },
    order: [[sortBy || "MODEL", sortOrder || "ASC"]],
    offset,
    limit,
    raw: true,
  });

  return productInfos;
};

const applyPartFilters = (params) => {
  const filterParams = [
    "UniqueID",
    "PARTTYPE",
    "SUBCATEGORY",
    "MODEL",
    "DESCRIPTION",
    "OnHand",
    "ETLCriticalComponent",
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

export const getNumberOfParts = async (filterParams) => {
  const whereClause = applyPartFilters(filterParams);

  const numberOfParts = await tblBP.count({
    where: {
      partflag: 1,
      ...whereClause,
    },
  });

  return numberOfParts;
};

export const PartsExistByID = async (id) => {
  try {
    const count = await tblBP.count({
      where: { UniqueID: id },
    });
    return count > 0;
  } catch (error) {
    console.error("Error checking if part exists:", error);
    throw error;
  }
};

export const getPartsDetail = async (id) => {
  try {
    const part = await tblBP.findOne({
      where: { UniqueID: id },
    });
    return part;
  } catch (error) {
    console.error("Error fetching part details:", error);
    throw error;
  }
};

const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000`;
};

export const updateParts = async (id, updateData) => {
  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (
      updateData[key] !== null &&
      updateData[key] !== undefined &&
      key !== "UniqueID"
    ) {
      acc[key] = updateData[key];
    }
    return acc;
  }, {});

  try {
    if (Object.keys(filteredData).length === 0) {
      return;
    }

    const setClause = Object.keys(filteredData)
      .map((key) => `[${key}] = :${key}`)
      .join(", ");

    const sql = `
      UPDATE [GrimmIS34].[dbo].[tblBP]
      SET ${setClause}
      WHERE [UniqueID] = :UniqueID
    `;

    const [results, metadata] = await sequelize.query(sql, {
      replacements: {
        UniqueID: id,
        ...filteredData,
      },
      type: QueryTypes.UPDATE,
    });

    return metadata > 0 ? id : null;
  } catch (error) {
    console.error("Error updating parts:", error);
    throw error;
  }
};

export const createParts = async (data: any) => {
  const filteredData = Object.keys(data).reduce((acc, key) => {
    if (data[key] !== null && data[key] !== undefined) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  const columns = Object.keys(filteredData).join(", ");
  const values = Object.keys(filteredData)
    .map((key) => `:${key}`)
    .join(", ");

  let instanceID;
  try {
    const [result] = await sequelize.query(
      `SELECT ISNULL(MAX(instanceID), 0) + 1 AS newInstanceID FROM [GrimmIS34].[dbo].[tblBP]`,
      { type: QueryTypes.SELECT }
    );
    instanceID = result.newInstanceID;
  } catch (error) {
    console.error("Error fetching next instanceID:", error);
    throw error;
  }

  try {
    const sql = `
      INSERT INTO [GrimmIS34].[dbo].[tblBP] (instanceID, ${columns})
      VALUES (:instanceID, ${values});
    `;

    filteredData.instanceID = instanceID;

    const [results] = await sequelize.query(sql, {
      replacements: filteredData,
      type: QueryTypes.INSERT,
    });

    const newId = results[0];
    return newId;
  } catch (error) {
    console.error("Error creating part:", error);
    throw error;
  }
};

export const deleteParts = async (id) => {
  try {
    const deleted = await tblBP.destroy({
      where: { UniqueID: id },
    });
    return deleted ? id : null;
  } catch (error) {
    console.error("Error deleting part:", error);
    throw error;
  }
};

export const getPOPartsDetailsByUniqueId = async (UniqueID) => {
  try {
    const query = `
      SELECT *
      FROM tblPODetail
      WHERE POUID = :UniqueID
    `;

    const results = await sequelize.query(query, {
      replacements: { UniqueID },
      type: QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return results;
    }

    throw new Error("PODetail not found");
  } catch (error) {
    console.error("Error querying PO parts details:", error);
    throw error;
  }
};

export async function savePODetailByUniqueId(data) {
  const {
    ORDERED,
    RECEIVED,
    DESCRIPTION,
    STOCKNUMBER,
    PARTNUMBER,
    UNITPRICE,
    UNIT,
    AMOUNT,
    POUID,
    PTNUM,
  } = data;

  try {
    const [result] = await sequelize.query(
      `INSERT INTO tblPODetail (ORDERED, RECEIVED, DESCRIPTION, STOCKNUMBER, PARTNUMBER, UNITPRICE, UNIT, AMOUNT,POUID, PTNUM)
            VALUES (:ORDERED, :RECEIVED, :DESCRIPTION, :STOCKNUMBER, :PARTNUMBER, :UNITPRICE, :UNIT, :AMOUNT,:POUID, :PTNUM)`,
      {
        replacements: {
          ORDERED,
          RECEIVED,
          DESCRIPTION,
          STOCKNUMBER,
          PARTNUMBER,
          UNITPRICE,
          UNIT,
          AMOUNT,
          POUID,
          PTNUM,
        },
        type: QueryTypes.INSERT,
      }
    );

    return { success: true, message: "PO detail saved successfully", result };
  } catch (error) {
    throw new Error(`Error saving PO detail: ${error.message}`);
  }
}

export async function deletePODetailByStockNumber(stockNumber) {
  try {
    const result = await sequelize.query(
      `DELETE FROM tblPODetail WHERE STOCKNUMBER = :stockNumber`,
      {
        replacements: { stockNumber },
        type: QueryTypes.DELETE,
      }
    );

    return { success: true, message: "PO detail deleted successfully", result };
  } catch (error) {
    throw new Error(`Error deleting PO detail: ${error.message}`);
  }
}

export const getPODetailsByInstanceId = async (instanceId: any) => {
  try {
    const results = await sequelize.query(
      `SELECT
        tblpo.ponumber,
        tblpo.uniqueid,
        tblpo.date,
        tblpo.NAME,
        tblpodetail.ORDERED,
        tblpodetail.RECEIVED
        FROM tblpo
        INNER JOIN tblpodetail ON tblpodetail.pouid = tblpo.uniqueid
        INNER JOIN tblbp ON tblbp.uniqueid = tblpodetail.ptnum
        WHERE tblbp.instanceid = :instanceId
        ORDER BY CAST(tblpo.date AS DATETIME) DESC;
`,
      {
        replacements: { instanceId },
        type: QueryTypes.SELECT,
      }
    );

    return results;
  } catch (error) {
    console.error("Error fetching PO details:", error);
    throw error;
  }
};

export const getInventoryTransactionsByModel = async (model: any) => {
  try {
    const query = `
          SELECT tblInventoryTransactions.*, 
          tblInventoryTransactions.UniqueID AS UID, 
          tblInventoryTransactionDetails.onhand AS onhandITD, 
          QtyChange, 
          tblBP.Description, 
          tblBP.model
          FROM tblInventoryTransactionDetails
          LEFT JOIN tblInventoryTransactions ON tblInventoryTransactionDetails.InventoryTransactionID = tblInventoryTransactions.UniqueID
          LEFT JOIN tblBP ON tblBP.UniqueID = tblInventoryTransactionDetails.BPID
          WHERE tblBP.model = :model
          ORDER BY tblInventoryTransactions.dated DESC;
`;

    const results = await sequelize.query(query, {
      replacements: { model: model },
      type: QueryTypes.SELECT,
    });
    return results;
  } catch (error) {
    console.error("Error fetching inventory transactions:", error);
    throw error;
  }
};

export const getVendorNames = async () => {
  try {
    const vendorList = await tblVendors.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("Name")), "Name"]],
      order: [["Name", "ASC"]],
      raw: true,
    });

    const names = vendorList
      .map((vendor) => vendor.Name)
      .filter((name) => name !== null && name.trim() !== "");

    return names;
  } catch (error) {
    console.error("Error fetching vendor names:", error);
    throw error;
  }
};

export const getRevisions = async (instanceId: any) => {
  try {
    const bpList = await tblBP.findAll({
      attributes: ["uniqueid", "today", "code", "revisedby"],
      where: {
        instanceid: instanceId,
      },
      order: [[Sequelize.literal("CAST(today AS DATETIME)"), "DESC"]],
      raw: true,
    });
    return bpList;
  } catch (error) {
    throw new Error(
      `Error fetching data for instanceId ${instanceId} from table tblBP: ${error.message}`
    );
  }
};

export const getTotalRequiredByModel = async (model: string) => {
  try {
    const queryForNumbers = `SELECT number, required FROM MRP8 WHERE model = :model`;
    const jobs = await sequelize.query(queryForNumbers, {
      replacements: { model },
      type: QueryTypes.SELECT,
      raw: true,
    });

    const queryForGrandTotal = `SELECT SUM(required) AS grandTotal FROM MRP8 WHERE model = :model`;
    const grandTotalResult = await sequelize.query(queryForGrandTotal, {
      replacements: { model },
      type: QueryTypes.SELECT,
      raw: true,
    });
    const totalRequired = grandTotalResult[0].grandTotal || 0;

    const queryForOrdered = `SELECT SUM(qtyordered) AS ordered FROM MRP2 WHERE stocknumber = :model`;
    const orderedResult = await sequelize.query(queryForOrdered, {
      replacements: { model },
      type: QueryTypes.SELECT,
      raw: true,
    });
    const ordered = orderedResult[0].ordered || 0;

    return { jobs, totalRequired, ordered };
  } catch (error) {
    throw new Error(`Error fetching data for model ${model}: ${error.message}`);
  }
};

export const getAccountList = async () => {
  try {
    const accountList = await tblAccounts.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("AcctNumber")), "AcctNumber"],
        "Description",
      ],
      order: [["AcctNumber", "ASC"]],
      raw: true,
    });
    const formattedList = accountList.map(
      (account) => `#${account.AcctNumber}  ${account.Description}`
    );

    return formattedList;
  } catch (error) {
    throw new Error(
      `Error fetching data from table tblAccounts: ${error.message}`
    );
  }
};

export const updatePartsByRevisionID = async (data: any, instanceId: any) => {
  if (!instanceId) {
    throw new Error("Instance ID is required.");
  }

  const filteredData = Object.keys(data).reduce((acc, key) => {
    if (data[key] !== undefined && data[key] !== null && key !== "UniqueID") {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  const now = new Date();
  const isoString = now.toISOString();
  filteredData.TODAY = isoString;
  filteredData.CODE = "Revision";

  const columns = Object.keys(filteredData).join(", ");
  const values = Object.keys(filteredData)
    .map((key) => `:${key}`)
    .join(", ");

  const sql = `
    INSERT INTO [GrimmIS34].[dbo].[tblBP] (${columns})
    VALUES (${values});
  `;

  try {
    const [results] = await sequelize.query(sql, {
      replacements: filteredData,
      type: QueryTypes.INSERT,
    });

    return results;
  } catch (error) {
    console.error("Error inserting part:", error);
    throw error;
  }
};

export const getAllPartsExport = async (sortBy, sortOrder, filterParams) => {
  const whereClause = applyPartFilters(filterParams);

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
      "ETLCriticalComponent",
    ],
    where: {
      partflag: 1,
      ...whereClause,
    },
    order: [[sortBy || "MODEL", sortOrder || "ASC"]],
    raw: true,
  });

  return productInfos;
};
