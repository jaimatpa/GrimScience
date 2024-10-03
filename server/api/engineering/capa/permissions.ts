import { applyPermissions } from '~/server/controller/engineering/Capa'
import jwt_decode from "jwt-decode";

export default eventHandler(async (event) => {
  try {
    // const filterParams = getQuery(event);
    const method = event._method

    switch (method.toUpperCase()) {
      case 'GET':

        const authHeader = getHeader(event, 'Authorization')
        const token: string = authHeader.split(' ')[1]
        let decodedToken = null
        if (token) {
          decodedToken = jwt_decode(token)
          // console.log('Decoded Token:', decodedToken)
        } else {
          console.warn('No JWT token found in cookies.')
        }
        // console.log(authHeader)

        const result = await applyPermissions(parseInt(decodedToken?.UniqueID))
        return { body: result, message: '' }
      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    throw new Error(`Error fetching data from table: ${error.message}`)
  }
})
