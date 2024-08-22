import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

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
   tableName: 'tblSteps',
   timestamps: false 
});


export default tblSteps;