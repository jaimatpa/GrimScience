import { DataTypes } from "sequelize";
import sequelize from "../utils/databse";

const tblPurchase = sequelize.define(
  "tblPurchase",
  {
    UniqueId: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    vendor: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    open: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "tblPurchase",
    timestamps: false,
  }
);

export default tblPurchase;
