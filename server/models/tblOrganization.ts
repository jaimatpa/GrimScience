import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblOrganization = sequelize.define('tblOrganization', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ReportsTo: {
      type: DataTypes.STRING,
   },
   Title: {
      type: DataTypes.STRING,
   },
   Employee: {
      type: DataTypes.STRING,
   },
   JobDescription: {
      type: DataTypes.TEXT,
   },
   WorkCenters: {
      type: DataTypes.STRING,
   },
   Skills: {
      type: DataTypes.STRING,
   },
   Talents: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblOrganization;