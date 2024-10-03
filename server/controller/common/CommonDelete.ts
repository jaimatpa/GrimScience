import * as models from "../../models";

interface deleteTableRowProps {
  tblName: string;
  id: string | number;
}

interface deleteTableRowsProps {
  tblName: string;
  where: object;
}

export const deleteTableRow = async ({ tblName, id }: deleteTableRowProps) => {
  try {
    if (models[tblName]) {
      const primaryKey = models[tblName].primaryKeyAttribute;
      const deleteResult = await models[tblName].destroy({
        where: {
          [primaryKey]: id
        }
      });
      return deleteResult;
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error deleteing data from table. ${tblName}: ${error.message}`);
  }
}

export const deleteTableRows = async ({ tblName, where }: deleteTableRowsProps) => {
  try {
    if (models[tblName]) {
      const deleteResult = await models[tblName].destroy({ where });
      return deleteResult;
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error deleteing data from table. ${tblName}: ${error.message}`);
  }
}