import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblSettings = sequelize.define('tblSettings', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   returnAmount: {
      type: DataTypes.STRING,
   },
   companyName: {
      type: DataTypes.STRING,
   },
   companyAddress: {
      type: DataTypes.INTEGER,
   },
   companyZip: {
      type: DataTypes.STRING,
   },
   companyState: {
      type: DataTypes.STRING,
   },
   companyOwner: {
      type: DataTypes.STRING,
   },
   companyContact: {
      type: DataTypes.STRING,
   },
   companyPhone: {
      type: DataTypes.STRING,
   },
   setupDate: {
      type: DataTypes.DATE,
   },
   setupTime: {
      type: DataTypes.TIME,
   },
   URN: {
      type: DataTypes.STRING,
   },
   updatePath: {
      type: DataTypes.STRING,
   },
   panelColors: {
      type: DataTypes.STRING,
   },
   formColors: {
      type: DataTypes.STRING,
   },
   labelPinPrintPath: {
      type: DataTypes.STRING,
   },
   invoicePinPrintPath: {
      type: DataTypes.STRING,
   },
   creditCardPassword: {
      type: DataTypes.STRING,
   },
   creditStoreName: {
      type: DataTypes.STRING,
   },
   creditStoreUserName: {
      type: DataTypes.STRING,
   },
   CPath: {
      type: DataTypes.STRING,
   },
   laborrate: {
      type: DataTypes.STRING,
   },
   onsiterate: {
      type: DataTypes.FLOAT,
   },
   travelrate: {
      type: DataTypes.FLOAT,
   },
   profitRate: {
      type: DataTypes.FLOAT,
   },
   upsellrate: {
      type: DataTypes.FLOAT,
   },
}, {
   timestamps: false
});

export default tblSettings;