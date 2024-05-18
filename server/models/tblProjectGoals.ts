import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblProjectGoals = sequelize.define('tblProjectGoals', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ProjectName: {
      type: DataTypes.STRING,
   },
   Purpose: {
      type: DataTypes.TEXT,
   },
   BrainStormNotes: {
      type: DataTypes.TEXT,
   },
   FolderBinderReference: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblProjectGoals;