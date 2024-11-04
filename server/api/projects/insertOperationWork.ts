
import { insertOperationRework } from '~/server/controller/projects/projects';

export default eventHandler(async (event) => {
  try {
    const method = event._method;

    switch (method.toUpperCase()) {
      case 'POST':
        const { JobID, OperationID, tblBPID, Qty } = getQuery(event);

        const numJobID = Number(JobID);
        const numOperationID = Number(OperationID);
        const numTblBPID = Number(tblBPID);
        const numQty = Number(Qty);

        await insertOperationRework(numJobID, numOperationID, numTblBPID, numQty);

        return { body: { message: 'Job details inserted successfully!' }, status: 201 };

      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    return { body: { error: `Error processing request: ${error.message}` }, status: 500 };
  }
});
