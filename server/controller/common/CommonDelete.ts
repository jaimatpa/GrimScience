import * as models from "../../models";

interface deleteTableRowProps {
  tblName: string;
  where: object;
}

export const deleteTableRows = async ({tblName, where}: deleteTableRowProps) => {
  try {
    if (models[tblName]) {
      const deleteResult = await models[tblName].destroy({where});
      return deleteResult;
    } else {
      throw new Error(`The item is not existed in ${tblName}`);
    }
  } catch (error) {
    console.log(error)
    throw new Error(`Error deleteing data from table. ${tblName}: ${error.message}`);
  }
}
