import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblBuildPEmployees = sequelize.define('tblBuildPEmployees', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
}, {
   timestamps: false
});

export default tblBuildPEmployees;