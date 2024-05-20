import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblPreventiveActions = sequelize.define('tblPreventiveActions', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   PREVENTPROB: {
      type: DataTypes.STRING,
   },
   PROBLEMDIAG: {
      type: DataTypes.INTEGER,
   },
   PROBLEMDESC: {
      type: DataTypes.STRING,
   },
   PROBLEM3: {
      type: DataTypes.INTEGER,
   },
   PROBLEM2: {
      type: DataTypes.INTEGER,
   },
   PROBLEM1: {
      type: DataTypes.INTEGER,
   },
   DIAGBY: {
      type: DataTypes.STRING,
   },
   DIAGDATE: {
      type: DataTypes.DATE,
   },
   IMPLEMENTBY: {
      type: DataTypes.STRING,
   },
   IMPLEMENTDATE: {
      type: DataTypes.DATE,
   },
   COMPLAINTID: {
      type: DataTypes.INTEGER,
   },
   PARTS: {
      type: DataTypes.STRING,
   },
   WORKCENTERS: {
      type: DataTypes.STRING,
   },
   PRODLINE: {
      type: DataTypes.STRING,
   },
   WORKCENTER: {
      type: DataTypes.STRING,
   },
   VENDOR: {
      type: DataTypes.STRING,
   },
   PART: {
      type: DataTypes.STRING,
   },
   PANO: {
      type: DataTypes.INTEGER,
   },
   ACTIONTYPE: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   ECO: {
      type: DataTypes.STRING,
   },
   Status: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblPreventiveActions;