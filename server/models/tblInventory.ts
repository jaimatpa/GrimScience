import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblInventory = sequelize.define('tblInventory', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   BPID: {
      type: DataTypes.INTEGER,
   },
   Today: {
      type: DataTypes.DATE,
   },
   Status: {
      type: DataTypes.STRING,
   },
   OrderID: {
      type: DataTypes.INTEGER,
   },
   Serial: {
      type: DataTypes.INTEGER,
   },
   Qty: {
      type: DataTypes.INTEGER,
   },
   Code: {
      type: DataTypes.STRING,
   },
   MasterInventoryID: {
      type: DataTypes.INTEGER,
   },
   Customer: {
      type: DataTypes.INTEGER,
   },
   JobID: {
      type: DataTypes.STRING,
   },
   assetflag: {
      type: DataTypes.BOOLEAN,
   },
}, {
   timestamps: false,
   tableName: 'tblInventory',
});

export default tblInventory;