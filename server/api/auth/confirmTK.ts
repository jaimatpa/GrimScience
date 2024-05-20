import jwt from 'jsonwebtoken';

export default eventHandler(async (event) => {
  console.log("confirmTK tokenValidation", event.context.tokenValidation)
 try {
  // Get token from Header Authorization
  const token: string = getHeader(event, 'Authorization').split(' ')[1];
  let response;
  jwt.verify(token, process.env.JWT_SECRETKEY, (err, decoded) => {
    if(err) {
      throw err;
    } else {
      response =  {
        statusCode: 200,
        body: 'Token is valid!'
      }
    }
  })
  return response;
 } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
 }
});
