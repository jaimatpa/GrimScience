import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblMaintainenceReports = sequelize.define('tblMaintainenceReports', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   OrderID: {
      type: DataTypes.INTEGER,
   },
   No: {
      type: DataTypes.INTEGER,
   },
   Date: {
      type: DataTypes.DATE,
   },
   '[By]': {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   PARTS: {
      type: DataTypes.STRING,
   },
   CalibrationProcedure: {
      type: DataTypes.STRING,
   },
   Inhouse: {
      type: DataTypes.STRING,
   },
   Vendor: {
      type: DataTypes.STRING,
   },
   Sub1: {
      type: DataTypes.STRING,
   },
   Sub2: {
      type: DataTypes.STRING,
   },
   Sub4: {
      type: DataTypes.STRING,
   },
   Inst1: {
      type: DataTypes.STRING,
   },
   Inst2: {
      type: DataTypes.STRING,
   },
   Inst3: {
      type: DataTypes.STRING,
   },
   Inst4: {
      type: DataTypes.STRING,
   },
   IC1: {
      type: DataTypes.STRING,
   },
   IC2: {
      type: DataTypes.STRING,
   },
   IC3: {
      type: DataTypes.STRING,
   },
   IC4: {
      type: DataTypes.STRING,
   },
   ThirdPartyReport: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMaintainenceReports;