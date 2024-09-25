import { createLinkJob, getLinkJobs, deleteLinkedJob  } from "~/server/controller/jobs";

export default eventHandler(async (event) => {
  try {
    
    const method = event._method;
    console.log(method)
    switch(method.toUpperCase()){
      case 'GET':
        const { jobId } = getQuery(event);
        const list = await getLinkJobs(jobId);
        return { body: list, message: '' }
      case 'POST':
        const {job1, job2} = await readBody(event)
        await createLinkJob(job1, job2)
        return { body: '', message: 'Job linked successfully'}
      case 'DELETE':
        const {jobID, linkedJobId} = await readBody(event)
        await deleteLinkedJob(jobID, linkedJobId)
        return { body: '', message: ''}
      default:
        setResponseStatus(event, 405);
        return { error: 'Method Not Allowed' };
    }
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
});