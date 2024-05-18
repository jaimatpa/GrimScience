import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblServiceReport = sequelize.define('tblServiceReport', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   REPAIRSMADE: {
      type: DataTypes.STRING,
   },
   REPAIRDESC: {
      type: DataTypes.INTEGER,
   },
   REPAIRDATE: {
      type: DataTypes.STRING,
   },
   REPAIRSBY: {
      type: DataTypes.STRING,
   },
   CANO: {
      type: DataTypes.STRING,
   },
   PARTSONORDER: {
      type: DataTypes.STRING,
   },
   COMPLAINTID: {
      type: DataTypes.INTEGER,
   },
   PARTTYPEBILLABLE: {
      type: DataTypes.INTEGER,
   },
   PARTTYPEWARRENTY: {
      type: DataTypes.INTEGER,
   },
   RETURNREQUIRED: {
      type: DataTypes.INTEGER,
   },
   INVOICE: {
      type: DataTypes.STRING,
   },
   INVOICETYPE: {
      type: DataTypes.INTEGER,
   },
   INVOICES: {
      type: DataTypes.STRING,
   },
   PARTS: {
      type: DataTypes.STRING,
   },
   Shipping: {
      type: DataTypes.FLOAT,
   },
   MAINTAINENCESERIAL: {
      type: DataTypes.STRING,
   },
   MAINTAINENCETEMPLATE: {
      type: DataTypes.STRING,
   },
   MAINTAINENCE: {
      type: DataTypes.STRING,
   },
   PARTSRECEIVED: {
      type: DataTypes.STRING,
   },
   MAINTAINDESCRIPTION: {
      type: DataTypes.STRING,
   },
   MAINTAINMONTHS: {
      type: DataTypes.STRING,
   },
   DATESHIPPED: {
      type: DataTypes.DATE,
   },
   performs_to_spec: {
      type: DataTypes.STRING,
   },
   performsnotext: {
      type: DataTypes.STRING,
   },
   TravelHours: {
      type: DataTypes.FLOAT,
   },
   OnsiteHours: {
      type: DataTypes.FLOAT,
   },
   TravelCost: {
      type: DataTypes.FLOAT,
   },
   OnsiteCost: {
      type: DataTypes.FLOAT,
   },
   ServiceStatus: {
      type: DataTypes.STRING,
   },
   Miles: {
      type: DataTypes.FLOAT,
   },
   ScheduledYear: {
      type: DataTypes.STRING,
   },
   ScheduledWeek: {
      type: DataTypes.STRING,
   },
   Year: {
      type: DataTypes.STRING,
   },
   Week: {
      type: DataTypes.STRING,
   },
   PerDiem: {
      type: DataTypes.FLOAT,
   },
   FactoryHours: {
      type: DataTypes.FLOAT,
   },
   YoutrackID: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblServiceReport;