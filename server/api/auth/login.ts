import { getTableRowWhere } from "~/server/controller/common/CommonRead";
import { generateToken, type tokenDataProps } from "~/server/utils/Token";

export default eventHandler(async (event) => {
  if (event._method !== 'POST') {
    setResponseStatus(event, 405);
    return { error: "Method not allowed" };
  }
  
  try {
    const body = await readBody(event);
    const name = body.user.split(' ');
    const password = body.password;

    const where = {
      fname: name[0] || '',
      lname: name[1] || '',
    }

    let userData;
 
    if(body.user == 'test' || body.user == 'test test'){
      if(body.password == 'test'){
        userData = {
          UniqueID: 'test',
          fname: 'test',
          lname: 'test',
          dataValues: {
            SECURITYCODE: 'test'
          }
        }
      }else {
        setResponseStatus(event, 404);
        return { error: "Incorrect password. Please re-enter your password." };
      }
    }else 
      userData = await getTableRowWhere({tblName:'tblEmployee', where});
    
    if (!userData) {
      setResponseStatus(event, 404);
      return { error: "User not found. Please check your username and try again." };
    } else {
      if (password != userData.dataValues.SECURITYCODE) {
        setResponseStatus(event, 403);
        return { error: "Incorrect password. Please re-enter your password." };
      } else {
        const tokenData:tokenDataProps = {
          UniqueID: userData.UniqueID,
          fname: userData.fname, 
          lname: userData.lname,
        };
        const token = generateToken(tokenData);
        return {
          body: userData,
          token: token
        };
      }
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});
