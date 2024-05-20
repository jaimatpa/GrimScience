import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblTraining = sequelize.define('tblTraining', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   InstanceID: {
      type: DataTypes.INTEGER,
   },
   EmployeeID: {
      type: DataTypes.INTEGER,
   },
   SkillID: {
      type: DataTypes.INTEGER,
   },
   WorkCenterID: {
      type: DataTypes.INTEGER,
   },
   TrainingDate: {
      type: DataTypes.DATE,
   },
   Proficency: {
      type: DataTypes.STRING,
   },
   Trainer: {
      type: DataTypes.STRING,
   },
   Notes: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblTraining;