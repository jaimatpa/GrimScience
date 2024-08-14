import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblProjectBranch = sequelize.define('tblProjectBranch', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   BranchName: {
      type: DataTypes.STRING,
   },
   ProjectID: {
      type: DataTypes.INTEGER,
   },
   MotherBranchID: {
      type: DataTypes.INTEGER,
   },
   Purpose: {
      type: DataTypes.TEXT,
   },
   Notes: {
      type: DataTypes.TEXT,
   },
   FolderBinderReference: {
      type: DataTypes.STRING,
   },
   ExpectedCompletionDate: {
      type: DataTypes.STRING,
   },
   CompletionNotes: {
      type: DataTypes.TEXT,
   },
   LogicOrder: {
      type: DataTypes.INTEGER,
   },
   PriorityOrder: {
      type: DataTypes.INTEGER,
   },
   WorkforCompanyID: {
      type: DataTypes.INTEGER,
   },
   BilledCompanyID: {
      type: DataTypes.INTEGER,
   },
   AcutalWorkHours: {
      type: DataTypes.FLOAT,
   },
   ExpectedWorkHours: {
      type: DataTypes.FLOAT,
   },
   HourlyRate: {
      type: DataTypes.FLOAT,
   },
   AutoRecalcActualHrs: {
      type: DataTypes.STRING,
   },
   AutoRecalcHrsRate: {
      type: DataTypes.STRING,
   },
   AutoRecalcExpectedHrs: {
      type: DataTypes.STRING,
   },
   QuickList: {
      type: DataTypes.INTEGER,
   },
   Security: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblProjectBranch;