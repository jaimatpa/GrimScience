import * as models from "../../models";

interface createTableRowProps {
  tblName: string;
  data: object;
}

export const createTableRow = async ({ tblName, data }: createTableRowProps) => {
  try {
    if (models[tblName]) {
      const newRecord = await models[tblName].create(data);
      return newRecord;
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error creating a new record in the table ${tblName}: ${error.message}`);
  }
}