import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblPODetail = sequelize.define('tblPODetail', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ORDERED: {
      type: DataTypes.INTEGER,
   },
   UNIT: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   POUID: {
      type: DataTypes.INTEGER,
   },
   AMOUNT: {
      type: DataTypes.STRING,
   },
   UNITPRICE: {
      type: DataTypes.FLOAT,
   },
   STOCKNUMBER: {
      type: DataTypes.STRING,
   },
   PARTNUMBER: {
      type: DataTypes.STRING,
   },
   RECEIVED: {
      type: DataTypes.INTEGER,
   },
   PTNUM: {
      type: DataTypes.INTEGER,
   },
   INSPECTED: {
      type: DataTypes.STRING,
   },
   IDTAG: {
      type: DataTypes.STRING,
   },
   RejectReason: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblPODetail;