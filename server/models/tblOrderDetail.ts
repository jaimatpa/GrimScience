import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblOrderDetail = sequelize.define('tblOrderDetail', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   inventoryid: {
      type: DataTypes.INTEGER,
   },
   bpid: {
      type: DataTypes.INTEGER,
   },
   shipping: {
      type: DataTypes.FLOAT,
   },
   quantity: {
      type: DataTypes.INTEGER,
   },
   type: {
      type: DataTypes.STRING,
   },
   name: {
      type: DataTypes.STRING,
   },
   price: {
      type: DataTypes.FLOAT,
   },
   serial: {
      type: DataTypes.STRING,
   },
   orderid: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblOrderDetail;