import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblInventoryTransactions = sequelize.define('tblInventoryTransactions', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Parts: {
      type: DataTypes.STRING,
   },
   Justification: {
      type: DataTypes.STRING,
   },
   Dated: {
      type: DataTypes.DATE,
   },
   By: {
      type: DataTypes.STRING,
   },
   FromAcct: {
      type: DataTypes.STRING,
   },
   ToAcct: {
      type: DataTypes.STRING,
   },
   Dollars: {
      type: DataTypes.STRING,
   },
   JobDetailID: {
      type: DataTypes.INTEGER,
   },
   JobID: {
      type: DataTypes.INTEGER,
   },
   ServiceReportID: {
      type: DataTypes.INTEGER,
   },
   InvoiceID: {
      type: DataTypes.INTEGER,
   },
   VendorInvoiceID: {
      type: DataTypes.INTEGER,
   },
   Manual: {
      type: DataTypes.STRING,
   },
   PONumber: {
      type: DataTypes.STRING,
   },
   OperationID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblInventoryTransactions;