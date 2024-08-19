import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblTerritoryStates = sequelize.define('tblTerritoryStates', {
   TerritoryStateID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   TerritoryID: {
      type: DataTypes.INTEGER,
   },
   StateID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblTerritoryStates;