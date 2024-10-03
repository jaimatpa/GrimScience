import { getApprovals, approvePlan } from '~/server/controller/engineering/Approvals'
import jwt_decode from "jwt-decode";

export default eventHandler(async (event) => {
  try {
    const { page, pageSize, sortBy, sortOrder, ...filterParams } = getQuery(event)
    const method = event.method // Correctly access the method

    switch (method.toUpperCase()) {
      case 'GET':
        // Fetch data from the database
        const list = await getApprovals(page, pageSize, sortBy, sortOrder, filterParams)
        return { body: list, message: '' }

      case 'PUT':

        const params = getQuery(event)
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
            
        console.log('approve API called:', params)

        const result = await approvePlan(parseInt(params?.uniqueID), parseInt(decodedToken?.UniqueID));
        return { body: result, message: 'Approved Successfully' }

      default:
        setResponseStatus(event, 405)
        return { error: 'Method Not Allowed' }
    }
  } catch (error) {
    console.error('Error in event handler:', error.message)
    return { error: `Error fetching data from table: ${error.message}` }
  }
})
