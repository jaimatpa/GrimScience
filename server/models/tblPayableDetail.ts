import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblPayableDetail = sequelize.define('tblPayableDetail', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   PayableID: {
      type: DataTypes.INTEGER,
   },
   PartID: {
      type: DataTypes.INTEGER,
   },
   AmtRec: {
      type: DataTypes.INTEGER,
   },
   DateStamp: {
      type: DataTypes.DATE,
   },
   ByEmployee: {
      type: DataTypes.STRING,
   },
   GLAccount: {
      type: DataTypes.INTEGER,
   },
   UnitCost: {
      type: DataTypes.STRING,
   },
   InvoiceNum: {
      type: DataTypes.STRING,
   },
   FreightAmt: {
      type: DataTypes.STRING,
   },
   TaxAmt: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblPayableDetail;