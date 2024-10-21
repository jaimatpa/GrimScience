import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblPlan = sequelize.define('tblPlan', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceid: {
      type: DataTypes.INTEGER,
   },
   Operation: {
      type: DataTypes.STRING,
   },
   WorkCenter: {
      type: DataTypes.INTEGER,
   },
   Hours: {
      type: DataTypes.STRING,
   },
   Number: {
      type: DataTypes.INTEGER,
   },
   week: {
      type: DataTypes.INTEGER,
   },
   skills: {
      type: DataTypes.STRING,
   },
   ApprovedBy: {
      type: DataTypes.STRING,
   },
   ApprovedDate: {
      type: DataTypes.STRING,
   },
   PreparedBy: {
      type: DataTypes.STRING,
   },
   PreparedDate: {
      type: DataTypes.STRING,
   },
}, {
   tableName: 'tblPlan',
   timestamps: false
});


export default tblPlan;