import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblVendorInvoice = sequelize.define('tblVendorInvoice', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   dateStamp: {
      type: DataTypes.DATEONLY,
   },
   PONum: {
      type: DataTypes.STRING,
   },
   discount: {
      type: DataTypes.STRING,
   },
   terms: {
      type: DataTypes.STRING,
   },
   Other: {
      type: DataTypes.STRING,
   },
   Employee: {
      type: DataTypes.STRING,
   },
   subtotal: {
      type: DataTypes.STRING,
   },
   invoicetotal: {
      type: DataTypes.STRING,
   },
   freightAmt: {
      type: DataTypes.STRING,
   },
   taxamt: {
      type: DataTypes.STRING,
   },
   invoiceNumber: {
      type: DataTypes.STRING,
   },
   Received: {
      type: DataTypes.STRING,
   },
   vOpenClosed: {
      type: DataTypes.STRING,
   },
   checknumber: {
      type: DataTypes.STRING,
   },
   duedate: {
      type: DataTypes.STRING,
   },
   checkdate: {
      type: DataTypes.STRING,
   },
   CheckID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblVendorInvoice;