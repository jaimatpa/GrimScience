import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblWorkDone = sequelize.define('tblWorkDone', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   DateTime: {
      type: DataTypes.STRING,
   },
   WorkStartTime: {
      type: DataTypes.STRING,
   },
   WorkEndTime: {
      type: DataTypes.STRING,
   },
   DurationMin: {
      type: DataTypes.STRING,
   },
   WorkNotes: {
      type: DataTypes.TEXT,
   },
   NeedsAttentionNotes: {
      type: DataTypes.TEXT,
   },
   taskID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblWorkDone;