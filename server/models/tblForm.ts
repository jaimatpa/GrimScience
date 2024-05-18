import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblForm = sequelize.define('tblForm', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   type: {
      type: DataTypes.FLOAT,
   },
   '[top]': {
      type: DataTypes.FLOAT,
   },
   '[left]': {
      type: DataTypes.FLOAT,
   },
   width: {
      type: DataTypes.FLOAT,
   },
   height: {
      type: DataTypes.FLOAT,
   },
   tab: {
      type: DataTypes.FLOAT,
   },
   form: {
      type: DataTypes.STRING,
   },
   xchar: {
      type: DataTypes.STRING,
   },
   ychar: {
      type: DataTypes.STRING,
   },
   fld: {
      type: DataTypes.STRING,
   },
   name: {
      type: DataTypes.STRING,
   },
   printer: {
      type: DataTypes.STRING,
   },
   '[default]': {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblForm;