import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblJobs = sequelize.define('tblJobs', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ID: {
      type: DataTypes.STRING,
   },
   PART: {
      type: DataTypes.STRING,
   },
   MODEL: {
      type: DataTypes.STRING,
   },
   DATECLOSED: {
      type: DataTypes.STRING,
   },
   QUANTITY: {
      type: DataTypes.INTEGER,
   },
   BEGSERIAL: {
      type: DataTypes.STRING,
   },
   PRODUCTLINE: {
      type: DataTypes.STRING,
   },
   DATEOPENED: {
      type: DataTypes.STRING,
   },
   NUMBER: {
      type: DataTypes.STRING,
   },
   InstanceID: {
      type: DataTypes.INTEGER,
   },
   ByEmployee: {
      type: DataTypes.STRING,
   },
   SAflag: {
      type: DataTypes.INTEGER,
   },
   Catagory: {
      type: DataTypes.STRING,
   },
   SubCatagory: {
      type: DataTypes.STRING,
   },
   JobType: {
      type: DataTypes.STRING,
   },
   linkedJob: {
      type: DataTypes.INTEGER,
   },
   PercentageComplete: {
      type: DataTypes.REAL,
   },
   ClosedBy: {
      type: DataTypes.STRING,
   },
   ProductionDate: {
      type: DataTypes.STRING,
   },
   ProductionBy: {
      type: DataTypes.STRING,
   },
   Cost: {
      type: DataTypes.DECIMAL,
   },
   PerType: {
      type: DataTypes.STRING,
   },
   ProjectType: {
      type: DataTypes.STRING,
   },
   YouTrackProjectShortName: {
      type: DataTypes.STRING,
   },
   ProjectManager: {
      type: DataTypes.STRING,
   },
   DateScheduled: {
      type: DataTypes.STRING,
   },
   Customer: {
      type: DataTypes.STRING,
   },
   jobcat: {
      type: DataTypes.STRING,
   },
   jobsubcat: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblJobs;