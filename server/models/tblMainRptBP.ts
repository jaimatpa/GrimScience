import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblMainRptBP = sequelize.define('tblMainRptBP', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   MaintainenceReportID: {
      type: DataTypes.INTEGER,
   },
   BPInstanceID: {
      type: DataTypes.INTEGER,
   },
   Cost: {
      type: DataTypes.INTEGER,
   },
   Qty: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblMainRptBP;