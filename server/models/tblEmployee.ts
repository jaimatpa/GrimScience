import { DataTypes } from 'sequelize';
import sequelize from "../utils/databse";

const tblEmployee = sequelize.define('tblEmployee', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   fname: {
      type: DataTypes.STRING,
   },
   mi: {
      type: DataTypes.STRING,
   },
   lname: {
      type: DataTypes.STRING,
   },
   address: {
      type: DataTypes.STRING,
   },
   city: {
      type: DataTypes.STRING,
   },
   state: {
      type: DataTypes.STRING,
   },
   zip: {
      type: DataTypes.STRING,
   },
   homephone: {
      type: DataTypes.STRING,
   },
   cellphone: {
      type: DataTypes.STRING,
   },
   email: {
      type: DataTypes.STRING,
   },
   CC: {
      type: DataTypes.STRING,
   },
   COMMENT: {
      type: DataTypes.STRING,
   },
   HIREDATE: {
      type: DataTypes.STRING,
   },
   DOB: {
      type: DataTypes.STRING,
   },
   SPEMAIL: {
      type: DataTypes.INTEGER,
   },
   SPCPHONE: {
      type: DataTypes.STRING,
   },
   SPWPHONE: {
      type: DataTypes.STRING,
   },
   PAYROLLNO: {
      type: DataTypes.STRING,
   },
   SSNO: {
      type: DataTypes.DATE,
   },
   EXEMPTIONS: {
      type: DataTypes.STRING,
   },
   SALARY: {
      type: DataTypes.STRING,
   },
   WORKCENTERS: {
      type: DataTypes.STRING,
   },
   ACTIVE: {
      type: DataTypes.BOOLEAN,
   },
   DOTERMINATION: {
      type: DataTypes.STRING,
   },
   SECURITYCODE: {
      type: DataTypes.STRING,
   },
   Evaluation: {
      type: DataTypes.STRING,
   },
   AnnualSalary: {
      type: DataTypes.DATE,
   },
   HourlyWage: {
      type: DataTypes.STRING,
   },
   HoursPerWeek: {
      type: DataTypes.STRING,
   },
   SpouseName: {
      type: DataTypes.STRING,
   },
   dateterminated: {
      type: DataTypes.TEXT,
   },
   department: {
      type: DataTypes.STRING,
   },
   EmployeePicture: {
      type: DataTypes.DATE,
   },
   payrollnumber: {
      type: DataTypes.INTEGER,
   },
   TrainingDate: {
      type: DataTypes.STRING,
   },
   responsibilities: {
      type: DataTypes.STRING,
   },
   qualifications: {
      type: DataTypes.STRING,
   },
   competencies: {
      type: DataTypes.STRING,
   },
   benefits: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false,
   tableName: 'tblEmployee',
});

export default tblEmployee;