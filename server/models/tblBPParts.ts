import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";
// import tblBP from "./tblBP";
// import tblPlan from "./tblPlan";
// import tblSteps from "./tblSteps";
// import {tblBP, tblPlan, tblSteps} from "./"


const tblBPParts = sequelize.define('tblBPParts', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   qty: {
      type: DataTypes.INTEGER,
   },
   instanceid: {
      type: DataTypes.INTEGER,
   },
   partid: {
      type: DataTypes.INTEGER,
   },
   stepid: {
      type: DataTypes.INTEGER,
   },
   note: {
      type: DataTypes.STRING,
   },
   sortOrder: {
      type: DataTypes.STRING,
   },
}, {
   tableName: 'tblBPParts',
   timestamps: false
});

// Associations
// tblBPParts.belongsTo(tblBP, { foreignKey: 'instanceid', targetKey: 'instanceID' });
// tblBPParts.belongsTo(tblPlan, { foreignKey: 'instanceid', targetKey: 'instanceid' });
// tblBPParts.belongsTo(tblSteps, { foreignKey: 'stepid', targetKey: 'UniqueID' });

export default tblBPParts;