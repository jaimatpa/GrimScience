import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tbl = sequelize.define('tbl', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   NUMBER: {
      type: DataTypes.STRING,
   },
   STATUS: {
      type: DataTypes.STRING,
   },
   LINE1: {
      type: DataTypes.STRING,
   },
   LINE2: {
      type: DataTypes.STRING,
   },
   LINE3: {
      type: DataTypes.STRING,
   },
   LINE4: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tbl;