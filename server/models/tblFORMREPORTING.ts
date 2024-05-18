import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblFORMREPORTING = sequelize.define('tblFORMREPORTING', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   formName: {
      type: DataTypes.STRING,
   },
   complaintText: {
      type: DataTypes.TEXT,
   },
   datea: {
      type: DataTypes.DATE,
   },
   employee: {
      type: DataTypes.STRING,
   },
   dvanceLevels: {
      type: DataTypes.STRING,
   },
   resolved: {
      type: DataTypes.STRING,
   },
   descr: {
      type: DataTypes.STRING,
   },
   cost: {
      type: DataTypes.STRING,
   },
   approved: {
      type: DataTypes.STRING,
   },
   resolveversion: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblFORMREPORTING;