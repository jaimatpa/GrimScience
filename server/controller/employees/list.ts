import { tblEmployee } from "~/server/models";
import { Sequelize } from "sequelize";

export const getEmployeeFullNames = async () => {
  try {
    const list = await tblEmployee.findAll({
      attributes: [
        [Sequelize.literal("CONCAT(fname, ' ', lname)"), 'fullName'],
      ],
    });
    return list.map(employee => employee.get('fullName'));
  } catch(err) {
    return err.message;
  }
};