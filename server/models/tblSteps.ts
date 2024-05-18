import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblSteps = sequelize.define('tblSteps', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Step: {
      type: DataTypes.FLOAT,
   },
   Description: {
      type: DataTypes.STRING,
   },
   PLANID: {
      type: DataTypes.INTEGER,
   },
   notes: {
      type: DataTypes.TEXT,
   },
}, {
   timestamps: false
});

export default tblSteps;