import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblMessages = sequelize.define('tblMessages', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   TIME: {
      type: DataTypes.STRING,
   },
   DATE: {
      type: DataTypes.STRING,
   },
   TAKENBY: {
      type: DataTypes.STRING,
   },
   PHONE: {
      type: DataTypes.STRING,
   },
   COMPANY: {
      type: DataTypes.STRING,
   },
   CUSTOMER: {
      type: DataTypes.STRING,
   },
   VENDOR: {
      type: DataTypes.STRING,
   },
   NAME: {
      type: DataTypes.STRING,
   },
   MESSAGE: {
      type: DataTypes.STRING,
   },
   '[For]': {
      type: DataTypes.STRING,
   },
   OPENCLOSED: {
      type: DataTypes.STRING,
   },
   CUSTOMERID: {
      type: DataTypes.STRING,
   },
   OTHER: {
      type: DataTypes.STRING,
   },
   CELL: {
      type: DataTypes.STRING,
   },
   '[WORK]': {
      type: DataTypes.STRING,
   },
   HOME: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMessages;