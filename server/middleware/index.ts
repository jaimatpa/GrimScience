import { verifyToken } from '../utils/Token';  // Assuming the file path is correct

export default defineEventHandler(async (event) => {
  try {
    const path = event._path;
    console.log("--API PATH--", path);
    const pages = [
      "/login",
      "/signup",
      "/",
      "/users",
      "/inbox",
      "/settings",
      "/settings/members",
    ]
    if(pages.includes(path) && event._method === 'GET'){ // link in pages
      console.log("path links check")
    } else { // N
      const excludeLinks = [
        '/api/auth/login',
        '/',
        '/login',
        '/signup',
        '/users'
      ];
  
      if (!excludeLinks.includes(path)) {
        const authHeader = getHeader(event, 'Authorization');
        
        if (!authHeader) {
          console.error('Missing Authorization header');
          setResponseStatus(event, 401);
        return { error: "Unauthorized" };
        }

        const token: string = authHeader.split(' ')[1];
        
        if (!token) {
          console.error('Token missing in Authorization header');
          setResponseStatus(event, 401);
          return { error: "Unauthorized" };
        }
  
        const verifyResult: false | object = verifyToken(token);
  
        if (verifyResult === false) {
          console.error('Invalid token');
          setResponseStatus(event, 401);
          return { error: "Unauthorized" };
        }
      }
    }       
  } catch (error) {
    console.error('Error: ', error);
    setResponseStatus(event, 401);
    return { error: "Internal Server Error" };
  }
});
