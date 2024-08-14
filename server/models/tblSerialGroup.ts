import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblSerialGroup = sequelize.define('tblSerialGroup', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
}, {
   timestamps: false
});

export default tblSerialGroup;