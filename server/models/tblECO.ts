import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblECO = sequelize.define('tblECO', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   DOCUMENTSCHANGED: {
      type: DataTypes.STRING,
   },
   DISPOSITIONOFMATERIALS: {
      type: DataTypes.STRING,
   },
   APPROVALS: {
      type: DataTypes.STRING,
   },
   SIGNATURE: {
      type: DataTypes.STRING,
   },
   DISTRIBUTIONDATE: {
      type: DataTypes.STRING,
   },
   DISTRICUTIONLOCATION: {
      type: DataTypes.STRING,
   },
   DISTRICUTIONNAME: {
      type: DataTypes.STRING,
   },
   PRODUCT: {
      type: DataTypes.STRING,
   },
   ORIGINATORDATE: {
      type: DataTypes.STRING,
   },
   ORIGINATOR: {
      type: DataTypes.STRING,
   },
   DESCRIPTION: {
      type: DataTypes.STRING,
   },
   ISSUE: {
      type: DataTypes.STRING,
   },
   SOLUTION: {
      type: DataTypes.STRING,
   },
   REASONFORCHANGE: {
      type: DataTypes.STRING,
   },
   NUMBER: {
      type: DataTypes.INTEGER,
   },
   PART: {
      type: DataTypes.STRING,
   },
   WORKCENTER: {
      type: DataTypes.STRING,
   },
   PRODUCTS: {
      type: DataTypes.STRING,
   },
   MANDATEAPPROVED: {
      type: DataTypes.DATE,
   },
   MANAPPROVER: {
      type: DataTypes.STRING,
   },
   MANAPPROVAL: {
      type: DataTypes.STRING,
   },
   MANUFACTURING: {
      type: DataTypes.STRING,
   },
   MARDATEAPPROVED: {
      type: DataTypes.DATE,
   },
   MARAPPROVER: {
      type: DataTypes.STRING,
   },
   MARAPPROVAL: {
      type: DataTypes.STRING,
   },
   MARKETING: {
      type: DataTypes.STRING,
   },
   ENGDATEAPPROVED: {
      type: DataTypes.DATE,
   },
   ENGAPPROVER: {
      type: DataTypes.STRING,
   },
   ENGAPPROVAL: {
      type: DataTypes.STRING,
   },
   ENGINEERING: {
      type: DataTypes.STRING,
   },
   PARTS: {
      type: DataTypes.TEXT,
   },
   EQUIPMENT: {
      type: DataTypes.STRING,
   },
   COMMENTS: {
      type: DataTypes.DATE,
   },
   MANCOMMENTS: {
      type: DataTypes.STRING,
   },
   MARCOMMENTS: {
      type: DataTypes.STRING,
   },
   ENGCOMMENTS: {
      type: DataTypes.STRING,
   },
   APPROVAL: {
      type: DataTypes.STRING,
   },
   FromModel: {
      type: DataTypes.STRING,
   },
   ToModel: {
      type: DataTypes.STRING,
   },
   DetailReason: {
      type: DataTypes.STRING,
   },
   ProductsDetails: {
      type: DataTypes.TEXT,
   },
   PartsDetails: {
      type: DataTypes.TEXT,
   },
   VandVNotRequired: {
      type: DataTypes.STRING,
   },
   ProductLine: {
      type: DataTypes.STRING,
   },
   EngineeringWeek: {
      type: DataTypes.STRING,
   },
   DevSprintWeek: {
      type: DataTypes.STRING,
   },
   EngineerYTTicket: {
      type: DataTypes.STRING,
   },
   DevelopmentYTTicket: {
      type: DataTypes.STRING,
   },
   Estimate: {
      type: DataTypes.INTEGER,
   },
   JobNumber: {
      type: DataTypes.STRING,
   },
   ServiceOrderNumber: {
      type: DataTypes.STRING,
   },
   QuoteNumber: {
      type: DataTypes.STRING,
   },
}, {
   tableName: 'tblECO', 
   timestamps: false
});

export default tblECO;