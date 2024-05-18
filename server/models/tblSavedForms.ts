import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblSavedForms = sequelize.define('tblSavedForms', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   FormName: {
      type: DataTypes.STRING,
   },
   X: {
      type: DataTypes.STRING,
   },
   Y: {
      type: DataTypes.INTEGER,
   },
   HEIGHT: {
      type: DataTypes.STRING,
   },
   WIDTH: {
      type: DataTypes.STRING,
   },
   TEXT: {
      type: DataTypes.STRING,
   },
   NAME: {
      type: DataTypes.STRING,
   },
   CONTROLTYPE: {
      type: DataTypes.STRING,
   },
   FORMSIZEX: {
      type: DataTypes.STRING,
   },
   FORMSIZEY: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblSavedForms;