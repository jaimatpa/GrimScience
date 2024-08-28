import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblUtility = sequelize.define('tblUtility', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   category: {
      type: DataTypes.STRING,
   },
   value: {
      type: DataTypes.TEXT,
   },
}, {
   timestamps: false
});

export default tblUtility;