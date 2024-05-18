import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblQualifications = sequelize.define('tblQualifications', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Name: {
      type: DataTypes.STRING,
   },
   Description: {
      type: DataTypes.STRING,
   },
   nextRecertificationDate: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblQualifications;