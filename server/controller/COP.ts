import sequelize from "../database/databse"
import * as models from "../models";

interface tableList {
  tblName: string;
}

interface tableDetail {
  tblName: string;
  id: string | number;
}

export const getTableList = async ({tblName}:tableList) => {
  console.log("Table List:", tblName);
  try {
    if (models[tblName]) {
      const list = await models[tblName].findAll();
      return list;
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error fetching data from table. ${tblName}: ${error.message}`);
  }
}

export const getTableDetail = async ({ tblName, id }: tableDetail) => {
  console.log("Table Detail:", tblName);
  try {
    if (models[tblName]) {
      const primaryKey = models[tblName].primaryKeyAttribute;
      const tableDetail = await models[tblName].findByPk(id);
      if(tableDetail) {
        return tableDetail;
      } else {
        throw new Error(`Record with ${primaryKey} ${id} not found in ${tblName}`);
      }
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error fetching data from table ${tblName}: ${error.message}`);
  }
}