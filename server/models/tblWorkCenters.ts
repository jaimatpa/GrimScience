   import { DataTypes } from 'sequelize';
   import sequelize from "../utils/databse";

   const tblWorkCenters = sequelize.define('tblWorkCenters', {
      uniqueID: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true,
      },
      instanceID: {
         type: DataTypes.INTEGER,
      },
      NAME: {
         type: DataTypes.STRING,
      },
      NUMBER: {
         type: DataTypes.STRING,
      },
      position: {
         type: DataTypes.STRING,
      },
      QB_Activity: {
         type: DataTypes.STRING,
      },
      TimeEntryWithoutJob: {
         type: DataTypes.BOOLEAN,
      },
      Paid: {
         type: DataTypes.BOOLEAN,
      },
   }, {
      tableName: 'tblWorkCenters', 
      timestamps: false
   });

   export default tblWorkCenters;