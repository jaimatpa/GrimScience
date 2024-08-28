import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tmpImport = sequelize.define('tmpImport', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   CID: {
      type: DataTypes.INTEGER,
   },
   Email: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tmpImport;