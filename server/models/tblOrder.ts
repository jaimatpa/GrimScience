import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblOrder = sequelize.define('tblOrder', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   customerid: {
      type: DataTypes.INTEGER,
   },
   orderdate: {
      type: DataTypes.STRING,
   },
   orderid: {
      type: DataTypes.INTEGER,
   },
   shipping: {
      type: DataTypes.STRING,
   },
   total: {
      type: DataTypes.FLOAT,
   },
   shippingmethod: {
      type: DataTypes.STRING,
   },
   datepromised: {
      type: DataTypes.STRING,
   },
   specialinstructions1: {
      type: DataTypes.STRING,
   },
   invoicenumber: {
      type: DataTypes.STRING,
   },
   sourcedescription: {
      type: DataTypes.STRING,
   },
   soldby: {
      type: DataTypes.STRING,
   },
   referredby: {
      type: DataTypes.STRING,
   },
   referphone1: {
      type: DataTypes.STRING,
   },
   referphone2: {
      type: DataTypes.STRING,
   },
   referphone3: {
      type: DataTypes.STRING,
   },
   terms: {
      type: DataTypes.STRING,
   },
   zone: {
      type: DataTypes.STRING,
   },
   checknoorcreditcardinfo: {
      type: DataTypes.STRING,
   },
   purchaseordernumber: {
      type: DataTypes.STRING,
   },
   fob: {
      type: DataTypes.STRING,
   },
   lessdiscount: {
      type: DataTypes.STRING,
   },
   source: {
      type: DataTypes.STRING,
   },
   shipdate: {
      type: DataTypes.STRING,
   },
   invoicedate: {
      type: DataTypes.STRING,
   },
   specialinstructions2: {
      type: DataTypes.STRING,
   },
   lessdown: {
      type: DataTypes.STRING,
   },
   subtotal: {
      type: DataTypes.FLOAT,
   },
   tax: {
      type: DataTypes.FLOAT,
   },
   cod: {
      type: DataTypes.FLOAT,
   },
   exempt: {
      type: DataTypes.INTEGER,
   },
   checking: {
      type: DataTypes.STRING,
   },
   '[authorization]': {
      type: DataTypes.STRING,
   },
   TrackingNumbers: {
      type: DataTypes.STRING,
   },
   quotenumber: {
      type: DataTypes.INTEGER,
   },
   weekstodelivery: {
      type: DataTypes.STRING,
   },
   laborcost: {
      type: DataTypes.FLOAT,
   },
   materialcost: {
      type: DataTypes.FLOAT,
   },
   warranty: {
      type: DataTypes.STRING,
   },
   acceptancedate: {
      type: DataTypes.STRING,
   },
   expirationdate: {
      type: DataTypes.STRING,
   },
   QuoteInvioceNumber: {
      type: DataTypes.STRING,
   },
   Notes: {
      type: DataTypes.STRING,
   },
   Backorder: {
      type: DataTypes.STRING,
   },
   MDET: {
      type: DataTypes.INTEGER,
   },
   MDET1: {
      type: DataTypes.FLOAT,
   },
   Quote: {
      type: DataTypes.STRING,
   },
   QuoteOrderNumber: {
      type: DataTypes.STRING,
   },
   status: {
      type: DataTypes.STRING,
   },
   estimatedbooking: {
      type: DataTypes.STRING,
   },
   estimatedship: {
      type: DataTypes.STRING,
   },
   complaintID: {
      type: DataTypes.INTEGER,
   },
   InstallationBy: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false,
   tableName: 'tblOrder'
});

export default tblOrder;