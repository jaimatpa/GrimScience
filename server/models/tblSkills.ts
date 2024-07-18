import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblSkills = sequelize.define('tblSkills', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Name: {
      type: DataTypes.STRING,
   },
   TrainingNotes: {
      type: DataTypes.STRING,
   },
   Prerequisites: {
      type: DataTypes.STRING,
   },
   WorkCenterID: {
      type: DataTypes.INTEGER,
   },
   weeks: {
      type: DataTypes.INTEGER,
   },
   Sort: {
      type: DataTypes.STRING,
   },
   Catagory: {
      type: DataTypes.STRING,
   },
   subcatagory: {
      type: DataTypes.STRING,
   },
   date: {
      type: DataTypes.STRING,
   },
   by: {
      type: DataTypes.STRING,
   },
   frequency: {
      type: DataTypes.INTEGER,
   },
   courseoutline: {
      type: DataTypes.STRING,
   },
   parts: {
      type: DataTypes.STRING,
   },
   WorkCenters: {
      type: DataTypes.STRING,
   },
   InstanceID: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false,
   tableName: 'tblSkills'
});

export default tblSkills;