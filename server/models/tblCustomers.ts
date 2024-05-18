import { DataTypes } from 'sequelize';
import sequelize from "../database/databse";

const tblCustomers = sequelize.define('tblCustomers', {
   UniqueID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },
   market: {
      type: DataTypes.STRING,
   },
   number: {
      type: DataTypes.INTEGER,
   },
   source: {
      type: DataTypes.STRING,
   },
   sourcedescription: {
      type: DataTypes.STRING,
   },
   SourceConfrence: {
      type: DataTypes.STRING,
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
   title: {
      type: DataTypes.STRING,
   },
   position: {
      type: DataTypes.STRING,
   },
   company1: {
      type: DataTypes.STRING,
   },
   company2: {
      type: DataTypes.STRING,
   },
   country: {
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
   workphone: {
      type: DataTypes.STRING,
   },
   homephone: {
      type: DataTypes.STRING,
   },
   cellphone: {
      type: DataTypes.STRING,
   },
   fax: {
      type: DataTypes.STRING,
   },
   email: {
      type: DataTypes.STRING,
   },
   website: {
      type: DataTypes.STRING,
   },
   notes: {
      type: DataTypes.STRING,
   },
   billcompany1: {
      type: DataTypes.STRING,
   },
   billcompany2: {
      type: DataTypes.STRING,
   },
   billcountry: {
      type: DataTypes.STRING,
   },
   billaddress: {
      type: DataTypes.STRING,
   },
   billcity: {
      type: DataTypes.STRING,
   },
   billstate: {
      type: DataTypes.STRING,
   },
   billzip: {
      type: DataTypes.STRING,
   },
   billphone: {
      type: DataTypes.STRING,
   },
   billfax: {
      type: DataTypes.STRING,
   },
   attn: {
      type: DataTypes.STRING,
   },
   adddate: {
      type: DataTypes.DATE,
   },
   ParadynamixCatagory: {
      type: DataTypes.STRING,
   },
   fullname: {
      type: DataTypes.STRING,
   },
   Extension: {
      type: DataTypes.STRING,
   },
   ExtensionBill: {
      type: DataTypes.STRING,
   },
}, {
   timestamps: false
});

export default tblCustomers;