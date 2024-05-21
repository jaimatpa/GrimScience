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
      const updatedResult = await models[tblName].update(data, { where: { [primaryKey]: id } } );
      return updatedResult;
    } else {
      throw new Error(`The item is not existed in ${tblName}`);
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Error updating data from table. ${tblName}: ${error.message}`);
  }
}
