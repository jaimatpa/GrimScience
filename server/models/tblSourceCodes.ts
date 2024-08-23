import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblSourceCodes = sequelize.define('tblSourceCodes', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   source: {
      type: DataTypes.STRING,
   },
   description: {
      type: DataTypes.STRING,
   },
   sourcecode: {
      type: DataTypes.STRING,
   },
   profession: {
      type: DataTypes.STRING,
   },
   category: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblSourceCodes;