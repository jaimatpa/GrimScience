import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblVendors = sequelize.define('tblVendors', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   COMMENTS: {
      type: DataTypes.STRING,
   },
   COUNTRY: {
      type: DataTypes.STRING,
   },
   TERMS: {
      type: DataTypes.STRING,
   },
   CUSTNUMBER: {
      type: DataTypes.STRING,
   },
   STATE: {
      type: DataTypes.STRING,
   },
   ADDESS: {
      type: DataTypes.STRING,
   },
   CITY: {
      type: DataTypes.STRING,
   },
   NUMBER: {
      type: DataTypes.STRING,
   },
   ZIP: {
      type: DataTypes.STRING,
   },
   WEBSITE: {
      type: DataTypes.STRING,
   },
   NAME: {
      type: DataTypes.STRING,
   },
   IRPHONE: {
      type: DataTypes.STRING,
   },
   IREXT: {
      type: DataTypes.STRING,
   },
   IRFAX: {
      type: DataTypes.STRING,
   },
   IREMAIL: {
      type: DataTypes.STRING,
   },
   IRNAME: {
      type: DataTypes.STRING,
   },
   TSNAME: {
      type: DataTypes.STRING,
   },
   TSEMAIL: {
      type: DataTypes.STRING,
   },
   TSFAX: {
      type: DataTypes.STRING,
   },
   TSEXT: {
      type: DataTypes.STRING,
   },
   TSPHONE: {
      type: DataTypes.STRING,
   },
   FREMAIL: {
      type: DataTypes.STRING,
   },
   FRCELL: {
      type: DataTypes.STRING,
   },
   FRNAME: {
      type: DataTypes.STRING,
   },
   FRFAX: {
      type: DataTypes.STRING,
   },
   FRPHONE: {
      type: DataTypes.STRING,
   },
   TODAY: {
      type: DataTypes.STRING,
   },
   ACTIVESTATUS: {
      type: DataTypes.STRING,
   },
   SHIPVIA: {
      type: DataTypes.STRING,
   },
   ApprovalStatus: {
      type: DataTypes.STRING,
   },
   ApprovedBy: {
      type: DataTypes.STRING,
   },
   ApprovedDate: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblVendors;