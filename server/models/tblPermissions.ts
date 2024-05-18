import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblPermissions = sequelize.define('tblPermissions', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   EmployeeID: {
      type: DataTypes.INTEGER,
   },
   MenuItem: {
      type: DataTypes.STRING,
   },
   Restrictedflag: {
      type: DataTypes.INTEGER,
   },
   system: {
      type: DataTypes.STRING,
   },
   subsystem: {
      type: DataTypes.STRING,
   },
   ReadOnlyIDs: {
      type: DataTypes.STRING,
   },
   FullAdminIDs: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblPermissions;