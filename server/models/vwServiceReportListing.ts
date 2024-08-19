import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const vwServiceReportListing = sequelize.define('vwServiceReportListing', {
   'uniqueID': {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   'SO#': {
      type: DataTypes.STRING,
   },
   'SO Status': {
      type: DataTypes.STRING,
   },
   'SN#': {
      type: DataTypes.STRING,
   },
   'SO Date': {
      type: DataTypes.DATE,
   },
   'Cust #':{
      type: DataTypes.DATE,
   },
   Company: {
      type: DataTypes.STRING,
   },
   city: {
      type: DataTypes.STRING,
   },
   ST: {
      type: DataTypes.STRING,
   },
   'SO Type': {
      type: DataTypes.STRING,
   }, 
   'Failure Comment': {
      type: DataTypes.STRING,
   },
   'SR#': {
      type: DataTypes.STRING,
   },
   Status: {
      type: DataTypes.STRING,
   },
   Type: {
      type: DataTypes.STRING,
   },
   'Service Tech': {
      type: DataTypes.STRING,
   },
   'SR Date': {
      type: DataTypes.STRING,
   },
   Week: {
      type: DataTypes.STRING,
   },
   Invoice: {
      type: DataTypes.STRING,
   },
   complaintID: {
      type: DataTypes.INTEGER,
   },
   REPAIRDESC: {
      type: DataTypes.INTEGER,
   },
   WarrentyService: {
      type: DataTypes.STRING,
   },
   DOS: {
      type: DataTypes.DATE,
   },
   ValidComplaintReason: {
      type: DataTypes.STRING,
   },
   REPAIRSMADE: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false,
   tableName: 'vwServiceReportListing',
});

export default vwServiceReportListing;