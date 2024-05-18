import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblMRP1 = sequelize.define('tblMRP1', {
   qty: {
      type: DataTypes.REAL,
   },
   UID: {
      type: DataTypes.INTEGER,
   },
   NUMBER: {
      type: DataTypes.STRING,
   },
   WorkCenter: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblMRP1;