import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblTimeVerify = sequelize.define('tblTimeVerify', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   WeekSunday: {
      type: DataTypes.STRING,
   },
   VerifyBy: {
      type: DataTypes.STRING,
   },
   VerifyDate: {
      type: DataTypes.STRING,
   },
   employeeID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblTimeVerify;