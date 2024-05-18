import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblComplaints = sequelize.define('tblComplaints', {
   uniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   instanceID: {
      type: DataTypes.INTEGER,
   },
   FAILINVEST: {
      type: DataTypes.STRING,
   },
   INJURYREPORT: {
      type: DataTypes.INTEGER,
   },
   COMPLAINT: {
      type: DataTypes.STRING,
   },
   COMPLAINTDATE: {
      type: DataTypes.DATE,
   },
   RECBY: {
      type: DataTypes.STRING,
   },
   DATERETURNED: {
      type: DataTypes.STRING,
   },
   ACCESSREC: {
      type: DataTypes.STRING,
   },
   DATERECEIVED: {
      type: DataTypes.STRING,
   },
   WARRANTYUNTIL: {
      type: DataTypes.STRING,
   },
   ORIGSHIPDATE: {
      type: DataTypes.STRING,
   },
   SERIALNO: {
      type: DataTypes.STRING,
   },
   MODELNO: {
      type: DataTypes.STRING,
   },
   PRODUCTDESC: {
      type: DataTypes.STRING,
   },
   STATE: {
      type: DataTypes.STRING,
   },
   REVIEWBY: {
      type: DataTypes.STRING,
   },
   REPORTBY: {
      type: DataTypes.STRING,
   },
   REVIEWBYDATE: {
      type: DataTypes.STRING,
   },
   REPORTBYDATE: {
      type: DataTypes.STRING,
   },
   DEATH: {
      type: DataTypes.STRING,
   },
   INJURYNATURE: {
      type: DataTypes.INTEGER,
   },
   UNDERCARE: {
      type: DataTypes.INTEGER,
   },
   LASTVISIT: {
      type: DataTypes.STRING,
   },
   PHYSNO: {
      type: DataTypes.STRING,
   },
   PHYSCOMMENTS: {
      type: DataTypes.STRING,
   },
   PHYSNAME: {
      type: DataTypes.STRING,
   },
   PHYSTREAT: {
      type: DataTypes.INTEGER,
   },
   HOSPNAME: {
      type: DataTypes.STRING,
   },
   PATIENTTREATED: {
      type: DataTypes.INTEGER,
   },
   INJURYDESC: {
      type: DataTypes.STRING,
   },
   WORKPHONE: {
      type: DataTypes.STRING,
   },
   HOMEPHONE: {
      type: DataTypes.STRING,
   },
   ZIP: {
      type: DataTypes.STRING,
   },
   CITY: {
      type: DataTypes.STRING,
   },
   DATEINJURED: {
      type: DataTypes.STRING,
   },
   ADDRESS: {
      type: DataTypes.STRING,
   },
   INJUREDNAME: {
      type: DataTypes.STRING,
   },
   TIMEREPORTED: {
      type: DataTypes.STRING,
   },
   DATEREPORTED: {
      type: DataTypes.STRING,
   },
   PERSONREPORTING: {
      type: DataTypes.STRING,
   },
   CustomerID: {
      type: DataTypes.INTEGER,
   },
   INJURYREPORTNO: {
      type: DataTypes.INTEGER,
   },
   INJURYREPORTYES: {
      type: DataTypes.INTEGER,
   },
   COMPLAINTNUMBER: {
      type: DataTypes.INTEGER,
   },
   SERIALID: {
      type: DataTypes.INTEGER,
   },
   CLOSED: {
      type: DataTypes.STRING,
   },
   OPENCASE: {
      type: DataTypes.STRING,
   },
   CLOSEDCASE: {
      type: DataTypes.STRING,
   },
   PRODUCTRETURNED: {
      type: DataTypes.STRING,
   },
   PERSONREPORTING2: {
      type: DataTypes.STRING,
   },
   DATEREPORTED2: {
      type: DataTypes.STRING,
   },
   TIMEREPORTED2: {
      type: DataTypes.STRING,
   },
   INJUREDNAME2: {
      type: DataTypes.STRING,
   },
   ADDRESS2: {
      type: DataTypes.STRING,
   },
   DATEINJURED2: {
      type: DataTypes.STRING,
   },
   CITY2: {
      type: DataTypes.STRING,
   },
   ZIP2: {
      type: DataTypes.STRING,
   },
   HOMEPHONE2: {
      type: DataTypes.STRING,
   },
   WORKPHONE2: {
      type: DataTypes.STRING,
   },
   INJURYDESC2: {
      type: DataTypes.STRING,
   },
   PATIENTTREATED2: {
      type: DataTypes.INTEGER,
   },
   HOSPNAME2: {
      type: DataTypes.STRING,
   },
   PHYSTREAT2: {
      type: DataTypes.INTEGER,
   },
   PHYSNAME2: {
      type: DataTypes.STRING,
   },
   PHYSCOMMENTS2: {
      type: DataTypes.STRING,
   },
   PHYSNO2: {
      type: DataTypes.STRING,
   },
   LASTVISIT2: {
      type: DataTypes.DATE,
   },
   UNDERCARE2: {
      type: DataTypes.INTEGER,
   },
   INJURYNATURE2: {
      type: DataTypes.INTEGER,
   },
   DEATH2: {
      type: DataTypes.DATE,
   },
   REPORTBYDATE2: {
      type: DataTypes.STRING,
   },
   REVIEWBYDATE2: {
      type: DataTypes.STRING,
   },
   REPORTBY2: {
      type: DataTypes.STRING,
   },
   REVIEWBY2: {
      type: DataTypes.STRING,
   },
   STATE2: {
      type: DataTypes.STRING,
   },
   ECO: {
      type: DataTypes.STRING,
   },
   NONCONFORMANCE: {
      type: DataTypes.STRING,
   },
   ValidComplaint: {
      type: DataTypes.STRING,
   },
   ValidComplaintReason: {
      type: DataTypes.STRING,
   },
   WarrentyService: {
      type: DataTypes.STRING,
   },
   ClosedOutBy: {
      type: DataTypes.STRING,
   },
   YoutrackComplaintID: {
      type: DataTypes.STRING,
   },
   YoutrackState: {
      type: DataTypes.STRING,
   },
   AssignedTo: {
      type: DataTypes.STRING,
   },
   DueDate: {
      type: DataTypes.STRING,
   },
   TicketFolder: {
      type: DataTypes.INTEGER,
   },
   Contracted: {
      type: DataTypes.INTEGER,
   },
}, {
   timestamps: false
});

export default tblComplaints;