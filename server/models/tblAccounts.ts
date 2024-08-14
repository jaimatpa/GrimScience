import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblAccounts = sequelize.define('tblAccounts', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   AcctNumber: {
      type: DataTypes.STRING,
      unique: true,
   },
   Description: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblAccounts;