import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblWorkOrders = sequelize.define('tblWorkOrders', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   NUMBER: {
      type: DataTypes.STRING,
   },
   ORDERNUMBER: {
      type: DataTypes.STRING,
   },
   COMPLAINT: {
      type: DataTypes.STRING,
   },
   PROJECTWORK: {
      type: DataTypes.TEXT,
   },
   OTHER: {
      type: DataTypes.TEXT,
   },
   WORKORDERDATE: {
      type: DataTypes.STRING,
   },
   COMPLAINTNUMBER: {
      type: DataTypes.STRING,
   },
   WORKCOMPLETIONDATE: {
      type: DataTypes.STRING,
   },
   CUSTOMERNUMBER: {
      type: DataTypes.STRING,
   },
   DUEDATE: {
      type: DataTypes.STRING,
   },
   CUSTOMER: {
      type: DataTypes.STRING,
   },
   QARELEASEDATE: {
      type: DataTypes.STRING,
   },
   SOURCE: {
      type: DataTypes.STRING,
   },
   PONUMBER: {
      type: DataTypes.STRING,
   },
   PHONE: {
      type: DataTypes.STRING,
   },
   WORKORDERDESCRIPTION: {
      type: DataTypes.TEXT,
   },
   WORKTOCOMPLETE: {
      type: DataTypes.TEXT,
   },
   WORKCOMPLETED: {
      type: DataTypes.TEXT,
   },
   SECURITYINFO: {
      type: DataTypes.TEXT,
   },
   QACHECKDATE: {
      type: DataTypes.STRING,
   },
   QANOTES: {
      type: DataTypes.TEXT,
   },
   STATUS: {
      type: DataTypes.STRING,
   },
   ASSIGNEDTO: {
      type: DataTypes.STRING,
   },
   ESTHOURS: {
      type: DataTypes.STRING,
   },
   HRSTOCOMPLETE: {
      type: DataTypes.STRING,
   },
   LASTMODIFIED: {
      type: DataTypes.STRING,
   },
   FIELS: {
      type: DataTypes.TEXT,
   },
   PRODUCTMODEL: {
      type: DataTypes.STRING,
   },
   SERIAL: {
      type: DataTypes.STRING,
   },
   CATEGORY: {
      type: DataTypes.STRING,
   },
   PIPELINE: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblWorkOrders;