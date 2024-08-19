import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblVendorInvoiceDetail = sequelize.define('tblVendorInvoiceDetail', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   VendorInvoiceID: {
      type: DataTypes.INTEGER,
   },
   PODetailID: {
      type: DataTypes.INTEGER,
   },
   Qty: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblVendorInvoiceDetail;