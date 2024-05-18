import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblContact = sequelize.define('tblContact', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   CustomerID: {
      type: DataTypes.INTEGER,
   },
   DateTime: {
      type: DataTypes.STRING,
   },
   Status: {
      type: DataTypes.STRING,
   },
   ContactDescription: {
      type: DataTypes.STRING,
   },
   PreMeetingNotes: {
      type: DataTypes.STRING,
   },
   Catagory: {
      type: DataTypes.STRING,
   },
   SubCatagory: {
      type: DataTypes.STRING,
   },
   Files: {
      type: DataTypes.STRING,
   },
   NextExpectedDate: {
      type: DataTypes.STRING,
   },
   Employee: {
      type: DataTypes.STRING,
   },
   NextAction: {
      type: DataTypes.STRING,
   },
   CalanderItem: {
      type: DataTypes.INTEGER,
   },
   Job: {
      type: DataTypes.STRING,
   },
   TotalHrsWorked: {
      type: DataTypes.INTEGER,
   },
   BillableHrs: {
      type: DataTypes.INTEGER,
   },
   InvoiceID: {
      type: DataTypes.INTEGER,
   },
   BillabopenclosedleHrs: {
      type: DataTypes.INTEGER,
   },
   Quote: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblContact;