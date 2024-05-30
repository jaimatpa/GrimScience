import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblBulidPHours = sequelize.define('tblBulidPHours', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
}, {
   timestamps: false
});

export default tblBulidPHours;