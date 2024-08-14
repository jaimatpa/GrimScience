import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblMaintainenceOrders = sequelize.define('tblMaintainenceOrders', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   SERIALID: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   DATE: {
      type: DataTypes.DATE,
   },
   SERIAL: {
      type: DataTypes.STRING,
   },
   ORDEREDBY: {
      type: DataTypes.STRING,
   },
   MAINTAINANCE: {
      type: DataTypes.STRING,
   },
   MONTHSBETWEEN: {
      type: DataTypes.STRING,
   },
   MANO: {
      type: DataTypes.STRING,
   },
   ROUTINECALIBRATION: {
      type: DataTypes.STRING,
   },
   PART: {
      type: DataTypes.STRING,
   },
   CATAGORY: {
      type: DataTypes.STRING,
   },
   SUBCATAGORY: {
      type: DataTypes.STRING,
   },
   COMPLETED: {
      type: DataTypes.STRING,
   },
   REQUIRED: {
      type: DataTypes.STRING,
   },
   ROUTINE: {
      type: DataTypes.STRING,
   },
   TYPE: {
      type: DataTypes.STRING,
   },
   CLOSED: {
      type: DataTypes.STRING,
   },
   MODEL: {
      type: DataTypes.STRING,
   },
   LOCATION: {
      type: DataTypes.STRING,
   },
   MfgName: {
      type: DataTypes.STRING,
   },
   mfgModel: {
      type: DataTypes.STRING,
   },
   InstLoc: {
      type: DataTypes.STRING,
   },
   IDNo: {
      type: DataTypes.STRING,
   },
   CALIBRATIONREQ: {
      type: DataTypes.STRING,
   },
   Tolerance: {
      type: DataTypes.STRING,
   },
   ManSerial: {
      type: DataTypes.STRING,
   },
   InserviceDate: {
      type: DataTypes.STRING,
   },
   Range: {
      type: DataTypes.STRING,
   },
   Vendor: {
      type: DataTypes.STRING,
   },
   CalibrationProcedure: {
      type: DataTypes.STRING,
   },
   CalibratedBy: {
      type: DataTypes.STRING,
   },
   Range2: {
      type: DataTypes.STRING,
   },
   Range3: {
      type: DataTypes.STRING,
   },
   Tolerance2: {
      type: DataTypes.STRING,
   },
   Tolerance3: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMaintainenceOrders;