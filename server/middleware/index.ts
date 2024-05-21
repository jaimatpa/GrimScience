import { verifyToken } from '../utils/Token';  // Assuming the file path is correct

export default defineEventHandler(async (event) => {
  try {
    const path = event._path;
    const headers = getHeaders(event);

    if(headers['user-agent'] && headers['user-agent'].startsWith('Mozilla')){
      console.log("--PAGE PATH--", path);

      const excludePages = [
        '/login',
        '/signup',
      ];

      if (!excludePages.includes(path)) {
        const cookies = parseCookies(event);
        console.log(cookies.token);
        if(!cookies.token || verifyToken(cookies.token) === false) await sendRedirect(event, '/login', 302)
      }
      
    }else{
      console.log("--API PATH--", path);

      const excludeAPIs = [
        '/api/auth/login',
      ];
  
      if (!excludeAPIs.includes(path)) {
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
