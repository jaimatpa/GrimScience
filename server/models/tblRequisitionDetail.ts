import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblRequisitionDetail = sequelize.define('tblRequisitionDetail', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   PARTNUMBER: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   QTY: {
      type: DataTypes.INTEGER,
   },
   STOCKNUMBER: {
      type: DataTypes.STRING,
   },
   EMPLOYEE: {
      type: DataTypes.STRING,
   },
   Date: {
      type: DataTypes.DATE,
   },
   reqdate: {
      type: DataTypes.STRING,
   },
   PONumber: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblRequisitionDetail;