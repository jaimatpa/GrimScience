import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblJobDetail = sequelize.define('tblJobDetail', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   JobID: {
      type: DataTypes.INTEGER,
   },
   ShipDate: {
      type: DataTypes.STRING,
   },
   Serial: {
      type: DataTypes.INTEGER,
   },
   PlanID: {
      type: DataTypes.INTEGER,
   },
   Quantity: {
      type: DataTypes.STRING,
   },
   SingleMaterialCost: {
      type: DataTypes.STRING,
   },
   PartsList: {
      type: DataTypes.TEXT,
   },
   dateEntered: {
      type: DataTypes.STRING,
   },
   SingleLaborHours: {
      type: DataTypes.STRING,
   },
   SingleLaborCost: {
      type: DataTypes.STRING,
   },
   ScheduledQty: {
      type: DataTypes.INTEGER,
   },
   ScheduledDate: {
      type: DataTypes.STRING,
   },
   CostPerUnit: {
      type: DataTypes.DECIMAL,
   },
}, {
   timestamps: false,
   tableName: 'tblJobDetail'
});

export default tblJobDetail;