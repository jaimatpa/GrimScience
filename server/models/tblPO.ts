import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblPO = sequelize.define('tblPO', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   PONUMBER: {
      type: DataTypes.INTEGER,
   },
   VENDORTERMS: {
      type: DataTypes.STRING,
   },
   VENDORDATE: {
      type: DataTypes.INTEGER,
   },
   VENDORFOB: {
      type: DataTypes.STRING,
   },
   VENDORSHIP: {
      type: DataTypes.STRING,
   },
   IREMAIL: {
      type: DataTypes.STRING,
   },
   IRFAX: {
      type: DataTypes.STRING,
   },
   IRPHONE: {
      type: DataTypes.STRING,
   },
   IRNAME: {
      type: DataTypes.STRING,
   },
   NAME: {
      type: DataTypes.STRING,
   },
   ADDESS: {
      type: DataTypes.STRING,
   },
   CITYSTATEZIP: {
      type: DataTypes.STRING,
   },
   VENDOR: {
      type: DataTypes.STRING,
   },
   TOTAL: {
      type: DataTypes.STRING,
   },
   VENDORCUSTOMERNUMBER: {
      type: DataTypes.STRING,
   },
   DATE: {
      type: DataTypes.STRING,
   },
   WEBSITE: {
      type: DataTypes.STRING,
   },
   SALESORDER: {
      type: DataTypes.STRING,
   },
   IREXT: {
      type: DataTypes.STRING,
   },
   RejectReason: {
      type: DataTypes.STRING,
   },
   OPENCLOSED: {
      type: DataTypes.STRING,
   },
   Notes: {
      type: DataTypes.STRING,
   },
   AuthorizedBy: {
      type: DataTypes.STRING,
   },
   Shipto: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblPO;