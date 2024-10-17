import { tblFORMREPORTING } from "~/server/models";
import { Sequelize, Op, where } from "sequelize";
import sequelize from "~/server/utils/databse";

const applyFilters = (params) => {
  const filterParams = [
    "resolved",
    "datea",
    "uniqueid",
    "formName",
    "employee",
    "complaintText",
    "descr",
    "dvanceLevels",
    "cost",
    "approved",
    "resolveversion",
  ];
  const whereClauses = [];
  const values = [];

  filterParams.forEach((param) => {
    if (params[param]) {
      if (param === "datea") {
        const dateValue = new Date(params[param]);
        const year = dateValue.getFullYear();
        const month = dateValue.getMonth() + 1;
        const day = dateValue.getDate();

        if (year) {
          whereClauses.push(`YEAR(datea) = ?`);
          values.push(year);
        }
        if (month) {
          whereClauses.push(`MONTH(datea) = ?`);
          values.push(month);
        }
        if (day) {
          whereClauses.push(`DAY(datea) = ?`);
          values.push(day);
        }
      } else {
        whereClauses.push(`${param} LIKE ?`);
        values.push(`%${params[param]}%`);
      }
    }
  });

  return {
    whereClause:
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "",
    values,
  };
};

export const getAllBugs = async (
  page,
  pageSize,
  sortBy,
  sortOrder,
  filterParams
) => {
  const { whereClause, values } = applyFilters(filterParams);
  const limit = parseInt(pageSize, 10) || 10;
  const offset = (parseInt(page, 10) - 1 || 0) * limit;

  const query = `
    SELECT uniqueid, formName, complaintText, datea, employee, dvanceLevels, resolved, descr, cost, approved, resolveversion
    FROM tblFORMREPORTING
    ${whereClause}
    ORDER BY ${sortBy || "uniqueid"} ${sortOrder || "ASC"}
    OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`;

  values.push(offset, limit);

  const [list] = await sequelize.query(query, {
    replacements: values,
  });

  return list;
};

export const createBug = async (data) => {
  const createReqData = {
    ...data,
  };

  const newCustomer = await tblFORMREPORTING.create(createReqData);

  return newCustomer;
};

export const getBugDetail = async (id) => {
  const tableDetail = await tblFORMREPORTING.findByPk(id);
  return tableDetail;
};

export const bugExistByID = async (id: number | string) => {
  const tableDetail = await tblFORMREPORTING.findByPk(id);
  if (tableDetail) return true;
  else return false;
};

export const updateBug = async (id, reqData) => {
  await tblFORMREPORTING.update(reqData, {
    where: { uniqueid: id },
  });

  return id;
};

export const deleteBug = async (id) => {
  await tblFORMREPORTING.destroy({ where: { UniqueID: id } });
  return id;
};

export const getReportedForm = async () => {
  const reportedFormList = await tblFORMREPORTING.findAll({
    attributes: [
      [Sequelize.fn("DISTINCT", Sequelize.col("formName")), "formName"],
    ],
  });

  const distinctStates = reportedFormList.map((item: any) => item.formName);
  return distinctStates;
};

const applyNumberFilters = (params) => {
  const filterParams = [
    "resolved",
    "uniqueid",
    "datea",
    "formName",
    "employee",
    "complaintText",
    "descr",
    "dvanceLevels",
    "cost",
    "approved",
    "resolveversion",
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

export const getNumberOfBugs = async (filterParams) => {
  const { whereClause, values } = applyFilters(filterParams);
  const query = `
    SELECT COUNT(*) as count 
    FROM tblFORMREPORTING 
    ${whereClause}
  `;

  try {
    const result = await sequelize.query(query, {
      replacements: values,
      type: sequelize.QueryTypes.SELECT,
    });
    return result[0].count;
  } catch (error) {
    console.error("Error counting bugs:", error);
    throw error;
  }
};
