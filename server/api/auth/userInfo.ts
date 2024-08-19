import { getUserInfo } from "~/server/controller/auth";

export default eventHandler(async (event) => {
  try {
    const authHeader = getHeader(event, 'Authorization');
    const token: string = authHeader.split(' ')[1];

    const verifyResult: false | any = verifyToken(token);
    if (verifyResult === false) {
      console.error('Invalid token');
      setResponseStatus(event, 401);
      return { error: "Unauthorized" };
    }
    const UniqueID = verifyResult.UniqueID;
    const userInfo = await getUserInfo(UniqueID);
    if(userInfo){
      return { body: userInfo, message: '' }
    } else {
      setResponseStatus(event, 404);
      return { error: "User not found. Please check your username and try again." };
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});
