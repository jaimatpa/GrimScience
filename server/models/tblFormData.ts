import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblFormData = sequelize.define('tblFormData', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   objID: {
      type: DataTypes.STRING,
   },
   value: {
      type: DataTypes.STRING,
   },
   datetime: {
      type: DataTypes.STRING,
   },
   custid: {
      type: DataTypes.STRING,
   },
   orderid: {
      type: DataTypes.STRING,
   },
   form: {
      type: DataTypes.STRING,
   },
   type: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblFormData;