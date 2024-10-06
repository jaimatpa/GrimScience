import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblMaintReportMeasurements = sequelize.define('tblMaintReportMeasurements', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ReportID: {
      type: DataTypes.INTEGER,
   },
   UOM: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   Applied: {
      type: DataTypes.STRING,
   },
   Adjusted: {
      type: DataTypes.STRING,
   },
   Min: {
      type: DataTypes.STRING,
   },
   Max: {
      type: DataTypes.STRING,
   },
   OK: {
      type: DataTypes.STRING,
   },
   Reading: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMaintReportMeasurements;