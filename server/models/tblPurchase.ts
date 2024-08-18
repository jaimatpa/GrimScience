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
      type: DataTypes.STRING,
    },
    vendor: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
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
