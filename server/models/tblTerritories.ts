import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblTerritories = sequelize.define('tblTerritories', {
   TerritoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Name: {
      type: DataTypes.STRING,
   },
   SalesRep: {
      type: DataTypes.STRING,
   },
   ServiceTech: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblTerritories;