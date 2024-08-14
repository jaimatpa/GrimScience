import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblChecks = sequelize.define('tblChecks', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   CheckNumber: {
      type: DataTypes.INTEGER,
   },
   CheckAmount: {
      type: DataTypes.DECIMAL,
   },
   CheckDate: {
      type: DataTypes.DATE,
   },
   VendorID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblChecks;