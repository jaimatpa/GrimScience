import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblNonConformanceTags = sequelize.define('tblNonConformanceTags', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   NonConformanceID: {
      type: DataTypes.INTEGER,
   },
   DateTime: {
      type: DataTypes.DATE,
   },
   Quantity: {
      type: DataTypes.INTEGER,
   },
   ReceivedQty: {
      type: DataTypes.INTEGER,
   },
   ByEmployee: {
      type: DataTypes.STRING,
   },
   AssignedtoEmployee: {
      type: DataTypes.STRING,
   },
   Location: {
      type: DataTypes.STRING,
   },
   Status: {
      type: DataTypes.STRING,
   },
   Justification: {
      type: DataTypes.STRING,
   },
   DISPOSITION: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblNonConformanceTags;