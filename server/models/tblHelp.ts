import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblHelp = sequelize.define('tblHelp', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   NAME: {
      type: DataTypes.STRING,
   },
   HELP: {
      type: DataTypes.TEXT('long'),
   },
   READONLY: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblHelp;