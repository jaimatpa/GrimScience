import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblLinkedJobs = sequelize.define('tblLinkedJobs', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Job1: {
      type: DataTypes.INTEGER,
   },
   Job2: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblLinkedJobs;