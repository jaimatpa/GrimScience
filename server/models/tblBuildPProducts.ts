import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblBuildPProducts = sequelize.define('tblBuildPProducts', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
}, {
   timestamps: false
});

export default tblBuildPProducts;