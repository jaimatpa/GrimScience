import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblErrorLog = sequelize.define('tblErrorLog', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   OccuredAt: {
      type: DataTypes.DATE,
   },
   ClassName: {
      type: DataTypes.STRING,
   },
   MethodName: {
      type: DataTypes.STRING,
   },
   ComputerName: {
      type: DataTypes.STRING,
   },
   Message: {
      type: DataTypes.STRING,
   },
   AdditionalInformation: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblErrorLog;