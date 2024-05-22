import { verifyToken } from '../utils/Token';  // Assuming the file path is correct

export default defineEventHandler(async (event) => {
  try {
    const path = event._path;
    const headers = getHeaders(event);

    const excludePages = [
      '/login',
      '/signup',
    ];

    const excludeAPIs = [
      '/api/auth/login',
    ];

    if(headers['sec-fetch-mode'] != 'cors' && headers['user-agent'] && headers['user-agent'].startsWith('Mozilla')){
      console.log("--Mozilla PATH--", path);

      if (!excludePages.includes(path) && !excludeAPIs.includes(path)) {
        const cookies = parseCookies(event);
        console.log(cookies.token);
        if(!cookies.token || verifyToken(cookies.token) === false){
          const response = new Response(null, {
            status: 302,
            headers: {
              'Location': '/login'
            }
          });
          return response;
        } 
      }
      
    }else{
      console.log("--API PATH--", path);
  
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
