import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblOperationReworks = sequelize.define('tblOperationReworks', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   JobID: {
      type: DataTypes.INTEGER,
   },
   OperationID: {
      type: DataTypes.INTEGER,
   },
   tblBPID: {
      type: DataTypes.INTEGER,
   },
   Qty: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblOperationReworks;