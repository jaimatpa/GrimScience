import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblAccounts = sequelize.define('tblAccounts', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   AcctNumber: {
      type: DataTypes.STRING,
   },
   Description: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblAccounts;