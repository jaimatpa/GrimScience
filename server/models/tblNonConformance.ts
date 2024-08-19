import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblNonConformance = sequelize.define('tblNonConformance', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   QTY: {
      type: DataTypes.INTEGER,
   },
   SERIAL: {
      type: DataTypes.STRING,
   }, 
   DATEASSIGNED: {
      type: DataTypes.DATE
   },
   DISPOSITION: {
      type: DataTypes.STRING
   },
   REASONFORCHANGE: {
      type: DataTypes.STRING
   },
   SOLUTION: {
      type: DataTypes.STRING
   },
   ISSUE: {
      type: DataTypes.STRING
   },
   DESCRIPTION: {
      type: DataTypes.STRING
   },
   ORIGINATOR: {
      type: DataTypes.STRING
   },
   ORIGINATORDATE: {
      type: DataTypes.DATE
   },
   PRODUCT: {
      type: DataTypes.STRING
   },
   AUTHORIZEDBY: {
      type: DataTypes.STRING
   },
   ASSIGNEDTO: {
      type: DataTypes.STRING
   },
   DATEAUTHORIZED: {
      type: DataTypes.DATE
   },
   SIGNATURE: {
      type: DataTypes.STRING
   },
   APPROVALS: {
      type: DataTypes.STRING
   },
   PARTS: {
      type: DataTypes.STRING
   },
   DOCUMENTSCHANGED: {
      type: DataTypes.STRING
   },
   PRODUCTS: {
      type: DataTypes.STRING
   },
   WORKCENTER: {
      type: DataTypes.STRING
   },
   PART: {
      type: DataTypes.STRING
   },
   NUMBER: {
      type: DataTypes.STRING
   },
   PONUM: {
      type: DataTypes.INTEGER
   },
   COMPLAINTNUM: {
      type: DataTypes.INTEGER
   },
   ONORDER: {
      type: DataTypes.INTEGER
   },
   PARTID: {
      type: DataTypes.STRING
   },
   SERIALID: {
      type: DataTypes.STRING
   },
   STATUS: {
      type: DataTypes.STRING
   },
   TAGLOCATION: {
      type: DataTypes.STRING
   },
   TAGBY: {
      type: DataTypes.STRING
   },
   TAGQTY: {
      type: DataTypes.INTEGER
   },
   TAGDATE: {
      type: DataTypes.DATE
   },
   TAGASSIGNEDTO: {
      type: DataTypes.STRING
   },
   SERVICEREPORT: {
      type: DataTypes.INTEGER
   },
   OpenClosed: {
      type: DataTypes.STRING
   },
   Justification: {
      type: DataTypes.STRING
   },
   JobNum: {
      type: DataTypes.STRING
   },
   InvestigationNum: {
      type: DataTypes.STRING
   },
}, {
   tableName: 'tblNonConformance',
   timestamps: false
});

export default tblNonConformance;