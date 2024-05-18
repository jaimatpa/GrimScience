import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblBPParts = sequelize.define('tblBPParts', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   qty: {
      type: DataTypes.INTEGER,
   },
   instanceid: {
      type: DataTypes.INTEGER,
   },
   partid: {
      type: DataTypes.INTEGER,
   },
   stepid: {
      type: DataTypes.INTEGER,
   },
   note: {
      type: DataTypes.STRING,
   },
   sortOrder: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblBPParts;