import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblZipLocations = sequelize.define('tblZipLocations', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   Zipcode: {
      type: DataTypes.STRING,
   },
   Longitude: {
      type: DataTypes.STRING,
   },
   Latitude: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false,
   tableName: 'tblZipLocations',
});

export default tblZipLocations;