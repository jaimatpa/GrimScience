import * as models from "../../models";

interface updateTableRowProps {
  tblName: string;
  id: string | number;
  data: any;
}

export const updateTableRow = async ({tblName, id, data}: updateTableRowProps) => {
  try {
    if (models[tblName]) {
      const primaryKey = models[tblName].primaryKeyAttribute;
      const existingRow = await models[tblName].findByPk(id);
      if (!existingRow) {
        throw new Error(`Record with ${primaryKey} ${id} not found in ${tblName}`);
      }
      const updatedResult = await models[tblName].update(data, { where: { [primaryKey]: id } } );
      return updatedResult;
    } else {
      throw new Error(`The item is not existed in ${tblName}`);
    }
  } catch (error) {
    throw new Error(`Error updating data from table. ${tblName}: ${error.message}`);
  }
}
