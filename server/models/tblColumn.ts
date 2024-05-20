import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblColumn = sequelize.define('tblColumn', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   formName: {
      type: DataTypes.STRING,
   },
   listView: {
      type: DataTypes.STRING,
   },
   columnNumber: {
      type: DataTypes.INTEGER,
   },
   columnSize: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblColumn;