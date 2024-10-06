// server/api/insert-job-details.js (or any appropriate path)

import { insertOperationRework } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'POST':
        // Get the query parameters from the request URL and convert them to numbers
        const { JobID, OperationID, tblBPID, Qty } = getQuery(event);

        const numJobID = Number(JobID);
        const numOperationID = Number(OperationID);
        const numTblBPID = Number(tblBPID);
        const numQty = Number(Qty);

        // Call the function to insert the data
        await insertOperationRework(numJobID, numOperationID, numTblBPID, numQty);

        return { body: { message: 'Job details inserted successfully!' }, status: 201 };

      default:
        setResponseStatus(event, 405); // Method Not Allowed
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    return { body: { error: `Error processing request: ${error.message}` }, status: 500 };
  }
});
