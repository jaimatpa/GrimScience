import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblInventoryTransactionDetails = sequelize.define('tblInventoryTransactionDetails', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   InventoryTransactionID: {
      type: DataTypes.INTEGER,
   },
   InstanceID: {
      type: DataTypes.INTEGER,
   },
   BPID: {
      type: DataTypes.INTEGER,
   },
   QtyChange: {
      type: DataTypes.INTEGER,
   },
   OnHand: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblInventoryTransactionDetails;