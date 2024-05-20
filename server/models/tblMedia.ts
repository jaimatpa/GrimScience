import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblMedia = sequelize.define('tblMedia', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   StepID: {
      type: DataTypes.INTEGER,
   },
   Path: {
      type: DataTypes.STRING,
   },
   Name: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMedia;