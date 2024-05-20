import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  try {
    // Get token from Header Authorization
    const path = event._path
    console.log("--------Server middleware path----------", path);
    const excludeLinks = [
      '/api/auth/login'
    ]
    if (!excludeLinks.includes(path)) {
      const token: string = getHeader(event, 'Authorization').split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
        if(err) {
          console.log("Server middleware jwt verify error", err.message)
          setResponseStatus(event, 404)
          // event.context.tokenValidation = false
        } else {
          console.log("Server middleware jwt decoded", decoded)
          // event.context.tokenValidation = true
        }
      })
    } else {
      console.log("**************")
      setResponseStatus(event, 404)
      return {}
    }
    
   } catch (error) {
      event.context.tokenValidation = false
   }
})
// import jwt from 'jsonwebtoken';
// export default function (req, res, next) {
//   try {
//     const path = req._path;
//     const excludeLinks = [
//       '/api/auth/login',
//       '/api/auth/signup'
//     ]
//     console.log("***************************", path, getHeader(req, 'Authorization'))
//     if (!excludeLinks.includes(path)) {
//       // Get token from Header Authorization
//       const token: string = getHeader(req, 'Authorization').split(' ')[1];
//       jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
//         if(err) {
//           throw err;
//         } else {
//           next();
//         }
//       })
//     } else {
//       next();
//     }
//     } catch (error) {
//       console.log("server middleware error", error)
//     }
// }
