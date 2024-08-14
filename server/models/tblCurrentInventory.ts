import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblCurrentInventory = sequelize.define('tblCurrentInventory', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
    type: DataTypes.INTEGER,
   },
   MasterInventoryID: {
    type: DataTypes.INTEGER,
   },
   Status: {
      type: DataTypes.STRING,
   },
   BPID: {
    type: DataTypes.INTEGER,
   },
   Customer: {
    type: DataTypes.INTEGER,
   },
   Serial: {
    type: DataTypes.INTEGER,
   },
   descriptionstring: {
      type: DataTypes.STRING,
   },
   modelstring: {
    type: DataTypes.STRING,
   },
}, {
   tableName: 'tblCurrentInventory',
   timestamps: false
});

export default tblCurrentInventory;