import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblInvestigationComplaint = sequelize.define('tblInvestigationComplaint', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ComplaintID: {
      type: DataTypes.INTEGER,
   },
   investigationID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblInvestigationComplaint;