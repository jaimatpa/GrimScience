import * as models from "../../models";

interface createTableRowProps {
  tblName: string;
  data: object;
}

export const createTableRow = async ({ tblName, data }: createTableRowProps) => {
  try {
    if (models[tblName]) {
      const Model = models[tblName];
      const uniqueKeyField = Object.keys(Model.rawAttributes).find((key) => Model.rawAttributes[key].unique);

      if (uniqueKeyField && uniqueKeyField in data) {
        const query = {};
        query[uniqueKeyField] = data[uniqueKeyField];
        const existingRecord = await Model.findOne({ where: query });
        if (existingRecord) {
          throw new Error(`Record with ${uniqueKeyField} ${data[uniqueKeyField]} already exists in table ${tblName}`);
        }
      }

      const newRecord = await Model.create(data);
      return newRecord;
    } else {
      throw new Error(`${tblName} is not defined`);
    }
  } catch (error) {
    throw new Error(`Error creating a new record in the table ${tblName}: ${error.message}`);
  }
}