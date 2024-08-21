import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";
// import tblBPParts from "./tblBPParts";
// import tblPlan from "./tblPlan";
// import {tblPlan, tblBPParts} from "./"

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

// Associations
// tblSteps.hasMany(tblBPParts, { foreignKey: 'stepid', sourceKey: 'UniqueID' });
// tblSteps.belongsTo(tblPlan, { foreignKey: 'PLANID', targetKey: 'UniqueID' });

export default tblSteps;