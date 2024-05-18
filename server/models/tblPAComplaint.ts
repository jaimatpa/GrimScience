import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblPAComplaint = sequelize.define('tblPAComplaint', {
   uniqueid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   ComplaintID: {
      type: DataTypes.INTEGER,
   },
   PreventiveActionID: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblPAComplaint;