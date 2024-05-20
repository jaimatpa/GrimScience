import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblWorkCenterGroup = sequelize.define('tblWorkCenterGroup', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   GroupingTable: {
      type: DataTypes.STRING,
   },
   UIDGroup: {
      type: DataTypes.INTEGER,
   },
   WorkCenterID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblWorkCenterGroup;