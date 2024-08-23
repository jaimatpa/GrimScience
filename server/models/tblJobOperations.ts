import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblJobOperations = sequelize.define('tblJobOperations', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   JobID: {
      type: DataTypes.INTEGER,
   },
   PlanID: {
      type: DataTypes.INTEGER,
   },
   instanceid: {
      type: DataTypes.INTEGER,
   },
   Operation: {
      type: DataTypes.STRING,
   },
   WorkCenter: {
      type: DataTypes.STRING,
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
   reworkhrs: {
      type: DataTypes.INTEGER,
   },
   verified: {
      type: DataTypes.STRING,
   },
   verifiedby: {
      type: DataTypes.STRING,
   },
   reworkparts: {
      type: DataTypes.STRING,
   },
   DateScheduled: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblJobOperations;