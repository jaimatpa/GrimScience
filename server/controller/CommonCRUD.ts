import sequelize from "../database/databse"
import * as models from "../models";

interface getTableListProps {
  tblName: string;
}

interface getTableDetailProps {
  tblName: string;
  id: string | number;
}

interface getTableWhereProps {
  tblName: string;
  where: object;
}

interface getTableRowWhereProps {
  tblName: string;
  where: object;
}

export const getTableList = async ({tblName}:getTableListProps) => {
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

export const getTableDetail = async ({ tblName, id }: getTableDetailProps) => {
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

export const getTableWhere = async ({ tblName, where }: getTableWhereProps) => {
  try {
    if (models[tblName]) {
      const tableDetail = await models[tblName].findAll({where});
      if(tableDetail) {
        return tableDetail;
      } else {
        throw new Error(`Record  not found in ${tblName}`);
      }
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error fetching data from table ${tblName}: ${error.message}`);
  }
}

export const getTableRowWhere = async ({ tblName, where }: getTableRowWhereProps) => {
  try {
    if (models[tblName]) {
      const tableDetail = await models[tblName].findOne({where});
      return tableDetail;
      // if(tableDetail) {
      //   return tableDetail;
      // } else {
      //   throw new Error(`Record  not found in ${tblName}`);
      // }
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error fetching data from table ${tblName}: ${error.message}`);
  }
}