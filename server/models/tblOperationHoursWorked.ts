import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblOperationHoursWorked = sequelize.define('tblOperationHoursWorked', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   StartTime: {
      type: DataTypes.DATE,
   },
   EmployeeID: {
      type: DataTypes.INTEGER,
   },
   WorkCenterID: {
      type: DataTypes.INTEGER,
   },
   JobID: {
      type: DataTypes.INTEGER,
   },
   OperationID: {
      type: DataTypes.INTEGER,
   },
   Hours: {
      type: DataTypes.FLOAT,
   },
}, {
   timestamps: false
});

export default tblOperationHoursWorked;