import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblState = sequelize.define('tblState', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   state: {
      type: DataTypes.STRING,
   },
   stateprice: {
      type: DataTypes.FLOAT,
   },
   region: {
      type: DataTypes.STRING,
   },
}, {
   tableName: 'tblState',
   timestamps: false
});

export default tblState;