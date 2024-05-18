import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblZoneChart = sequelize.define('tblZoneChart', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   low: {
      type: DataTypes.STRING,
   },
   high: {
      type: DataTypes.STRING,
   },
   ground: {
      type: DataTypes.STRING,
   },
   nextdayair: {
      type: DataTypes.STRING,
   },
   nextdayairsaver: {
      type: DataTypes.STRING,
   },
   seconddayair: {
      type: DataTypes.STRING,
   },
   seconddayairam: {
      type: DataTypes.STRING,
   },
   threedayselect: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblZoneChart;