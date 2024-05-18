import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblMRPPlanning = sequelize.define('tblMRPPlanning', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   JobNumber: {
      type: DataTypes.STRING,
   },
   Week: {
      type: DataTypes.STRING,
   },
   Qty: {
      type: DataTypes.INTEGER,
   },
   Locked: {
      type: DataTypes.INTEGER,
   },
   EmployeeID: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMRPPlanning;