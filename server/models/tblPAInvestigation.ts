import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblPAInvestigation = sequelize.define('tblPAInvestigation', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   investigationID: {
      type: DataTypes.INTEGER,
   },
   PreventiveActionID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblPAInvestigation;