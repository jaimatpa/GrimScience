import { DataTypes } from "sequelize";
import sequelize from "../utils/databse";

const tblPurchase = sequelize.define(
  "tblPurchase",
  {
    UniqueId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
    },
    vendor: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.TEXT,
    },
    total: {
      type: DataTypes.FLOAT,
    },
    open: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "tblPurchase",
    timestamps: true,
  }
);

export default tblPurchase;
