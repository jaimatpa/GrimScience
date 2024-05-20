import { getTableRowWhere } from "~/server/controller/CommonRead";
import jwt from 'jsonwebtoken';

export default eventHandler(async (event) => {
 try {
   const body = await readBody(event);
   const name = body.user.split(' ');
   const password = body.password;

   let response;

   const where = {
     fname: name[0],
     lname: name[1],
   }

   const userData = await getTableRowWhere({tblName:'tblEmployee', where});

   if (!userData) {
     response = {
       statusCode: 404,
       body: { error: "Username not found. Please check your username and try again." }
     };
   } else {
     if (password != userData.dataValues.SECURITYCODE) {
       response = {
         statusCode: 401,
         body:{ error: "Incorrect password. Please re-enter your password." }
       };
     } else {
        const authData = {
          fname: userData.fname, 
          lname: userData.lname, 
          password: userData.SECURITYCODE,
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        };
        const privateKey = 'Grimm';
       const token = jwt.sign(authData, privateKey);
       
       response = {
         statusCode: 200,
         body: userData,
         token: token
       };
     }
   }

   return response;
 } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
 }
});
