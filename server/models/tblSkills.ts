import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblSkills = sequelize.define('tblSkills', {
   VisitID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   VisitNumber: {
      type: DataTypes.INTEGER,
   },
   Status: {
      type: DataTypes.STRING,
   },
   VisitDate: {
      type: DataTypes.STRING,
   },
   Reason: {
      type: DataTypes.STRING,
   },
   '[By]': {
      type: DataTypes.STRING,
   },
   CustomerID: {
      type: DataTypes.INTEGER,
   },
   Comments: {
      type: DataTypes.STRING,
   },
   CreatedBy: {
      type: DataTypes.STRING,
   },
   CreatedDate: {
      type: DataTypes.STRING,
   },
   ProductLine: {
      type: DataTypes.STRING,
   },
   ComplaintNumber: {
      type: DataTypes.INTEGER,
   },
   InvoiceNumber: {
      type: DataTypes.STRING,
   },
   QuoteNumber: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblSkills;