import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblShippingRates = sequelize.define('tblShippingRates', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   SHIPZONE3A: {
      type: DataTypes.STRING,
   },
   SHIPZONE4A: {
      type: DataTypes.STRING,
   },
   SHIPZONE5A: {
      type: DataTypes.INTEGER,
   },
   SHIPZONE6A: {
      type: DataTypes.STRING,
   },
   SHIPZONE7A: {
      type: DataTypes.STRING,
   },
   SHIPZONE2A: {
      type: DataTypes.STRING,
   },
   SHIPZONE8A: {
      type: DataTypes.STRING,
   },
   SHIPZONE1A: {
      type: DataTypes.STRING,
   },
   SHIPZONE3E: {
      type: DataTypes.STRING,
   },
   SHIPZONE4E: {
      type: DataTypes.STRING,
   },
   SHIPZONE5E: {
      type: DataTypes.STRING,
   },
   SHIPZONE6E: {
      type: DataTypes.STRING,
   },
   SHIPZONE7E: {
      type: DataTypes.STRING,
   },
   SHIPZONE2E: {
      type: DataTypes.STRING,
   },
   SHIPZONE8E: {
      type: DataTypes.STRING,
   },
   SHIPZONE1E: {
      type: DataTypes.STRING,
   },
   SHIPZONE1D: {
      type: DataTypes.STRING,
   },
   SHIPZONE8D: {
      type: DataTypes.STRING,
   },
   SHIPZONE2D: {
      type: DataTypes.STRING,
   },
   SHIPZONE7D: {
      type: DataTypes.STRING,
   },
   SHIPZONE6D: {
      type: DataTypes.STRING,
   },
   SHIPZONE5D: {
      type: DataTypes.STRING,
   },
   SHIPZONE4D: {
      type: DataTypes.STRING,
   },
   SHIPZONE3D: {
      type: DataTypes.STRING,
   },
   SHIPZONE3C: {
      type: DataTypes.STRING,
   },
   SHIPZONE4C: {
      type: DataTypes.STRING,
   },
   SHIPZONE5C: {
      type: DataTypes.STRING,
   },
   SHIPZONE6C: {
      type: DataTypes.STRING,
   },
   SHIPZONE7C: {
      type: DataTypes.STRING,
   },
   SHIPZONE2C: {
      type: DataTypes.STRING,
   },
   SHIPZONE8C: {
      type: DataTypes.STRING,
   },
   SHIPZONE1C: {
      type: DataTypes.STRING,
   },
   SHIPZONE1B: {
      type: DataTypes.STRING,
   },
   SHIPZONE8B: {
      type: DataTypes.STRING,
   },
   SHIPZONE2B: {
      type: DataTypes.STRING,
   },
   SHIPZONE7B: {
      type: DataTypes.STRING,
   },
   SHIPZONE6B: {
      type: DataTypes.STRING,
   },
   SHIPZONE5B: {
      type: DataTypes.STRING,
   },
   SHIPZONE4B: {
      type: DataTypes.STRING,
   },
   SHIPZONE3B: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblShippingRates;