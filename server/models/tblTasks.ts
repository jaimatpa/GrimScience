import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblTasks = sequelize.define('tblTasks', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   TaskName: {
      type: DataTypes.STRING,
   },
   ProjectBranchID: {
      type: DataTypes.INTEGER,
   },
   LogicOrder: {
      type: DataTypes.INTEGER,
   },
   PriorityOrder: {
      type: DataTypes.INTEGER,
   },
   Description: {
      type: DataTypes.TEXT,
   },
   CompletionNotes: {
      type: DataTypes.TEXT,
   },
   ExpectedCompletionDate: {
      type: DataTypes.STRING,
   },
   Notes: {
      type: DataTypes.TEXT,
   },
   FolderBinderReference: {
      type: DataTypes.STRING,
   },
   DateStarted: {
      type: DataTypes.STRING,
   },
   DateCreated: {
      type: DataTypes.STRING,
   },
   Status: {
      type: DataTypes.STRING,
   },
   ExpectedWorkHours: {
      type: DataTypes.FLOAT,
   },
   ActualWorkHours: {
      type: DataTypes.FLOAT,
   },
   BilledCompanyID: {
      type: DataTypes.INTEGER,
   },
   WorkforCompanyID: {
      type: DataTypes.INTEGER,
   },
   ExpectedWorkHoursReliability: {
      type: DataTypes.STRING,
   },
   HourlyRate: {
      type: DataTypes.FLOAT,
   },
   ExpectedStartDate: {
      type: DataTypes.STRING,
   },
   CompletionDate: {
      type: DataTypes.STRING,
   },
   LastTouchedDate: {
      type: DataTypes.STRING,
   },
   ListCatagory: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblTasks;