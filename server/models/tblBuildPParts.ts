import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblBuildPParts = sequelize.define('tblBuildPParts', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
}, {
   timestamps: false
});

export default tblBuildPParts;