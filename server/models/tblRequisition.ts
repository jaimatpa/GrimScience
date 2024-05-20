import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblRequisition = sequelize.define('tblRequisition', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   DATE: {
      type: DataTypes.STRING,
   },
   OPENCLOSED: {
      type: DataTypes.STRING,
   },
   PONUMBER: {
      type: DataTypes.STRING,
   },
   TOTAL: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblRequisition;