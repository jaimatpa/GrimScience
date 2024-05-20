import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblPayables = sequelize.define('tblPayables', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   IsTransfered: {
      type: DataTypes.STRING,
   },
   DateStamp: {
      type: DataTypes.DATE,
   },
   Employee: {
      type: DataTypes.STRING,
   },
   POID: {
      type: DataTypes.INTEGER,
   },
   VendorID: {
      type: DataTypes.STRING,
   },
   VenorPT: {
      type: DataTypes.STRING,
   },
   Notes: {
      type: DataTypes.BLOB,
   },
   GLAccount: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblPayables;