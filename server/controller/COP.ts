import sequelize from "../database/databse"
import * as models from "../models";

interface getTableList {
  tblName: string;
}

export const getTableList = async ({tblName}:getTableList) => {
  console.log("Table Name:", tblName);
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