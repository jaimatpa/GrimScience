import { verifyToken } from '../utils/Token';

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
      '/api/auth/employees', 
      '/api/customers/exportlist',
      '/api/customers/exportorder'
    ];

    if(path.startsWith('/api/')){
      console.log("--API REQUEST--", path);

      if (!excludeAPIs.includes(path) && !excludeAPIs.includes(path.split('?')[0])) {
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
    }else if(headers['accept'].includes('text/html')){
      console.log("--DOCUMENT REQUEST--", path);

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
    }
  } catch (error) {
    console.error('Error: ', error);
    setResponseStatus(event, 401);
    return { error: "Internal Server Error" };
  }
});
